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
  
  const body = await readBody(event)
  const {
    // Personal Information
    firstName,
    middleName,
    surname,
    displayName,
    bio,
    nationality,
    maritalStatus,
    
    // Residence Information
    street,
    streetNumber,
    town,
    province,
    cap,
    googlePlaceId,
    latitude,
    longitude,
    
    // Contact Information
    phone,
    whatsapp,
    
    // Social Media
    facebookUrl,
    instagramUrl,
    tiktokUrl,
    
    // Other
    avatarUrl
  } = body
  
  try {
    const userData = user as any
    
    // Validate marital status if provided
    if (maritalStatus && !['single', 'married', 'prefer_not_say'].includes(maritalStatus)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid marital status'
      })
    }

    // Check if displayName is unique (if provided and different from current)
    if (displayName) {
      const currentProfile = await prisma.profile.findUnique({
        where: { userId: userData.id },
        select: { displayName: true }
      })

      // Only check if the displayName is different from current one
      if (displayName !== currentProfile?.displayName) {
        const existingDisplayName = await prisma.profile.findFirst({
          where: {
            displayName: displayName,
            userId: { not: userData.id }
          }
        })

        if (existingDisplayName) {
          throw createError({
            statusCode: 409,
            statusMessage: 'This display name is already taken'
          })
        }
      }
    }
    
    // Validate social media URLs if provided
    if (facebookUrl && !isValidUrl(facebookUrl)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Facebook URL'
      })
    }
    
    if (instagramUrl && !isValidUrl(instagramUrl)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Instagram URL'
      })
    }
    
    if (tiktokUrl && !isValidUrl(tiktokUrl)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid TikTok URL'
      })
    }
    
    // Update profile in database
    const updateData: any = {
      firstName,
      middleName,
      surname,
      displayName,
      bio,
      nationality,
      maritalStatus,
      street,
      streetNumber,
      town,
      province,
      cap,
      googlePlaceId,
      phone,
      whatsapp,
      facebookUrl,
      instagramUrl,
      tiktokUrl,
      avatarUrl
    }

    const createData: any = {
      userId: userData.id,
      firstName,
      middleName,
      surname,
      displayName: displayName || userData.email?.split('@')[0] || '',
      bio,
      nationality,
      maritalStatus,
      street,
      streetNumber,
      town,
      province,
      cap,
      googlePlaceId,
      latitude: latitude !== undefined ? parseFloat(latitude) : undefined,
      longitude: longitude !== undefined ? parseFloat(longitude) : undefined,
      phone,
      whatsapp,
      facebookUrl,
      instagramUrl,
      tiktokUrl,
      avatarUrl
    }

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: userData.id },
      update: updateData,
      create: createData,
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            emailVerified: true,
            phoneVerified: true,
            role: true
          }
        }
      }
    })
    
    // Update session with new display name
    await setUserSession(event, {
      user: {
        ...userData,
        displayName: updatedProfile.displayName || userData.displayName
      },
      loggedInAt: new Date()
    })
    
    return updatedProfile
  } catch (error: any) {
    console.error('Failed to update profile:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    // Check for Prisma unique constraint violations
    if (error.code === 'P2002') {
      const target = error.meta?.target?.[0]
      
      if (target === 'displayName') {
        throw createError({
          statusCode: 409,
          statusMessage: 'This display name is already taken'
        })
      }
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update profile'
    })
  }
})

// Helper function to validate URLs
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}