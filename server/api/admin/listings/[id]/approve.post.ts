export default defineEventHandler(async (event) => {
  // Check if user is authenticated and is admin
  const { user } = await getUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const userData = user as any
  if (userData.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden - Admin access required'
    })
  }

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

    // Verify the listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        owner: true
      }
    })

    if (!listing) {
      await prisma.$disconnect()
      throw createError({
        statusCode: 404,
        statusMessage: 'Listing not found'
      })
    }

    // Update listing status to APPROVED
    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        status: 'APPROVED'
      }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: userData.id,
        action: 'listing_approved',
        meta: {
          listingId,
          listingTitle: listing.title,
          ownerId: listing.ownerId,
          ownerEmail: listing.owner.email
        }
      }
    })

    // TODO: Create notification for listing owner
    await prisma.notification.create({
      data: {
        userId: listing.ownerId,
        type: 'LISTING_APPROVED',
        channel: 'IN_APP',
        payload: {
          listingId,
          listingTitle: listing.title,
          message: 'Your listing has been approved and is now visible to others'
        }
      }
    })

    await prisma.$disconnect()

    return {
      success: true,
      message: 'Listing approved successfully'
    }
  } catch (error: any) {
    console.error('Failed to approve listing:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to approve listing'
    })
  }
})
