export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)
  
  if (!user) {
    return { loggedIn: false, message: 'No user session found' }
  }

  const userData = user as any
  
  return {
    loggedIn: true,
    user: {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      displayName: userData.displayName,
      emailVerified: userData.emailVerified
    }
  }
})
