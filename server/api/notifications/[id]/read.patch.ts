export default defineEventHandler(async (event) => {
  // Check authentication
  const { user } = await getUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const userData = user as any
  const notificationId = getRouterParam(event, 'id')

  if (!notificationId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Notification ID is required'
    })
  }

  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Check if notification exists and belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    })

    if (!notification) {
      await prisma.$disconnect()
      throw createError({
        statusCode: 404,
        statusMessage: 'Notification not found'
      })
    }

    if (notification.userId !== userData.id) {
      await prisma.$disconnect()
      throw createError({
        statusCode: 403,
        statusMessage: 'You do not have permission to update this notification'
      })
    }

    // Mark as read
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    })

    // Get updated unread count
    const unreadCount = await prisma.notification.count({
      where: {
        userId: userData.id,
        read: false
      }
    })

    await prisma.$disconnect()

    return {
      success: true,
      notification: updatedNotification,
      unreadCount
    }
  } catch (error: any) {
    console.error('Failed to mark notification as read:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update notification'
    })
  }
})
