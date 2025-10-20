import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'italoconnection'

export default defineEventHandler(async (event) => {
  // Check authentication
  const { user } = await getUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const userData = user as any
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

    // Check if listing exists and belongs to user
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        media: true
      }
    })

    if (!listing) {
      await prisma.$disconnect()
      throw createError({
        statusCode: 404,
        statusMessage: 'Listing not found'
      })
    }

    // Check if user owns the listing or is an admin
    const isOwner = listing.ownerId === userData.id
    const isAdmin = userData.role === 'ADMIN'
    
    if (!isOwner && !isAdmin) {
      await prisma.$disconnect()
      throw createError({
        statusCode: 403,
        statusMessage: 'You do not have permission to delete this listing'
      })
    }

    // Delete images from S3
    if (listing.media && listing.media.length > 0) {
      for (const image of listing.media) {
        try {
          const deleteCommand = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: image.key
          })
          await s3Client.send(deleteCommand)
        } catch (s3Error) {
          console.error(`Failed to delete S3 object ${image.key}:`, s3Error)
          // Continue even if S3 deletion fails
        }
      }
    }

    // Delete listing (media records will be cascade deleted due to schema)
    await prisma.listing.delete({
      where: { id: listingId }
    })

    await prisma.$disconnect()

    return {
      success: true,
      message: 'Listing deleted successfully'
    }
  } catch (error: any) {
    console.error('Failed to delete listing:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete listing'
    })
  }
})
