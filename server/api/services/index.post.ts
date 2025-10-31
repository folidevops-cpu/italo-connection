import { PrismaClient } from '@prisma/client'
import { requireEmailVerification } from '../../utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Check authentication and email verification
  const userData = await requireEmailVerification(event)

  const body = await readBody(event)
  const { name, description, serviceTypeId, location, price, images } = body
  
  // Debug log
  console.log('Creating service with images:', images ? images.length : 0, 'images')
  
  // Validate required fields
  if (!name || !description || !serviceTypeId || !location || !price) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name, description, service type, location, and price are required'
    })
  }

  try {
    // Verify service type exists
    const serviceType = await prisma.serviceType.findUnique({
      where: { id: serviceTypeId }
    })

    if (!serviceType || !serviceType.isActive) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid or inactive service type'
      })
    }

    // Get user's profile to get coordinates
    const userProfile = await prisma.profile.findUnique({
      where: { userId: userData.id },
      select: { latitude: true, longitude: true }
    })

    // Create service with media
    const service = await prisma.service.create({
      data: {
        name,
        description,
        serviceTypeId,
        location,
        latitude: userProfile?.latitude || null,
        longitude: userProfile?.longitude || null,
        price: parseFloat(price),
        ownerId: userData.id,
        status: 'APPROVED',
        media: images && images.length > 0 ? {
          create: images.map((media: any, index: number) => ({
            url: media.url,
            key: media.key,
            type: media.type || 'image',
            order: index
          }))
        } : undefined
      },
      include: {
        serviceType: true,
        media: true,
        owner: {
          include: {
            profile: true
          }
        }
      }
    })

    return { success: true, service }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Failed to create service:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create service'
    })
  } finally {
    await prisma.$disconnect()
  }
})
