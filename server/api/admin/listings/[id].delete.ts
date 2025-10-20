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

    // Fetch the listing with media
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        media: true,
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

    // Delete images from S3
    if (listing.media && listing.media.length > 0) {
      const { S3Client, DeleteObjectCommand } = await import('@aws-sdk/client-s3')
      const s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
        }
      })

      for (const media of listing.media) {
        try {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET,
              Key: media.key
            })
          )
        } catch (s3Error) {
          console.error(`Failed to delete S3 object ${media.key}:`, s3Error)
          // Continue with deletion even if S3 delete fails
        }
      }
    }

    // Delete the listing (cascade will delete media records)
    await prisma.listing.delete({
      where: { id: listingId }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: userData.id,
        action: 'listing_deleted',
        meta: {
          listingId,
          listingTitle: listing.title,
          ownerId: listing.ownerId,
          ownerEmail: listing.owner.email,
          deletedBy: 'admin'
        }
      }
    })

    await prisma.$disconnect()

    return {
      success: true,
      message: 'Listing deleted successfully'
    }
  } catch (error: any) {
    console.error('Failed to delete listing:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete listing'
    })
  }
})
