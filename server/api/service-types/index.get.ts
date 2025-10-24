import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
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
