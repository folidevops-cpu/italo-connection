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

  try {
    const services = await prisma.service.findMany({
      where: {
        ownerId: (user as any).id
      },
      include: {
        serviceType: true,
        media: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { services }
  } catch (error) {
    console.error('Failed to fetch user services:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch services'
    })
  } finally {
    await prisma.$disconnect()
  }
})
