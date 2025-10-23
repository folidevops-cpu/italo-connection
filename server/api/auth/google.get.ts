// Google OAuth callback handler
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user: googleUser }) {
    try {
      // Check if user already exists
      let user = await prisma.user.findUnique({
        where: { email: googleUser.email },
        include: { profile: true }
      })

      if (!user) {
        // Generate a unique displayName
        let displayName = googleUser.name
        let isUnique = false
        let attempts = 0
        
        while (!isUnique && attempts < 10) {
          const existingProfile = await prisma.profile.findFirst({
            where: { displayName }
          })
          
          if (!existingProfile) {
            isUnique = true
          } else {
            // Append random number to make it unique
            displayName = `${googleUser.name}${Math.floor(Math.random() * 10000)}`
            attempts++
          }
        }
        
        // Create new user from Google data
        user = await prisma.user.create({
          data: {
            email: googleUser.email,
            emailVerified: true, // Google accounts are pre-verified
            passwordHash: '', // OAuth users don't need password
            role: 'USER',
            profile: {
              create: {
                displayName: displayName,
                avatarUrl: googleUser.picture
              }
            }
          },
          include: { profile: true }
        })
      } else if (!user.profile) {
        // Generate a unique displayName
        let displayName = googleUser.name
        let isUnique = false
        let attempts = 0
        
        while (!isUnique && attempts < 10) {
          const existingProfile = await prisma.profile.findFirst({
            where: { displayName }
          })
          
          if (!existingProfile) {
            isUnique = true
          } else {
            displayName = `${googleUser.name}${Math.floor(Math.random() * 10000)}`
            attempts++
          }
        }
        
        // Create profile if user exists but doesn't have one
        await prisma.profile.create({
          data: {
            userId: user.id,
            displayName: displayName,
            avatarUrl: googleUser.picture
          }
        })
        
        // Refetch user with profile
        user = await prisma.user.findUnique({
          where: { id: user.id },
          include: { profile: true }
        })
      }

      // Set user session
      await setUserSession(event, {
        user: {
          id: user!.id,
          email: user!.email,
          role: user!.role,
          displayName: user!.profile?.displayName || googleUser.name,
          emailVerified: user!.emailVerified,
          phoneVerified: user!.phoneVerified || false,
          phone: user!.phone,
          avatarUrl: user!.profile?.avatarUrl || googleUser.picture,
          provider: 'google',
          suspended: (user as any).suspended || false,
          suspendedAt: (user as any).suspendedAt || null,
          suspensionReason: (user as any).suspensionReason || null
        },
        loggedInAt: new Date()
      })

      // Redirect to dashboard after successful login
      return sendRedirect(event, '/dashboard')
      
    } catch (error) {
      console.error('Google OAuth error:', error)
      return sendRedirect(event, '/login?error=oauth_error')
    }
  },
  
  async onError(event, error) {
    console.error('Google OAuth error:', error)
    return sendRedirect(event, '/login?error=oauth_error')
  }
})