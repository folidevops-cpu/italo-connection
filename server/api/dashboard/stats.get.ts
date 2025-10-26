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

    // Fetch all stats in parallel
    const [
      totalListings,
      activeListings,
      totalServices,
      activeServices,
      unreadNotifications
    ] = await Promise.all([
      // Total listings
      prisma.listing.count({
        where: {
          ownerId: userData.id
        }
      }),
      // Active (approved) listings
      prisma.listing.count({
        where: {
          ownerId: userData.id,
          status: 'APPROVED'
        }
      }),
      // Total services
      prisma.service.count({
        where: {
          ownerId: userData.id
        }
      }),
      // Active services (approved)
      prisma.service.count({
        where: {
          ownerId: userData.id,
          status: 'APPROVED'
        }
      }),
      // Unread notifications
      prisma.notification.count({
        where: {
          userId: userData.id,
          read: false
        }
      })
    ])

    await prisma.$disconnect()

    return {
      totalListings,
      activeListings,
      totalServices,
      activeServices,
      unreadNotifications,
      // Profile views would require implementing a views tracking system
      // For now, return 0
      profileViews: 0
    }
  } catch (error: any) {
    console.error('Failed to fetch dashboard stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch dashboard statistics'
    })
  }
})
