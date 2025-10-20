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
  const limit = parseInt(query.limit as string) || 10
  const status = query.status as string || ''
  const type = query.type as string || ''
  const search = query.search as string || ''

  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { owner: { email: { contains: search, mode: 'insensitive' } } }
      ]
    }

    // Fetch listings with pagination
    const listings = await prisma.listing.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        media: {
          take: 1,
          orderBy: {
            order: 'asc'
          }
        },
        owner: {
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

    return listings
  } catch (error: any) {
    console.error('Failed to fetch listings:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch listings'
    })
  }
})
