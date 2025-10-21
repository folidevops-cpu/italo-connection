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

  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Mark all notifications as read
    await prisma.notification.updateMany({
      where: {
        userId: userData.id,
        read: false
      },
      data: {
        read: true
      }
    })

    await prisma.$disconnect()

    return {
      success: true,
      message: 'All notifications marked as read',
      unreadCount: 0
    }
  } catch (error: any) {
    console.error('Failed to mark all notifications as read:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update notifications'
    })
  }
})
