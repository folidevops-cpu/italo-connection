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

  const query = getQuery(event)
  const { 
    status, 
    serviceType,
    page = '1', 
    limit = '20' 
  } = query

  const pageNum = parseInt(page as string)
  const limitNum = parseInt(limit as string)
  const skip = (pageNum - 1) * limitNum

  try {
    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (serviceType && serviceType !== 'all') {
      where.serviceTypeId = serviceType
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
            },
            take: 1
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
