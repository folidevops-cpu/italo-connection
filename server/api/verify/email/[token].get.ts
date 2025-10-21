import { PrismaClient } from '@prisma/client'
import { defineEventHandler, createError, sendRedirect } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    console.log('Processing email verification token')
    const token = event.context.params?.token
    if (!token) {
      throw createError({
        statusCode: 400,
        message: 'Invalid verification link'
      })
    }

  // Find and validate token
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token }
  })

  if (!verificationToken) {
    throw createError({
      statusCode: 400,
      message: 'Invalid or expired verification link'
    })
  }

  if (verificationToken.expiresAt < new Date()) {
    await prisma.verificationToken.delete({
      where: { token }
    })
    throw createError({
      statusCode: 400,
      message: 'Verification link has expired'
    })
  }

  // Update user's email verification status
  const updatedUser = await prisma.user.update({
    where: { id: verificationToken.userId },
    data: { emailVerified: true },
    include: { profile: true }
  })

  console.log('User email verified successfully:', updatedUser.email)

  // Create notification for successful verification
  await NotificationHelpers.emailVerified(prisma, updatedUser.id)

  // Update the session with the new user data
  await setUserSession(event, {
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      displayName: updatedUser.profile?.displayName || updatedUser.email.split('@')[0],
      emailVerified: updatedUser.emailVerified,
      phoneVerified: updatedUser.phoneVerified,
      phone: updatedUser.phone,
      avatarUrl: updatedUser.profile?.avatarUrl || null,
      provider: 'email'
    },
    loggedInAt: new Date()
  })

  console.log('Session updated with verified email status')

  // Delete used token
  await prisma.verificationToken.delete({
    where: { token }
  })

    console.log('Email verified successfully, redirecting to dashboard')
    // Redirect to dashboard with success message
    return sendRedirect(event, '/dashboard?verified=true')
  } catch (error) {
    console.error('Email verification error:', error)
    throw createError({
      statusCode: 500,
      message: `Verification failed: ${error instanceof Error ? error.message : String(error)}`
    })
  }
})