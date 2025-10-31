/**
 * Global auth state management using nuxt-auth-utils
 * This composable wraps useUserSession() and provides reactive auth state
 */
export const useAuthState = () => {
  const userSession = useUserSession()
  
  // Create a reactive ref for the user
  const user = computed(() => userSession.user.value)
  const loggedIn = computed(() => userSession.loggedIn.value)
  
  // Function to refresh user data from server
  const refreshUser = async () => {
    try {
      await userSession.fetch()
      console.log('User session refreshed:', userSession.user.value)
    } catch (error) {
      console.error('Failed to refresh user session:', error)
    }
  }
  
  // Check if email is verified
  const isEmailVerified = computed(() => {
    return (user.value as any)?.emailVerified === true
  })
  
  // Check if phone is verified
  const isPhoneVerified = computed(() => {
    return (user.value as any)?.phoneVerified === true
  })
  
  // Check if user can create listings (only email required)
  const canCreateListings = computed(() => {
    return isEmailVerified.value
  })

 
  // Check if user can create services (only email required)
  const canCreateServices = computed(() => {
    return isEmailVerified.value
  })

  // Get user name
  const userName = computed(() => {
    if (!user.value) return ''
    const userData = user.value as any
    return userData.displayName || userData.email || 'User'
  })
  
  return {
    user,
    loggedIn,
    refreshUser,
    isEmailVerified,
    isPhoneVerified,
    canCreateListings,
    canCreateServices,
    userName
  }
}
