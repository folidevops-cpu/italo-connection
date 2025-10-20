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

  // Prevent admin from unverifying themselves
  if (userId === userData.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'You cannot unverify your own account'
    })
  }

  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Get reason from request body
    const body = await readBody(event)
    const reason = body.reason || 'Your account has been suspended by an administrator.'

    // Verify the user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!targetUser) {
      await prisma.$disconnect()
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Update user verification status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: false
      }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: userData.id,
        action: 'user_unverified',
        meta: {
          targetUserId: userId,
          targetUserEmail: targetUser.email,
          reason: reason
        }
      }
    })

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId: userId,
        type: 'ACCOUNT_SUSPENDED',
        channel: 'IN_APP',
        payload: {
          message: reason,
          suspendedBy: userData.email,
          suspendedAt: new Date().toISOString()
        }
      }
    })

    await prisma.$disconnect()

    // Send email notification
    try {
      const userName = targetUser.email.split('@')[0] // Use email prefix as name fallback
      await sendAccountSuspendedEmail(targetUser.email, userName, reason)
      console.log(`Account suspension email sent to ${targetUser.email}`)
    } catch (emailError) {
      console.error('Failed to send suspension email:', emailError)
      // Continue even if email fails - user was still suspended
    }

    return {
      success: true,
      message: 'User account suspended successfully. Email notification sent.'
    }
  } catch (error: any) {
    console.error('Failed to unverify user:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to unverify user'
    })
  }
})
