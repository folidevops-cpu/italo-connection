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

  const userId = getRouterParam(event, 'id')
  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  // Prevent admin from deleting themselves
  if (userId === userData.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'You cannot delete your own account'
    })
  }

  const body = await readBody(event)
  const { reason } = body

  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Verify the user exists and get all related data
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        listings: {
          include: {
            media: true
          }
        }
      }
    })

    if (!targetUser) {
      await prisma.$disconnect()
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Delete all listing images from S3
    if (targetUser.listings && targetUser.listings.length > 0) {
      const { S3Client, DeleteObjectCommand } = await import('@aws-sdk/client-s3')
      const s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
        }
      })

      for (const listing of targetUser.listings) {
        if (listing.media && listing.media.length > 0) {
          for (const media of listing.media) {
            try {
              await s3Client.send(
                new DeleteObjectCommand({
                  Bucket: process.env.AWS_S3_BUCKET,
                  Key: media.key
                })
              )
              console.log(`Deleted S3 object: ${media.key}`)
            } catch (s3Error) {
              console.error(`Failed to delete S3 object ${media.key}:`, s3Error)
              // Continue with deletion even if S3 delete fails
            }
          }
        }
      }
    }

    // Log the action before deletion
    await prisma.auditLog.create({
      data: {
        userId: userData.id,
        action: 'user_deleted',
        meta: {
          targetUserId: userId,
          targetUserEmail: targetUser.email,
          reason: reason || 'No reason provided',
          deletedBy: userData.email,
          listingsDeleted: targetUser.listings?.length || 0
        }
      }
    })

    // Store user email and name before deletion for email notification
    const userEmail = targetUser.email
    const userName = targetUser.profile?.displayName || targetUser.email.split('@')[0]
    const deletionReason = reason || 'Terms of service violation'

    // Delete the user (cascade will delete: profile, listings, media, notifications, verification tokens)
    await prisma.user.delete({
      where: { id: userId }
    })

    await prisma.$disconnect()

    // Send email notification
    try {
      await sendAccountDeletedEmail(userEmail, userName, deletionReason)
      console.log(`Account deletion email sent to ${userEmail}`)
    } catch (emailError) {
      console.error('Failed to send deletion email:', emailError)
      // Continue even if email fails - user was still deleted
    }

    console.log(`User ${userEmail} deleted successfully by admin ${userData.email}`)

    return {
      success: true,
      message: 'User and all associated data deleted successfully. Email notification sent.',
      details: {
        listingsDeleted: targetUser.listings?.length || 0,
        imagesDeleted: targetUser.listings?.reduce((acc, l) => acc + (l.media?.length || 0), 0) || 0
      }
    }
  } catch (error: any) {
    console.error('Failed to delete user:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete user'
    })
  }
})
