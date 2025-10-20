import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

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
  const body = await readBody(event)
  const { key, listingId } = body

  if (!key || !listingId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: key, listingId'
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

<<<<<<< HEAD
    if (listing.ownerId !== userData.id) {
=======
    // Check if user owns the listing or is an admin
    const isOwner = listing.ownerId === userData.id
    const isAdmin = userData.role === 'ADMIN'
    
    if (!isOwner && !isAdmin) {
>>>>>>> dev
      await prisma.$disconnect()
      throw createError({
        statusCode: 403,
        statusMessage: 'You do not have permission to delete this image'
      })
    }

    // Find the media record
    const media = listing.media.find(m => m.key === key)
    if (!media) {
      await prisma.$disconnect()
      throw createError({
        statusCode: 404,
        statusMessage: 'Image not found'
      })
    }

    // Delete from S3
    try {
      const bucketName = process.env.AWS_S3_BUCKET || 'italoconnection'
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key
      })
      await s3Client.send(deleteCommand)
    } catch (s3Error: any) {
      console.error(`Failed to delete S3 object ${key}:`, s3Error)
      // Continue even if S3 deletion fails
    }

    // Delete from database
    await prisma.media.delete({
      where: { id: media.id }
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
