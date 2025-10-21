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
  
  // Get query parameters for filtering and pagination
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 20
  const offset = parseInt(query.offset as string) || 0
  const unreadOnly = query.unreadOnly === 'true'

  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Build where clause
    const where: any = {
      userId: userData.id
    }

    if (unreadOnly) {
      where.read = false
    }

    // Fetch notifications
    const [notifications, totalCount, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: offset
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          userId: userData.id,
          read: false
        }
      })
    ])

    await prisma.$disconnect()

    return {
      notifications,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      unreadCount
    }
  } catch (error: any) {
    console.error('Failed to fetch notifications:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch notifications'
    })
  }
})
