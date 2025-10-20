export default defineNuxtRouteMiddleware((to, from) => {
  const { user, loggedIn } = useUserSession()
  
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
  
  // Check if user has admin role
  const userData = user.value as any
  if (!userData || userData.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden - Admin access required'
    })
  }
})