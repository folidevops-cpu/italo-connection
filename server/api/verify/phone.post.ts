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

      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()

      const userData = session.user as any

      // Find verification token
      const verificationToken = await prisma.verificationToken.findFirst({
        where: {
          userId: userData.id,
          type: 'PHONE',
          token: body.code,
          expiresAt: {
            gt: new Date()
          },
          usedAt: null
        }
      })

      if (!verificationToken) {
        await prisma.$disconnect()
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid or expired verification code'
        })
      }

      // Mark token as used
      await prisma.verificationToken.update({
        where: { id: verificationToken.id },
        data: { usedAt: new Date() }
      })

      // Update user phone verification status
      const updatedUser = await prisma.user.update({
        where: { id: userData.id },
        data: { phoneVerified: true },
        include: { profile: true }
      })

      // Create notification for successful verification
      await NotificationHelpers.phoneVerified(prisma, updatedUser.id)

      await prisma.$disconnect()

      // Update session
      await setUserSession(event, {
        ...session,
        user: {
          ...session.user,
          phoneVerified: true
        }
      })

      console.log(`Phone verified for user ${updatedUser.email}`)

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