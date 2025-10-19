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
  await prisma.user.update({
    where: { id: verificationToken.userId },
    data: { emailVerified: true }
  })

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