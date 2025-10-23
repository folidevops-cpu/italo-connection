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

    // Update user to unsuspended
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        suspended: false,
        suspendedAt: null,
        suspensionReason: null
      },
      include: {
        profile: true
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: userData.id,
        action: 'USER_UNSUSPENDED',
        meta: {
          targetUserId: userId,
          targetUserEmail: targetUser.email,
          unsuspendedBy: userData.email
        }
      }
    })

    // Create notification for user
    await prisma.notification.create({
      data: {
        userId: userId,
        type: 'ACCOUNT_RESTORED',
        channel: 'IN_APP',
        payload: {
          restoredAt: new Date().toISOString(),
          message: 'Your account has been restored and you can now use the platform again.'
        }
      }
    })

    return { 
      success: true, 
      message: 'User unsuspended successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        suspended: updatedUser.suspended
      }
    }
  } catch (error: any) {
    console.error('Failed to unsuspend user:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to unsuspend user'
    })
  } finally {
    await prisma.$disconnect()
  }
})
