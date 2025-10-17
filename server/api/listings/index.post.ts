export default defineEventHandler(async (event) => {
  // Check authentication using nuxt-auth-utils
  const { user } = await getUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const userData = user as any
  
  // Check if user is verified
  if (!userData.emailVerified || !userData.phoneVerified) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Email and phone verification required to create listings'
    })
  }

  const body = await readBody(event)
  const { type, title, description, price, location, availableFrom, capacity, sharedSlots } = body

  // Validate required fields
  if (!type || !title || !description || !price) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: type, title, description, price'
    })
  }

  // Validate listing type
  if (!['item', 'room_single', 'room_shared'].includes(type)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid listing type'
    })
  }

  // Validate price
  if (price <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Price must be greater than 0'
    })
  }

  try {
    // TODO: Create listing in database using Prisma
    // const listing = await prisma.listing.create({
    //   data: {
    //     ownerId: userData.id,
    //     type,
    //     title,
    //     description,
    //     price,
    //     location,
    //     availableFrom: availableFrom ? new Date(availableFrom) : null,
    //     capacity: capacity || null,
    //     sharedSlots: sharedSlots || null,
    //     status: 'active'
    //   },
    //   include: {
    //     owner: {
    //       include: { profile: true }
    //     }
    //   }
    // })

    // Mock response for testing
    const listing = {
      id: `listing_${Date.now()}`,
      ownerId: userData.id,
      type,
      title,
      description,
      price,
      location: location || null,
      status: 'active',
      availableFrom: availableFrom ? new Date(availableFrom) : null,
      capacity: capacity || null,
      sharedSlots: sharedSlots || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: {
        id: userData.id,
        email: userData.email,
        profile: {
          displayName: userData.displayName || userData.email
        }
      }
    }

    return listing
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create listing'
    })
  }
})