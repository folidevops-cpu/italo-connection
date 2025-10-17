// Contact message submission endpoint
export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  if (method === 'POST') {
    try {
      const body = await readBody(event)
      
      // Validate required fields
      if (!body.name || !body.email || !body.subject || !body.message) {
        throw createError({
          statusCode: 400,
          statusMessage: 'All fields are required'
        })
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid email format'
        })
      }

      // TODO: In production, you would:
      // 1. Save to database
      // 2. Send email notification to admin
      // 3. Send confirmation email to user
      
      console.log('Contact form submission:', {
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
        submittedAt: new Date().toISOString()
      })

      // Mock successful response
      return {
        success: true,
        message: 'Message sent successfully'
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