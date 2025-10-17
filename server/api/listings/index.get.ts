export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 9
  const type = query.type as string
  const search = query.search as string
  const maxPrice = query.maxPrice ? parseFloat(query.maxPrice as string) : undefined

  try {
    // TODO: Replace with real Prisma query when database is connected
    // const where = {}
    // if (type) where.type = type
    // if (search) where.OR = [
    //   { title: { contains: search, mode: 'insensitive' } },
    //   { description: { contains: search, mode: 'insensitive' } }
    // ]
    // if (maxPrice) where.price = { lte: maxPrice }
    
    // const [listings, total] = await Promise.all([
    //   prisma.listing.findMany({
    //     where,
    //     skip: (page - 1) * limit,
    //     take: limit,
    //     orderBy: { createdAt: 'desc' },
    //     include: {
    //       owner: {
    //         include: { profile: true }
    //       },
    //       media: true
    //     }
    //   }),
    //   prisma.listing.count({ where })
    // ])

    // Mock data for testing
    const mockListings = [
      {
        id: '1',
        title: 'Beautiful Single Room in City Center',
        description: 'Spacious single room with private bathroom, close to public transport and universities.',
        price: 450,
        type: 'room_single',
        location: 'Rome, Italy',
        status: 'active',
        availableFrom: new Date(),
        capacity: 1,
        sharedSlots: null,
        createdAt: new Date(),
        owner: {
          id: '1',
          profile: { displayName: 'Marco Rossi' }
        }
      },
      {
        id: '2',
        title: 'iPhone 14 Pro - Like New',
        description: 'Barely used iPhone 14 Pro, 128GB, Space Black. Includes original box and charger.',
        price: 800,
        type: 'item',
        location: 'Milan, Italy',
        status: 'active',
        availableFrom: new Date(),
        capacity: null,
        sharedSlots: null,
        createdAt: new Date(),
        owner: {
          id: '2',
          profile: { displayName: 'Sofia Bianchi' }
        }
      },
      {
        id: '3',
        title: 'Shared Apartment - 2 Rooms Available',
        description: 'Modern shared apartment with 2 available rooms. Great for students and young professionals.',
        price: 320,
        type: 'room_shared',
        location: 'Florence, Italy',
        status: 'active',
        availableFrom: new Date(),
        capacity: 4,
        sharedSlots: 2,
        createdAt: new Date(),
        owner: {
          id: '3',
          profile: { displayName: 'Luca Ferrari' }
        }
      },
      {
        id: '4',
        title: 'Gaming Laptop - RTX 3070',
        description: 'High-performance gaming laptop with RTX 3070, perfect for gaming and work.',
        price: 1200,
        type: 'item',
        location: 'Naples, Italy',
        status: 'active',
        availableFrom: new Date(),
        capacity: null,
        sharedSlots: null,
        createdAt: new Date(),
        owner: {
          id: '4',
          profile: { displayName: 'Elena Romano' }
        }
      },
      {
        id: '5',
        title: 'Cozy Studio Near University',
        description: 'Perfect studio apartment for students, fully furnished with all amenities.',
        price: 380,
        type: 'room_single',
        location: 'Bologna, Italy',
        status: 'active',
        availableFrom: new Date(),
        capacity: 1,
        sharedSlots: null,
        createdAt: new Date(),
        owner: {
          id: '5',
          profile: { displayName: 'Andrea Costa' }
        }
      },
      {
        id: '6',
        title: 'Vintage Bike - Excellent Condition',
        description: 'Classic vintage bicycle, recently serviced, perfect for city rides.',
        price: 250,
        type: 'item',
        location: 'Turin, Italy',
        status: 'active',
        availableFrom: new Date(),
        capacity: null,
        sharedSlots: null,
        createdAt: new Date(),
        owner: {
          id: '6',
          profile: { displayName: 'Francesco Russo' }
        }
      }
    ]

    // Apply filters to mock data
    let filteredListings = mockListings

    if (type) {
      filteredListings = filteredListings.filter(listing => listing.type === type)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredListings = filteredListings.filter(listing => 
        listing.title.toLowerCase().includes(searchLower) ||
        listing.description.toLowerCase().includes(searchLower)
      )
    }

    if (maxPrice) {
      filteredListings = filteredListings.filter(listing => listing.price <= maxPrice)
    }

    // Pagination
    const total = filteredListings.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const paginatedListings = filteredListings.slice(startIndex, startIndex + limit)

    return {
      listings: paginatedListings,
      total,
      page,
      totalPages,
      hasMore: page < totalPages
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch listings'
    })
  }
})