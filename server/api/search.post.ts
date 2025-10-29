import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { query, type, minPrice, maxPrice, location } = body

  if (!query || query.trim().length < 2) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Search query must be at least 2 characters'
    })
  }

  const prisma = new PrismaClient()

  try {
    const searchTerm = query.trim().toLowerCase()

    // Build where clauses for listings
    const listingsWhere: any = {
      status: 'APPROVED',
      owner: { deletedAt: null },
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } }
      ]
    }

    // Build where clauses for services
    const servicesWhere: any = {
      status: 'APPROVED',
      owner: { deletedAt: null },
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { location: { contains: searchTerm, mode: 'insensitive' } }
      ]
    }

    // Add price filters
    if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
      const min = parseFloat(minPrice)
      if (!isNaN(min)) {
        listingsWhere.price = { ...listingsWhere.price, gte: min }
        servicesWhere.price = { ...servicesWhere.price, gte: min }
      }
    }
    
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
      const max = parseFloat(maxPrice)
      if (!isNaN(max)) {
        listingsWhere.price = { ...listingsWhere.price, lte: max }
        servicesWhere.price = { ...servicesWhere.price, lte: max }
      }
    }

    // Add location filter for services
    if (location && location.trim()) {
      servicesWhere.location = { contains: location.trim(), mode: 'insensitive' }
    }

    // Add type filter for listings
    if (type && type !== 'all') {
      if (type.startsWith('room_')) {
        listingsWhere.type = type
      }
    }

    // Execute searches in parallel
    const [listings, services] = await Promise.all([
      type === 'services' ? [] : prisma.listing.findMany({
        where: listingsWhere,
        take: 20,
        orderBy: [
          { createdAt: 'desc' }
        ],
        include: {
          owner: {
            include: { profile: true }
          },
          media: {
            take: 1,
            orderBy: { order: 'asc' }
          }
        }
      }),
      type === 'listings' ? [] : prisma.service.findMany({
        where: servicesWhere,
        take: 20,
        orderBy: [
          { createdAt: 'desc' }
        ],
        include: {
          serviceType: true,
          owner: {
            include: { profile: true }
          },
          media: {
            take: 1,
            orderBy: { order: 'asc' }
          }
        }
      })
    ])

    return {
      query: searchTerm,
      results: {
        listings: listings.map(listing => ({
          id: listing.id,
          title: listing.title,
          description: listing.description,
          price: listing.price.toNumber(),
          type: listing.type,
          imageUrl: listing.media[0]?.url || null,
          owner: {
            displayName: listing.owner.profile?.displayName || listing.owner.email,
            avatarUrl: listing.owner.profile?.avatarUrl || null,
            town: listing.owner.profile?.town || null
          },
          createdAt: listing.createdAt
        })),
        services: services.map(service => ({
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price.toNumber(),
          location: service.location,
          serviceType: service.serviceType,
          imageUrl: service.media[0]?.url || null,
          owner: {
            displayName: service.owner.profile?.displayName || service.owner.email,
            avatarUrl: service.owner.profile?.avatarUrl || null
          },
          createdAt: service.createdAt
        }))
      },
      counts: {
        listings: listings.length,
        services: services.length,
        total: listings.length + services.length
      }
    }
  } finally {
    await prisma.$disconnect()
  }
})
