// Email verification endpoint
export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  if (method === 'POST') {
    try {
      const session = await getUserSession(event)
      
      if (!session.user) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized'
        })
      }

      const body = await readBody(event)
      
      if (!body.code) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Verification code is required'
        })
      }

      // TODO: In production, you would:
      // 1. Check if the code matches what was sent via email
      // 2. Check if the code hasn't expired (typically 10-15 minutes)
      // 3. Mark email as verified in database
      // 4. Invalidate the verification code

      // Mock verification logic
      const expectedCode = '123456' // In production, this would come from database/cache
      
      if (body.code !== expectedCode) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid verification code'
        })
      }

      // Update user session to mark email as verified
      await setUserSession(event, {
        ...session,
        user: {
          ...session.user,
          emailVerified: true,
          emailVerifiedAt: new Date().toISOString()
        }
      })

      console.log(`Email verified for user ID: ${session.user.id}`)

      return {
        success: true,
        message: 'Email verified successfully'
      }

    } catch (error: any) {
      if (error.statusCode) {
        throw error
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal server error'
      })
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})