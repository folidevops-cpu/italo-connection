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

    // Fetch unverified users
    const unverifiedUsers = await prisma.user.findMany({
      where: {
        emailVerified: false
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        profile: {
          select: {
            displayName: true
          }
        }
      }
    })

    await prisma.$disconnect()

    return unverifiedUsers
  } catch (error: any) {
    console.error('Failed to fetch unverified users:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch unverified users'
    })
  }
})
