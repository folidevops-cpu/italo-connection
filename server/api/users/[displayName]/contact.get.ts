import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const displayName = getRouterParam(event, 'displayName')

  if (!displayName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Display name is required'
    })
  }

  // Get current user session
  const { user: currentUser } = await getUserSession(event)

  try {
    // Find the target user by display name
    const profile = await prisma.profile.findFirst({
      where: {
        displayName: displayName
      },
      include: {
        user: {
          select: {
            id: true,
            emailVerified: true,
            phoneVerified: true
          }
        }
      }
    })

    if (!profile) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Determine visibility based on current user status
    const isLoggedIn = !!currentUser
    const isEmailVerified = currentUser ? (currentUser as any).emailVerified : false

    // Helper function to mask contact info
    const maskContact = (contact: string | null) => {
      if (!contact || contact.length < 3) return 'XXX-XXXXX'
      return contact.substring(0, 3) + 'X'.repeat(Math.max(5, contact.length - 3))
    }

    // Build response based on visibility rules
    const contactInfo: any = {
      facebookUrl: profile.facebookUrl,
      instagramUrl: profile.instagramUrl,
      tiktokUrl: profile.tiktokUrl
    }

    if (isEmailVerified) {
      // Email verified users can see full contact information
      contactInfo.phone = (profile as any).phone
      contactInfo.whatsapp = (profile as any).whatsapp
      contactInfo.canSeeFullInfo = true
    } else if (isLoggedIn) {
      // Logged in but not email verified users see masked info
      contactInfo.phone = (profile as any).phone ? maskContact((profile as any).phone) : null
      contactInfo.whatsapp = (profile as any).whatsapp ? maskContact((profile as any).whatsapp) : null
      contactInfo.canSeeFullInfo = false
      contactInfo.message = 'Verify your email to see full contact details'
    } else {
      // Not logged in users see masked info
      contactInfo.phone = (profile as any).phone ? maskContact((profile as any).phone) : null
      contactInfo.whatsapp = (profile as any).whatsapp ? maskContact((profile as any).whatsapp) : null
      contactInfo.canSeeFullInfo = false
      contactInfo.message = 'Please login and verify your email to see full contact details'
    }

    return contactInfo
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Failed to fetch contact info:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch contact information'
    })
  } finally {
    await prisma.$disconnect()
  }
})
