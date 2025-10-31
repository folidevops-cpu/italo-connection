export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn, isEmailVerified } = useAuthState()

  // If not logged in, redirect to login
  if (!loggedIn.value) {
    return navigateTo('/login')
  }

  // If email not verified, redirect to dashboard with error message
  if (!isEmailVerified.value) {
    return navigateTo('/dashboard?error=email-verification-required')
  }
})