import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Check authentication and admin role
  const { user } = await getUserSession(event)
  
  const userData = user as any
  if (!userData || userData.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Unauthorized - Admin access required'
    })
  }

  const serviceTypeId = getRouterParam(event, 'id')
  
  if (!serviceTypeId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Service type ID is required'
    })
  }

  try {
    // Check if there are services using this type
    const servicesCount = await prisma.service.count({
      where: { serviceTypeId }
    })

    if (servicesCount > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: `Cannot delete service type. ${servicesCount} service(s) are using this type. Please reassign or delete those services first.`
      })
    }

    const serviceType = await prisma.serviceType.delete({
      where: { id: serviceTypeId }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: userData.id,
        action: 'SERVICE_TYPE_DELETED',
        meta: {
          serviceTypeId: serviceType.id,
          name: serviceType.name
        }
      }
    })

    return { success: true, message: 'Service type deleted successfully' }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Service type not found'
      })
    }
    
    console.error('Failed to delete service type:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete service type'
    })
  } finally {
    await prisma.$disconnect()
  }
})
