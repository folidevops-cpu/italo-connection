export default defineEventHandler(async (event) => {
  // Clear user session using nuxt-auth-utils
  await clearUserSession(event)
  
  return { success: true }
})