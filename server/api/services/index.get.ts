import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { 
    serviceType, 
    search, 
    status = 'APPROVED',
    page = '1', 
    limit = '12' 
  } = query

  const pageNum = parseInt(page as string)
  const limitNum = parseInt(limit as string)
  const skip = (pageNum - 1) * limitNum

  try {
    const where: any = {
      status: status as string
    }

    // Filter by service type
    if (serviceType && serviceType !== 'all') {
      where.serviceTypeId = serviceType as string
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { location: { contains: search as string, mode: 'insensitive' } }
      ]
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: {
          serviceType: true,
          owner: {
            include: {
              profile: {
                select: {
                  displayName: true,
                  avatarUrl: true
                }
              }
            }
          },
          media: {
            orderBy: {
              order: 'asc'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limitNum
      }),
      prisma.service.count({ where })
    ])

    return {
      services,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    }
  } catch (error) {
    console.error('Failed to fetch services:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch services'
    })
  } finally {
    await prisma.$disconnect()
  }
})
