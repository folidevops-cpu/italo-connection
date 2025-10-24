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
  const mediaId = getRouterParam(event, 'mediaId')
  
  if (!serviceId || !mediaId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Service ID and Media ID are required'
    })
  }

  try {
    // Check if media exists and user is the owner
    const media = await prisma.serviceMedia.findUnique({
      where: { id: mediaId },
      include: {
        service: true
      }
    })

    if (!media) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Image not found'
      })
    }

    if (media.service.ownerId !== (user as any).id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You do not have permission to delete this image'
      })
    }

    // Delete image from database (S3 cleanup would happen here if needed)
    await prisma.serviceMedia.delete({
      where: { id: mediaId }
    })

    return { success: true, message: 'Image deleted successfully' }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Failed to delete image:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete image'
    })
  } finally {
    await prisma.$disconnect()
  }
})
