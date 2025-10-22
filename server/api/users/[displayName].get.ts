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

  try {
    // Find user by display name
    const profile = await prisma.profile.findFirst({
      where: {
        displayName: displayName
      },
      include: {
        user: {
          select: {
            id: true,
            email: false, // Don't expose email
            phone: false, // Don't expose phone
            role: true,
            createdAt: true,
            emailVerified: true,
            phoneVerified: true,
            listings: {
              where: {
                status: 'APPROVED' // Only show approved listings
              },
              include: {
                media: {
                  orderBy: {
                    order: 'asc'
                  },
                  take: 1 // Get first image for each listing
                }
              },
              orderBy: {
                createdAt: 'desc'
              }
            }
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

    // Format the response
    return {
      displayName: profile.displayName,
      firstName: profile.firstName,
      surname: profile.surname,
      bio: profile.bio,
      nationality: profile.nationality,
      town: profile.town,
      province: profile.province,
      avatarUrl: profile.avatarUrl,
      facebookUrl: profile.facebookUrl,
      instagramUrl: profile.instagramUrl,
      tiktokUrl: profile.tiktokUrl,
      memberSince: profile.user.createdAt,
      emailVerified: profile.user.emailVerified,
      phoneVerified: profile.user.phoneVerified,
      totalListings: profile.user.listings.length,
      listings: profile.user.listings.map(listing => ({
        id: listing.id,
        type: listing.type,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        availableFrom: listing.availableFrom,
        capacity: listing.capacity,
        sharedSlots: listing.sharedSlots,
        createdAt: listing.createdAt,
        imageUrl: listing.media[0]?.url || null
      }))
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch user profile'
    })
  }
})