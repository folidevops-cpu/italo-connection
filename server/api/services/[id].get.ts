import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const serviceId = getRouterParam(event, 'id')
  
  if (!serviceId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Service ID is required'
    })
  }

  try {
    const service = await prisma.service.findFirst({
      where: { 
        id: serviceId,
        owner: {
          deletedAt: null // Exclude services from deleted users
        }
      },
      include: {
        serviceType: true,
        owner: {
          include: {
            profile: true
          }
        },
        media: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })
    
    if (!service) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Service not found or owner account has been deleted'
      })
    }    return service
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Failed to fetch service:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch service'
    })
  } finally {
    await prisma.$disconnect()
  }
})
