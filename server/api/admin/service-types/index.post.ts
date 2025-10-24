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

  const body = await readBody(event)
  const { name, description, isActive = true } = body
  
  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name is required'
    })
  }

  try {
    const serviceType = await prisma.serviceType.create({
      data: {
        name,
        description,
        isActive
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: userData.id,
        action: 'SERVICE_TYPE_CREATED',
        meta: {
          serviceTypeId: serviceType.id,
          name: serviceType.name
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
    
    console.error('Failed to create service type:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create service type'
    })
  } finally {
    await prisma.$disconnect()
  }
})
