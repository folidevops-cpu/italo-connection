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

    // Fetch recent activity from audit logs
    const recentActivity = await prisma.auditLog.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            email: true,
            profile: {
              select: {
                displayName: true
              }
            }
          }
        }
      }
    })

    await prisma.$disconnect()

    return recentActivity
  } catch (error: any) {
    console.error('Failed to fetch admin activity:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch recent activity'
    })
  }
})
