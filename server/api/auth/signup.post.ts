import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { email, password, phone, displayName } = await readBody(event)
  
  // Validate required fields
  if (!email || !password || !phone) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email, password, and phone are required'
    })
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email format'
    })
  }

  // Password strength validation
  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password must be at least 6 characters long'
    })
  }
  
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      }
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User with this email or phone already exists'
      })
    }

    // Hash password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    
    // Create user in database using Prisma
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        passwordHash,
        profile: {
          create: {
            displayName: displayName || email.split('@')[0]
          }
        }
      },
      include: {
        profile: true
      }
    })

    // Return user data (without password hash)
    const userResponse = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      role: user.role,
      profile: {
        displayName: user.profile?.displayName || email.split('@')[0]
      }
    }
    
    // Set user session using nuxt-auth-utils with consistent structure
    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.profile?.displayName || email.split('@')[0],
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        phone: user.phone,
        avatarUrl: user.profile?.avatarUrl || null,
        provider: 'email'
      },
      loggedInAt: new Date()
    })
    
    return { success: true, user: userResponse }
  } catch (error: any) {
    // If it's already a createError, re-throw it
    if (error.statusCode) {
      throw error
    }
    
    // Check for Prisma unique constraint violations
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'User with this email or phone already exists'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create account'
    })
  }
})