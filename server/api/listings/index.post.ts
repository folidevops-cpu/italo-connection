import { requireEmailVerification } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check authentication and email verification
  const userData = await requireEmailVerification(event)

  const body = await readBody(event)
  const { type, title, description, price, location, availableFrom, capacity, sharedSlots, images } = body

  // Validate required fields
  if (!type || !title || !description || !price) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: type, title, description, price'
    })
  }

  // Validate images
  if (!images || !Array.isArray(images) || images.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'At least one image is required'
    })
  }

  if (images.length > 4) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Maximum 4 images allowed'
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

    // Get user's profile to get coordinates
    const userProfile = await prisma.profile.findUnique({
      where: { userId: userData.id },
      select: { latitude: true, longitude: true }
    })

    // Create listing with images in a transaction
    const listing = await prisma.listing.create({
      data: {
        ownerId: userData.id,
        type,
        title,
        description,
        price,
        status: 'PENDING',
        latitude: userProfile?.latitude || null,
        longitude: userProfile?.longitude || null,
        availableFrom: availableFrom ? new Date(availableFrom) : null,
        capacity: capacity || null,
        sharedSlots: sharedSlots || null,
        // Create media records for images
        media: {
          create: images.map((img: any) => ({
            url: img.url,
            key: img.key,
            type: img.type || 'image',
            order: img.order || 0
          }))
        }
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

    return listing
  } catch (error: any) {
    console.error('Failed to create listing:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create listing'
    })
  }
})