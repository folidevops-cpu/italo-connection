// Email verification resend endpoint
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

      // TODO: In production, you would:
      // 1. Generate a new verification code
      // 2. Store it in database/cache with expiration
      // 3. Send email with the code
      // 4. Implement rate limiting to prevent abuse

      // Mock email sending
      console.log(`Resending email verification code`)
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      return {
        success: true,
        message: 'Verification code sent successfully'
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