import type { PrismaClient } from '@prisma/client'

export type NotificationType = 
  | 'EMAIL_VERIFIED'
  | 'PHONE_VERIFIED'
  | 'LISTING_APPROVED'
  | 'LISTING_REJECTED'
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
}

/**
 * Create a notification for a user
 */
export const createNotification = async (
  prisma: PrismaClient,
  params: CreateNotificationParams
): Promise<any> => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        channel: params.channel || 'IN_APP',
        payload: params.payload,
        read: false
      }
    })

    console.log(`Notification created: ${params.type} for user ${params.userId}`)
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
    
    case 'PHONE_VERIFIED':
      return '🎉 Your phone number has been verified successfully!'
    
    case 'LISTING_APPROVED':
      return `✅ Your listing "${payload.listingTitle}" has been approved and is now live!`
    
    case 'LISTING_REJECTED':
      return `❌ Your listing "${payload.listingTitle}" was rejected. Reason: ${payload.reason || 'Not specified'}`
    
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
      return `⏰ Reminder: Please verify your ${payload.verificationType} to start posting listings`
    
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

  async phoneVerified(prisma: PrismaClient, userId: string) {
    return createNotification(prisma, {
      userId,
      type: 'PHONE_VERIFIED',
      payload: {
        verifiedAt: new Date().toISOString()
      }
    })
  },

  async listingApproved(prisma: PrismaClient, userId: string, listingTitle: string, listingId: string) {
    return createNotification(prisma, {
      userId,
      type: 'LISTING_APPROVED',
      payload: {
        listingTitle,
        listingId,
        approvedAt: new Date().toISOString()
      }
    })
  },

  async listingRejected(prisma: PrismaClient, userId: string, listingTitle: string, listingId: string, reason: string) {
    return createNotification(prisma, {
      userId,
      type: 'LISTING_REJECTED',
      payload: {
        listingTitle,
        listingId,
        reason,
        rejectedAt: new Date().toISOString()
      }
    })
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

  async verificationReminder(prisma: PrismaClient, userId: string, verificationType: 'email' | 'phone') {
    return createNotification(prisma, {
      userId,
      type: 'VERIFICATION_REMINDER',
      payload: {
        verificationType,
        sentAt: new Date().toISOString()
      }
    })
  }
}
