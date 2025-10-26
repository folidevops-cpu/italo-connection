import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { token, password } = body

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Reset token is required'
    })
  }

  if (!password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password is required'
    })
  }

  if (password.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password must be at least 8 characters long'
    })
  }

  try {
    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date() // Token must not be expired
        }
      }
    })

    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid or expired reset token'
      })
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10)

    // Update user with new password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    // Log the password reset
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'PASSWORD_RESET',
        meta: { message: 'Password reset via email link' }
      }
    })

    await prisma.$disconnect()

    return {
      success: true,
      message: 'Password has been reset successfully'
    }
  } catch (error: any) {
    await prisma.$disconnect()
    
    if (error.statusCode) {
      throw error
    }
    
    console.error('Password reset error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to reset password'
    })
  }
})
