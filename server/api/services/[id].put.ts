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
  const { name, description, serviceTypeId, location, price } = body
  
  // Validate required fields
  if (!name || !description || !serviceTypeId || !location || price === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'All fields are required'
    })
  }

  try {
    // Check if service exists and user is the owner
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
        statusMessage: 'You do not have permission to update this service'
      })
    }

    // Verify service type exists and is active
    const serviceType = await prisma.serviceType.findUnique({
      where: { id: serviceTypeId }
    })

    if (!serviceType || !serviceType.isActive) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid or inactive service type'
      })
    }

    // Update service
    const service = await prisma.service.update({
      where: { id: serviceId },
      data: {
        name,
        description,
        serviceTypeId,
        location,
        price: parseFloat(price)
      },
      include: {
        serviceType: true,
        media: {
          orderBy: {
            order: 'asc'
          }
        },
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
    
    console.error('Failed to update service:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update service'
    })
  } finally {
    await prisma.$disconnect()
  }
})
