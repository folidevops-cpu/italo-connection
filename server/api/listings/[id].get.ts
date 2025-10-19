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
  const listingId = getRouterParam(event, 'id')

  if (!listingId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Listing ID is required'
    })
  }

  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Fetch listing with media
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        media: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    await prisma.$disconnect()

    if (!listing) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Listing not found'
      })
    }

    // Check if user owns the listing
    if (listing.ownerId !== userData.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You do not have permission to view this listing'
      })
    }

    return listing
  } catch (error: any) {
    console.error('Failed to fetch listing:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch listing'
    })
  }
})
