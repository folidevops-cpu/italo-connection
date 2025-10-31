/**
 * Checks if user is authenticated and email is verified
 * @param event - The event handler context
 * @returns User data if authenticated and verified
 * @throws Error if not authenticated or email not verified
 */
export async function requireEmailVerification(event: any) {
  const { user } = await getUserSession(event)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Please login'
    })
  }

  const userData = user as any
  
  if (!userData.emailVerified) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Email verification required. Please check your email and verify your account.'
    })
  }

  return userData
}

/**
 * Checks if user is authenticated (without email verification requirement)
 * @param event - The event handler context
 * @returns User data if authenticated
 * @throws Error if not authenticated
 */
export async function requireAuth(event: any) {
  const { user } = await getUserSession(event)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Please login'
    })
  }

  return user as any
}

/**
 * Checks if user is admin
 * @param event - The event handler context
 * @returns User data if admin
 * @throws Error if not admin
 */
export async function requireAdmin(event: any) {
  const userData = await requireAuth(event)
  
  if (userData.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required'
    })
  }

  return userData
}