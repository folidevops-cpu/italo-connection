import { PrismaClient } from '@prisma/client'
import { sortByDistance } from '../../utils/distance'

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
  const userLat = query.userLat ? parseFloat(query.userLat as string) : undefined
  const userLon = query.userLon ? parseFloat(query.userLon as string) : undefined

  try {
    const where: any = {
      status: status as string,
      owner: {
        deletedAt: null // Exclude services from deleted users
      }
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

    let services
    let total
    
    // If user location is provided, sort by distance
    if (userLat && userLon) {
      // Fetch all services matching the filter
      const allServices = await prisma.service.findMany({
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
        }
      })
      
      // Sort by distance
      const sortedServices = sortByDistance(allServices, userLat, userLon)
      
      // Apply pagination after sorting
      services = sortedServices.slice(skip, skip + limitNum)
      total = sortedServices.length
    } else {
      // Normal query without location sorting
      [services, total] = await Promise.all([
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
    }

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
