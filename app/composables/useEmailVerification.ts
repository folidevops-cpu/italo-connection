/**
 * Composable for handling email verification requirements
 */
export const useEmailVerification = () => {
  const { user, loggedIn, isEmailVerified, canCreateListings, canCreateServices } = useAuthState()

  const requireEmailVerification = () => {
    if (!loggedIn.value) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Please login to continue'
      })
    }

    if (!isEmailVerified.value) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Email verification required. Please check your email and verify your account.'
      })
    }
  }

  const redirectToVerification = () => {
    return navigateTo('/verify-email')
  }

  const showVerificationWarning = () => {
    // You can implement a toast/notification here
    console.warn('Email verification required')
  }

  const checkBeforeAction = (action: 'listing' | 'service') => {
    if (!loggedIn.value) {
      navigateTo('/login')
      return false
    }

    if (action === 'listing' && !canCreateListings.value) {
      navigateTo('/verify-email')
      return false
    }

    if (action === 'service' && !canCreateServices.value) {
      navigateTo('/verify-email')
      return false
    }

    return true
  }

  return {
    isEmailVerified,
    canCreateListings,
    canCreateServices,
    requireEmailVerification,
    redirectToVerification,
    showVerificationWarning,
    checkBeforeAction
  }
}