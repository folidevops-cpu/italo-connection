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

  // Get query parameters
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 50
  const action = query.action as string || ''
  const userId = query.userId as string || ''
  const dateRange = query.dateRange as string || ''

  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Build where clause
    const where: any = {}

    if (action) {
      where.action = action
    }

    if (userId) {
      where.userId = userId
    }

    if (dateRange) {
      const now = new Date()
      let startDate: Date

      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        default:
          startDate = new Date(0) // Beginning of time
      }

      where.createdAt = {
        gte: startDate
      }
    }

    // Fetch logs with pagination
    const logs = await prisma.auditLog.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
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

    return logs
  } catch (error: any) {
    console.error('Failed to fetch audit logs:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch audit logs'
    })
  }
})
