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

  const serviceTypeId = getRouterParam(event, 'id')
  
  if (!serviceTypeId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Service type ID is required'
    })
  }

  const body = await readBody(event)
  const { name, description, isActive } = body

  try {
    const serviceType = await prisma.serviceType.update({
      where: { id: serviceTypeId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive })
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: userData.id,
        action: 'SERVICE_TYPE_UPDATED',
        meta: {
          serviceTypeId: serviceType.id,
          name: serviceType.name,
          updates: body
        }
      }
    })

    return { success: true, serviceType }
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Service type with this name already exists'
      })
    }
    
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Service type not found'
      })
    }
    
    console.error('Failed to update service type:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update service type'
    })
  } finally {
    await prisma.$disconnect()
  }
})
