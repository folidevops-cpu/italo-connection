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

  const body = await readBody(event)
  const { type, title, description, price, availableFrom, capacity, sharedSlots, images } = body

  // Validate required fields
  if (!type || !title || !description || !price) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: type, title, description, price'
    })
  }

  // Validate listing type
  if (!['item', 'room_single', 'room_shared'].includes(type)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid listing type'
    })
  }

  // Validate price
  if (price <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Price must be greater than 0'
    })
  }

  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Check if listing exists and belongs to user
    const existingListing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        media: true
      }
    })

    if (!existingListing) {
      await prisma.$disconnect()
      throw createError({
        statusCode: 404,
        statusMessage: 'Listing not found'
      })
    }

    if (existingListing.ownerId !== userData.id) {
      await prisma.$disconnect()
      throw createError({
        statusCode: 403,
        statusMessage: 'You do not have permission to edit this listing'
      })
    }

    // Update listing
    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        type,
        title,
        description,
        price,
        availableFrom: availableFrom ? new Date(availableFrom) : null,
        capacity: capacity || null,
        sharedSlots: sharedSlots || null,
        // If images are provided, delete old ones and create new ones
        ...(images && {
          media: {
            deleteMany: {},
            create: images.map((img: any) => ({
              url: img.url,
              key: img.key,
              type: img.type || 'image',
              order: img.order || 0
            }))
          }
        })
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true
              }
            }
          }
        },
        media: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    await prisma.$disconnect()

    return updatedListing
  } catch (error: any) {
    console.error('Failed to update listing:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update listing'
    })
  }
})
