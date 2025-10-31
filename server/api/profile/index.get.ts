import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Check authentication using nuxt-auth-utils
  const { user } = await getUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  
  try {
    const userData = user as any
    
    // First verify the user exists in the database
    const dbUser = await prisma.user.findUnique({
      where: { id: userData.id },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        role: true
      }
    })
    
    if (!dbUser) {
      // Clear the invalid session
      await clearUserSession(event)
      throw createError({
        statusCode: 401,
        statusMessage: 'Session expired. Please log in again.'
      })
    }
    
    // Fetch user profile from database using Prisma
    let profile = await prisma.profile.findUnique({
      where: { userId: userData.id },
      include: { 
        user: {
          select: {
            email: true,
            emailVerified: true,
            role: true
          }
        }
      }
    })
    
    // Create profile if it doesn't exist
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: userData.id,
          displayName: userData.displayName || dbUser.email?.split('@')[0] || ''
        },
        include: {
          user: {
            select: {
              email: true,
              emailVerified: true,
              role: true
            }
          }
        }
      })
    }
    
    return profile
  } catch (error: any) {
    console.error('Failed to fetch profile:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch profile'
    })
  }
})