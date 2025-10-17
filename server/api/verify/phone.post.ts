// Phone verification endpoint
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
      // 1. Check if the code matches what was sent via SMS
      // 2. Check if the code hasn't expired (typically 5-10 minutes)
      // 3. Mark phone as verified in database
      // 4. Invalidate the verification code

      // Mock verification logic
      const expectedCode = '654321' // In production, this would come from database/cache
      
      if (body.code !== expectedCode) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid verification code'
        })
      }

      // Update user session to mark phone as verified
      await setUserSession(event, {
        ...session,
        user: {
          ...session.user,
          phoneVerified: true,
          phoneVerifiedAt: new Date().toISOString()
        }
      })

      console.log(`Phone verified for user`)

      return {
        success: true,
        message: 'Phone verified successfully'
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