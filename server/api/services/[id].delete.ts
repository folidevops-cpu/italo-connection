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

  try {
    // Check if service exists and belongs to user
    const existingService = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!existingService) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Service not found'
      })
    }

    if (existingService.ownerId !== (user as any).id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You do not have permission to delete this service'
      })
    }

    // Delete service (media will be cascade deleted)
    await prisma.service.delete({
      where: { id: serviceId }
    })

    return { success: true, message: 'Service deleted successfully' }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Failed to delete service:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete service'
    })
  } finally {
    await prisma.$disconnect()
  }
})
