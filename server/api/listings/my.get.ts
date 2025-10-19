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

    // Get query parameters for pagination
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const skip = (page - 1) * limit

    // Fetch user's listings
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where: {
          ownerId: userData.id
        },
        include: {
          media: {
            orderBy: {
              order: 'asc'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.listing.count({
        where: {
          ownerId: userData.id
        }
      })
    ])

    await prisma.$disconnect()

    return {
      listings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  } catch (error: any) {
    console.error('Failed to fetch user listings:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch listings'
    })
  }
})
