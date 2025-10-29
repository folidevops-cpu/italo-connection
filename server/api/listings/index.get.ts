import { PrismaClient } from '@prisma/client'
import { sortByDistance } from '../../utils/distance'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 9
  const type = query.type as string
  const search = query.search as string
  const maxPrice = query.maxPrice ? parseFloat(query.maxPrice as string) : undefined
  const userLat = query.userLat ? parseFloat(query.userLat as string) : undefined
  const userLon = query.userLon ? parseFloat(query.userLon as string) : undefined

  try {
    const where: any = {
      status: 'APPROVED', // Only show approved listings
      owner: {
        deletedAt: null // Exclude listings from deleted users
      }
    }
    
    if (type) where.type = type
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    if (maxPrice) where.price = { lte: maxPrice }
    
    // If user location is provided, fetch all listings and sort by distance
    // Otherwise, use normal pagination
    let listings
    let total
    
    if (userLat && userLon) {
      // Fetch all listings matching the filter (no pagination yet)
      const allListings = await prisma.listing.findMany({
        where,
        include: {
          owner: {
            include: { profile: true }
          },
          media: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      })
      
      // Sort by distance
      const sortedListings = sortByDistance(allListings, userLat, userLon)
      
      // Apply pagination after sorting
      listings = sortedListings.slice((page - 1) * limit, page * limit)
      total = sortedListings.length
    } else {
      // Normal query without location sorting
      [listings, total] = await Promise.all([
        prisma.listing.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            owner: {
              include: { profile: true }
            },
            media: {
              orderBy: {
                order: 'asc'
              }
            }
          }
        }),
        prisma.listing.count({ where })
      ])
    }

    const totalPages = Math.ceil(total / limit)

    return {
      listings,
      total,
      page,
      totalPages,
      hasMore: page < totalPages
    }
  } catch (error: any) {
    console.error('Failed to fetch listings:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch listings'
    })
  }
})