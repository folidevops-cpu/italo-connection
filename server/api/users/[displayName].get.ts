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
        displayName: displayName,
        user: {
          deletedAt: null // Only find profiles of non-deleted users
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: false, // Don't expose email
            role: true,
            createdAt: true,
            emailVerified: true,
            deletedAt: true,
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
            },
            services: {
              where: {
                status: 'APPROVED' // Only show approved services
              },
              include: {
                serviceType: true,
                media: {
                  orderBy: {
                    order: 'asc'
                  },
                  take: 1 // Get first image for each service
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

    // Get current user session to determine visibility
    const { user: currentUser } = await getUserSession(event)
    const isLoggedIn = !!currentUser
    const isEmailVerified = currentUser ? (currentUser as any).emailVerified : false

    // Helper function to mask contact info
    const maskContact = (contact: string | null) => {
      if (!contact || contact.length < 3) return 'XXX-XXXXX'
      return contact.substring(0, 3) + 'X'.repeat(Math.max(5, contact.length - 3))
    }

    // Determine phone and whatsapp visibility
    let phone = null
    let whatsapp = null
    let contactMessage = null

    if (isEmailVerified) {
      // Email verified users can see full contact information
      phone = profile.phone
      whatsapp = profile.whatsapp
    } else if (isLoggedIn) {
      // Logged in but not email verified users see masked info
      phone = profile.phone ? maskContact(profile.phone) : null
      whatsapp = profile.whatsapp ? maskContact(profile.whatsapp) : null
      contactMessage = 'Verify your email to see full contact details'
    } else {
      // Not logged in users see masked info
      phone = profile.phone ? maskContact(profile.phone) : null
      whatsapp = profile.whatsapp ? maskContact(profile.whatsapp) : null
      contactMessage = 'Please login and verify your email to see full contact details'
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
      phone: phone,
      whatsapp: whatsapp,
      contactMessage: contactMessage,
      canSeeFullContact: isEmailVerified,
      memberSince: profile.user.createdAt,
      emailVerified: profile.user.emailVerified,
      totalListings: profile.user.listings.length,
      totalServices: profile.user.services.length,
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
      })),
      services: profile.user.services.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        location: service.location,
        serviceType: service.serviceType.name,
        createdAt: service.createdAt,
        imageUrl: service.media[0]?.url || null
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