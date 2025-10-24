import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Check authentication and admin role
  const { user } = await getUserSession(event)
  
  const userData = user as any
  if (!userData || (userData.role !== 'ADMIN' && userData.role !== 'MODERATOR')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Unauthorized - Admin access required'
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
    const service = await prisma.service.update({
      where: { id: serviceId },
      data: {
        status: 'APPROVED'
      },
      include: {
        serviceType: true,
        owner: true
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: userData.id,
        action: 'SERVICE_APPROVED',
        meta: {
          serviceId: service.id,
          serviceName: service.name,
          ownerId: service.ownerId
        }
      }
    })

    // Create notification for service owner
    await prisma.notification.create({
      data: {
        userId: service.ownerId,
        type: 'SERVICE_APPROVED',
        payload: {
          serviceId: service.id,
          serviceName: service.name,
          message: `Your service "${service.name}" has been approved`
        }
      }
    })

    return { success: true, service }
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Service not found'
      })
    }
    
    console.error('Failed to approve service:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to approve service'
    })
  } finally {
    await prisma.$disconnect()
  }
})
