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

    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        userId: userData.id,
        read: false
      }
    })

    await prisma.$disconnect()

    return {
      unreadCount
    }
  } catch (error: any) {
    console.error('Failed to fetch unread count:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch unread count'
    })
  }
})
