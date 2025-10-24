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

  try {
    const serviceTypes = await prisma.serviceType.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        _count: {
          select: {
            services: true
          }
        }
      }
    })

    return { serviceTypes }
  } catch (error) {
    console.error('Failed to fetch service types:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch service types'
    })
  } finally {
    await prisma.$disconnect()
  }
})
