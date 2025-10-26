import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchQuery = query.q as string

  if (!searchQuery || searchQuery.trim() === '') {
    return {
      listings: [],
      services: []
    }
  }

  try {
    // Search listings
    const listings = await prisma.listing.findMany({
      where: {
        status: 'APPROVED',
        owner: {
          deletedAt: null
        },
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } }
        ]
      },
      include: {
        owner: {
          include: {
            profile: {
              select: {
                displayName: true,
                town: true,
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
      take: 12
    })

    // Search services
    const services = await prisma.service.findMany({
      where: {
        status: 'APPROVED',
        owner: {
          deletedAt: null
        },
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
          { location: { contains: searchQuery, mode: 'insensitive' } }
        ]
      },
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
      take: 12
    })

    return {
      listings,
      services
    }
  } catch (error: any) {
    console.error('Search error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to perform search'
    })
  } finally {
    await prisma.$disconnect()
  }
})
