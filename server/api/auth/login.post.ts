import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  
  // Validate required fields
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required'
    })
  }
  
  try {
    // Authenticate with database using Prisma
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    })
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Check if user is admin and requires 2FA
    if (user.role === 'ADMIN') {
      // Generate OTP
      const otp = generateOTP()
      
      // Store OTP in database
      const stored = await storeOTP(user.id, otp)
      
      if (!stored) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to generate verification code'
        })
      }

      // Send 2FA code via email
      const emailSent = await send2FACodeEmail(
        user.email,
        otp,
        user.profile?.firstName || user.profile?.displayName
      )

      if (!emailSent) {
        console.error('Failed to send 2FA email to:', user.email)
        // Still allow them to proceed, but log the error
      }

      // Create audit log for 2FA attempt
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'TWO_FACTOR_REQUESTED',
          meta: {
            email: user.email,
            timestamp: new Date().toISOString(),
          },
        },
      })

      console.log(`✅ 2FA code sent to ${user.email}`)

      // Return requires2FA flag with user ID for verification
      return {
        success: false,
        requires2FA: true,
        userId: user.id,
        email: user.email,
        message: 'Verification code sent to your email'
      }
    }

    // Set user session with consistent structure (for non-admin users)
    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.profile?.displayName || user.email.split('@')[0],
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        phone: user.phone,
        avatarUrl: user.profile?.avatarUrl || null,
        provider: 'email',
        suspended: (user as any).suspended || false,
        suspendedAt: (user as any).suspendedAt || null,
        suspensionReason: (user as any).suspensionReason || null
      },
      loggedInAt: new Date()
    })

    return { success: true }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Login failed'
    })
  }
})