export default defineEventHandler(async (event) => {
  // Check if user is authenticated and is admin
  const { user } = await getUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const userData = user as any
  if (userData.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden - Admin access required'
    })
  }

  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Get total users count
    const totalUsers = await prisma.user.count()

    // Get total listings count
    const totalListings = await prisma.listing.count()

    // Get pending listings count
    const pendingListings = await prisma.listing.count({
      where: {
        status: 'PENDING'
      }
    })

    // Get unverified users count
    const unverifiedUsers = await prisma.user.count({
      where: {
        emailVerified: false
      }
    })

    await prisma.$disconnect()

    return {
      totalUsers,
      totalListings,
      pendingListings,
      unverifiedUsers
    }
  } catch (error: any) {
    console.error('Failed to fetch admin stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch admin statistics'
    })
  }
})
