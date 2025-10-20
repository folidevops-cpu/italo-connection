export default defineEventHandler(async (event) => {
<<<<<<< HEAD
  // Check authentication
  const { user } = await getUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const userData = user as any
=======
>>>>>>> dev
  const listingId = getRouterParam(event, 'id')

  if (!listingId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Listing ID is required'
    })
  }

  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

<<<<<<< HEAD
    // Fetch listing with media
=======
    // Fetch listing with media and owner info
>>>>>>> dev
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        media: {
          orderBy: {
            order: 'asc'
          }
<<<<<<< HEAD
=======
        },
        owner: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true
              }
            }
          }
>>>>>>> dev
        }
      }
    })

    await prisma.$disconnect()

    if (!listing) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Listing not found'
      })
    }

<<<<<<< HEAD
    // Check if user owns the listing
    if (listing.ownerId !== userData.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You do not have permission to view this listing'
=======
    // Get current user (if logged in)
    const { user } = await getUserSession(event)
    const userData = user as any
    
    // Determine if user can view this listing
    const isOwner = userData && listing.ownerId === userData.id
    const isAdmin = userData && userData.role === 'ADMIN'
    const isApproved = listing.status === 'APPROVED'

    // Allow access if:
    // 1. User is the owner
    // 2. User is an admin
    // 3. Listing is approved (public viewing)
    if (!isOwner && !isAdmin && !isApproved) {
      throw createError({
        statusCode: 403,
        statusMessage: 'This listing is not publicly available'
>>>>>>> dev
      })
    }

    return listing
  } catch (error: any) {
    console.error('Failed to fetch listing:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch listing'
    })
  }
})
