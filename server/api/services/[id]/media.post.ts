import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Check authentication
  const { user } = await getUserSession(event)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Please login'
    })
  }

  const serviceId = getRouterParam(event, 'id')
  
  if (!serviceId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Service ID is required'
    })
  }

  const body = await readBody(event)
  const { url, key, type, order } = body
  
  if (!url || !key) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Image URL and key are required'
    })
  }

  try {
    // Check if service exists and user is the owner
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        media: true
      }
    })

    if (!service) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Service not found'
      })
    }

    if (service.ownerId !== (user as any).id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You do not have permission to add images to this service'
      })
    }

    // Check if we've reached the maximum number of images
    if (service.media.length >= 4) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Maximum 4 images allowed per service'
      })
    }

    // Add image to service
    const media = await prisma.serviceMedia.create({
      data: {
        serviceId,
        url,
        key,
        type: type || 'image',
        order: order !== undefined ? order : service.media.length
      }
    })

    return { success: true, media }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Failed to add image:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to add image'
    })
  } finally {
    await prisma.$disconnect()
  }
})
