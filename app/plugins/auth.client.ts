// Plugin to handle authentication state changes
export default defineNuxtPlugin(() => {
  // Only run on client side
  if (process.server) return

  const { refresh } = useUserSession()
  
  // Watch for route changes and refresh session if needed
  const router = useRouter()
  router.afterEach(async (to, from) => {
    // Refresh session when navigating to protected routes
    if (to.path.startsWith('/dashboard') || 
        to.path.startsWith('/profile') || 
        to.path.startsWith('/listings/create') ||
        to.path.startsWith('/verify')) {
      try {
        await refresh()
      } catch (error) {
        // Ignore refresh errors, let middleware handle auth
      }
    }
  })
  
  // Refresh session on page focus (when user comes back to tab)
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', async () => {
      try {
        await refresh()
      } catch (error) {
        // Ignore refresh errors
      }
    })
  }
})