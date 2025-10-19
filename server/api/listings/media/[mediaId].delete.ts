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
  const mediaId = getRouterParam(event, 'mediaId')

  if (!mediaId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Media ID is required'
    })
  }

  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Get media with listing info to verify ownership
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
      include: {
        listing: true
      }
    })

    if (!media) {
      await prisma.$disconnect()
      throw createError({
        statusCode: 404,
        statusMessage: 'Image not found'
      })
    }

    // Verify user owns the listing
    if (media.listing.ownerId !== userData.id) {
      await prisma.$disconnect()
      throw createError({
        statusCode: 403,
        statusMessage: 'You do not have permission to delete this image'
      })
    }

    // Delete from S3
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: media.key
      })
      await s3Client.send(deleteCommand)
    } catch (s3Error) {
      console.error(`Failed to delete S3 object ${media.key}:`, s3Error)
      // Continue even if S3 deletion fails
    }

    // Delete from database
    await prisma.media.delete({
      where: { id: mediaId }
    })

    await prisma.$disconnect()

    return {
      success: true,
      message: 'Image deleted successfully'
    }
  } catch (error: any) {
    console.error('Failed to delete image:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete image'
    })
  }
})
