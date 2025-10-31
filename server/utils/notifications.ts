import type { PrismaClient } from '@prisma/client'
import { sendNewNotificationEmail } from './email'

export type NotificationType = 
  | 'EMAIL_VERIFIED'
  | 'LISTING_APPROVED'
  | 'LISTING_REJECTED'
  | 'LISTING_DELETED'
  | 'NEW_INQUIRY'
  | 'NEW_MESSAGE'
  | 'ACCOUNT_SUSPENDED'
  | 'LISTING_UPDATED'
  | 'ADMIN_MESSAGE'
  | 'VERIFICATION_REMINDER'

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS'

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  channel?: NotificationChannel
  payload: Record<string, any>
  sendEmail?: boolean // Optional flag to send email alert
}

/**
 * Create a notification for a user
 */
export const createNotification = async (
  prisma: PrismaClient,
  params: CreateNotificationParams
): Promise<any> => {
  try {
    // Create the notification in database
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        channel: params.channel || 'IN_APP',
        payload: params.payload,
        read: false
      }
    })

    console.log(`✅ Notification created: ${params.type} for user ${params.userId}`)

    // Send email alert if requested (default: true)
    if (params.sendEmail !== false) {
      try {
        // Fetch user details for email
        const user = await prisma.user.findUnique({
          where: { id: params.userId },
          select: { 
            email: true, 
            profile: {
              select: { displayName: true, firstName: true }
            }
          }
        })

        if (user && user.email) {
          console.log(`📧 Sending email alert to ${user.email}...`)
          const userName = user.profile?.displayName || user.profile?.firstName || 'User'
          await sendNewNotificationEmail(
            user.email,
            userName,
            1
          )
          console.log(`✅ Email alert sent successfully`)
        } else {
          console.log(`⚠️ No email found for user ${params.userId}`)
        }
      } catch (emailError) {
        // Don't fail notification creation if email fails
        console.error('❌ Failed to send email alert (notification still created):', emailError)
      }
    }

    return notification
  } catch (error) {
    console.error('Failed to create notification:', error)
    throw error
  }
}

/**
 * Create multiple notifications at once
 */
export const createNotifications = async (
  prisma: PrismaClient,
  notifications: CreateNotificationParams[]
): Promise<any[]> => {
  try {
    const result = await prisma.notification.createMany({
      data: notifications.map(n => ({
        userId: n.userId,
        type: n.type,
        channel: n.channel || 'IN_APP',
        payload: n.payload,
        read: false
      }))
    })

    console.log(`Created ${result.count} notifications`)
    return []
  } catch (error) {
    console.error('Failed to create notifications:', error)
    throw error
  }
}

/**
 * Get notification message template based on type
 */
export const getNotificationMessage = (
  type: NotificationType,
  payload: Record<string, any>
): string => {
  switch (type) {
    case 'EMAIL_VERIFIED':
      return '🎉 Your email has been verified successfully!'
    
    case 'LISTING_APPROVED':
      return `✅ Your listing "${payload.listingTitle}" has been approved and is now live!`
    
    case 'LISTING_REJECTED':
      return `❌ Your listing "${payload.listingTitle}" was rejected. Reason: ${payload.reason || 'Not specified'}`
    
    case 'LISTING_DELETED':
      return `🗑️ Your listing "${payload.listingTitle}" has been deleted successfully`
    
    case 'NEW_INQUIRY':
      return `💬 You have a new inquiry about "${payload.listingTitle}"`
    
    case 'NEW_MESSAGE':
      return `📩 You have a new message from ${payload.senderName}`
    
    case 'ACCOUNT_SUSPENDED':
      return `⚠️ Your account has been suspended. ${payload.message || 'Please contact support.'}`
    
    case 'LISTING_UPDATED':
      return `📝 Your listing "${payload.listingTitle}" has been updated`
    
    case 'ADMIN_MESSAGE':
      return `📢 Admin: ${payload.message}`
    
    case 'VERIFICATION_REMINDER':
      return `⏰ Reminder: Please verify your email to start posting listings`
    
    default:
      return 'You have a new notification'
  }
}

/**
 * Notification helpers for common scenarios
 */
export const NotificationHelpers = {
  async emailVerified(prisma: PrismaClient, userId: string) {
    return createNotification(prisma, {
      userId,
      type: 'EMAIL_VERIFIED',
      payload: {
        verifiedAt: new Date().toISOString()
      }
    })
  },

  async listingApproved(prisma: PrismaClient, userId: string, listingTitle: string, listingId: string) {
    // Get user details for email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        email: true, 
        profile: {
          select: { displayName: true, firstName: true }
        }
      }
    })

    // Create in-app notification
    const notification = await createNotification(prisma, {
      userId,
      type: 'LISTING_APPROVED',
      payload: {
        listingTitle,
        listingId,
        approvedAt: new Date().toISOString()
      },
      sendEmail: false // We'll send custom email below
    })

    // Send specific approval email
    if (user && user.email) {
      try {
        const { sendListingApprovedEmail } = await import('./email')
        const userName = user.profile?.displayName || user.profile?.firstName || 'User'
        await sendListingApprovedEmail(
          user.email,
          userName,
          listingTitle,
          listingId
        )
        console.log(`✅ Listing approval email sent to ${user.email}`)
      } catch (emailError) {
        console.error('❌ Failed to send listing approval email:', emailError)
      }
    }

    return notification
  },

  async listingRejected(prisma: PrismaClient, userId: string, listingTitle: string, listingId: string, reason: string) {
    // Get user details for email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        email: true, 
        profile: {
          select: { displayName: true, firstName: true }
        }
      }
    })

    // Create in-app notification
    const notification = await createNotification(prisma, {
      userId,
      type: 'LISTING_REJECTED',
      payload: {
        listingTitle,
        listingId,
        reason,
        rejectedAt: new Date().toISOString()
      },
      sendEmail: false // We'll send custom email below
    })

    // Send specific rejection email
    if (user && user.email) {
      try {
        const { sendListingRejectedEmail } = await import('./email')
        const userName = user.profile?.displayName || user.profile?.firstName || 'User'
        await sendListingRejectedEmail(
          user.email,
          userName,
          listingTitle,
          reason
        )
        console.log(`✅ Listing rejection email sent to ${user.email}`)
      } catch (emailError) {
        console.error('❌ Failed to send listing rejection email:', emailError)
      }
    }

    return notification
  },

  async listingDeleted(prisma: PrismaClient, userId: string, listingTitle: string) {
    // Get user details for email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        email: true, 
        profile: {
          select: { displayName: true, firstName: true }
        }
      }
    })

    // Create in-app notification
    const notification = await createNotification(prisma, {
      userId,
      type: 'LISTING_DELETED',
      payload: {
        listingTitle,
        deletedAt: new Date().toISOString()
      },
      sendEmail: false // We'll send custom email below
    })

    // Send specific deletion email
    if (user && user.email) {
      try {
        const { sendListingDeletedEmail } = await import('./email')
        const userName = user.profile?.displayName || user.profile?.firstName || 'User'
        await sendListingDeletedEmail(
          user.email,
          userName,
          listingTitle
        )
        console.log(`✅ Listing deletion email sent to ${user.email}`)
      } catch (emailError) {
        console.error('❌ Failed to send listing deletion email:', emailError)
      }
    }

    return notification
  },

  async newInquiry(prisma: PrismaClient, userId: string, listingTitle: string, listingId: string, inquirerName: string) {
    return createNotification(prisma, {
      userId,
      type: 'NEW_INQUIRY',
      payload: {
        listingTitle,
        listingId,
        inquirerName,
        createdAt: new Date().toISOString()
      }
    })
  },

  async adminMessage(prisma: PrismaClient, userId: string, message: string) {
    return createNotification(prisma, {
      userId,
      type: 'ADMIN_MESSAGE',
      payload: {
        message,
        sentAt: new Date().toISOString()
      }
    })
  },

  async verificationReminder(prisma: PrismaClient, userId: string) {
    return createNotification(prisma, {
      userId,
      type: 'VERIFICATION_REMINDER',
      payload: {
        sentAt: new Date().toISOString()
      }
    })
  }
}
