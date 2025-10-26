import { PrismaClient } from '@prisma/client'
import { randomBytes } from 'crypto'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email } = body

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email is required'
    })
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`)
      return {
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.'
      }
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // Get runtime config for base URL
    const config = useRuntimeConfig()
    const baseUrl = config.public.baseUrl || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`

    // Send password reset email using template
    const emailSent = await sendPasswordResetEmail(
      email,
      resetUrl
    )

    if (emailSent) {
      console.log(`✅ Password reset email sent to ${email}`)
    } else {
      console.error(`❌ Failed to send password reset email to ${email}`)
    }

    await prisma.$disconnect()

    return {
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.'
    }
  } catch (error: any) {
    console.error('Password reset error:', error)
    await prisma.$disconnect()
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process password reset request'
    })
  }
})
