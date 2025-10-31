import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { userId, code } = await readBody(event)

  // Validate required fields
  if (!userId || !code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID and verification code are required'
    })
  }

  try {
    // Verify OTP code
    const isValid = await verifyOTP(userId, code)

    if (!isValid) {
      // Create audit log for failed 2FA attempt
      await prisma.auditLog.create({
        data: {
          userId: userId,
          action: 'TWO_FACTOR_FAILED',
          meta: {
            reason: 'Invalid or expired code',
            timestamp: new Date().toISOString(),
          },
        },
      })

      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired verification code'
      })
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Verify user is admin
    if (user.role !== 'ADMIN') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Unauthorized'
      })
    }

    // Set user session
    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.profile?.displayName || user.email.split('@')[0],
        emailVerified: user.emailVerified,
        avatarUrl: user.profile?.avatarUrl || null,
        provider: 'email',
        suspended: user.suspended || false,
        suspendedAt: user.suspendedAt || null,
        suspensionReason: user.suspensionReason || null
      },
      loggedInAt: new Date()
    })

    // Create audit log for successful 2FA
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'TWO_FACTOR_SUCCESS',
        meta: {
          email: user.email,
          timestamp: new Date().toISOString(),
        },
      },
    })

    console.log(`✅ 2FA verification successful for ${user.email}`)

    await prisma.$disconnect()

    return {
      success: true,
      message: 'Login successful'
    }
  } catch (error: any) {
    await prisma.$disconnect()
    
    if (error.statusCode) {
      throw error
    }

    console.error('2FA verification error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Verification failed'
    })
  }
})
