/**
 * Global middleware to refresh auth session on navigation
 * This ensures the UI always has the latest user data
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side
  if (process.server) return
  
  // Skip on initial load
  if (!from.name) return
  
  const { refreshUser } = useAuthState()
  
  // Refresh session when navigating between pages
  if (to.path !== from.path) {
    console.log(`Navigating from ${from.path} to ${to.path}, refreshing session...`)
    try {
      await refreshUser()
    } catch (error) {
      console.error('Failed to refresh session during navigation:', error)
    }
  }
})
