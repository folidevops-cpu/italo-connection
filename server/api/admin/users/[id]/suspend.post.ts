import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Check authentication and admin role
  const { user } = await getUserSession(event)
  
  const userData = user as any
  if (!userData || (userData.role !== 'ADMIN' && userData.role !== 'MODERATOR')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Unauthorized - Admin access required'
    })
  }

  const userId = getRouterParam(event, 'id')
  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  const body = await readBody(event)
  const { reason } = body
  
  try {
    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    })

    if (!targetUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Prevent suspending admins
    if (targetUser.role === 'ADMIN') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Cannot suspend admin users'
      })
    }

    // Update user to suspended
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        suspended: true,
        suspendedAt: new Date(),
        suspensionReason: reason || 'No reason provided',
        emailVerified: false,
        phoneVerified: false
      },
      include: {
        profile: true
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: userData.id,
        action: 'USER_SUSPENDED',
        meta: {
          targetUserId: userId,
          targetUserEmail: targetUser.email,
          reason: reason || 'No reason provided',
          suspendedBy: userData.email
        }
      }
    })

    // Create notification for user
    await prisma.notification.create({
      data: {
        userId: targetUser.id,
        type: 'ACCOUNT_SUSPENDED',
        title: 'Account Suspended',
        message: `Your account has been suspended. Reason: ${reason || 'No reason provided'}`,
      },
    })

    // Send email notification to user
    try {
      await sendAccountSuspendedEmail(
        targetUser.email,
        targetUser.profile?.displayName || targetUser.email,
        reason || 'No reason provided'
      )
    } catch (emailError) {
      console.error('Failed to send suspension email:', emailError)
      // Continue even if email fails - suspension is still active
    }

    return { 
      success: true, 
      message: 'User suspended successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        suspended: updatedUser.suspended,
        suspendedAt: updatedUser.suspendedAt,
        suspensionReason: updatedUser.suspensionReason
      }
    }
  } catch (error: any) {
    console.error('Failed to suspend user:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to suspend user'
    })
  } finally {
    await prisma.$disconnect()
  }
})
