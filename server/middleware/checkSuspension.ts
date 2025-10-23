import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const path = event.path
  
  // Skip suspension check for these routes (allow suspended users to access)
  const allowedRoutes = [
    '/api/auth/',           // All auth routes (login, signup, logout, google)
    '/api/verify/',         // Verification routes
    '/api/announcements/active',
    '/api/contact',
    '/api/notifications/',  // Allow viewing notifications
    '/api/profile',         // Allow viewing own profile (but not updating)
  ]
  
  // Skip if it's an allowed route
  const isAllowedRoute = allowedRoutes.some(route => path.startsWith(route))
  if (isAllowedRoute && event.method === 'GET') {
    return // Allow GET requests to these routes
  }
  
  // Allow all auth operations
  if (path.startsWith('/api/auth/')) {
    return
  }
  
  // Allow viewing public content (GET requests)
  if (event.method === 'GET' && (
    path.startsWith('/api/listings') || 
    path.startsWith('/api/users/') ||
    path.startsWith('/api/announcements') ||
    path.startsWith('/api/notifications')
  )) {
    return // Allow GET requests to view content
  }
  
  // Skip if not an API route
  if (!path.startsWith('/api/')) {
    return
  }
  
  // Get user session
  const session = await getUserSession(event)
  
  const userData = session?.user as any
  if (!userData?.id) {
    return // No user session, let auth middleware handle it
  }
  
  try {
    // Check if user is suspended
    const user = await prisma.user.findUnique({
      where: { id: userData.id },
      select: { 
        suspended: true, 
        suspensionReason: true,
        suspendedAt: true 
      }
    })
    
    if (user?.suspended) {
      // Block all POST, PUT, DELETE, PATCH operations
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(event.method)) {
        throw createError({
          statusCode: 403,
          statusMessage: `Your account has been suspended. ${user.suspensionReason || 'Contact support for more information.'}`
        })
      }
    }
  } catch (error: any) {
    // If it's already a createError, re-throw it
    if (error.statusCode) {
      throw error
    }
    // Log other errors but don't block the request
    console.error('Suspension check error:', error)
  } finally {
    await prisma.$disconnect()
  }
})
