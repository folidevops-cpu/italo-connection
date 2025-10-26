export default defineEventHandler(async (event) => {
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

    // Fetch listing with media and owner info
    const listing = await prisma.listing.findFirst({
      where: { 
        id: listingId,
        owner: {
          deletedAt: null // Exclude listings from deleted users
        }
      },
      include: {
        media: {
          orderBy: {
            order: 'asc'
          }
        },
        owner: {
          select: {
            id: true,
            email: true,
            deletedAt: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    })

    await prisma.$disconnect()

    if (!listing) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Listing not found or owner account has been deleted'
      })
    }

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
