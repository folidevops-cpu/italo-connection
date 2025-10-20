export default defineEventHandler(async (event) => {
  // Check if user is authenticated and is admin
  const { user } = await getUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const userData = user as any
  if (userData.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden - Admin access required'
    })
  }

  const body = await readBody(event)
  const { emails } = body

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email array is required'
    })
  }

  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    const results = {
      verified: 0,
      notFound: [] as string[],
      alreadyVerified: [] as string[],
      errors: [] as string[]
    }

    // Process each email
    for (const email of emails) {
      try {
        const targetUser = await prisma.user.findUnique({
          where: { email }
        })

        if (!targetUser) {
          results.notFound.push(email)
          continue
        }

        if (targetUser.emailVerified) {
          results.alreadyVerified.push(email)
          continue
        }

        // Update user verification status
        await prisma.user.update({
          where: { email },
          data: {
            emailVerified: true
          }
        })

        // Log the action
        await prisma.auditLog.create({
          data: {
            userId: userData.id,
            action: 'user_verified',
            meta: {
              targetUserId: targetUser.id,
              targetUserEmail: email,
              bulkVerification: true
            }
          }
        })

        results.verified++
      } catch (err: any) {
        results.errors.push(`${email}: ${err.message}`)
      }
    }

    await prisma.$disconnect()

    // Build response message
    const details = []
    if (results.verified > 0) {
      details.push(`✅ Verified: ${results.verified} user(s)`)
    }
    if (results.notFound.length > 0) {
      details.push(`❌ Not found: ${results.notFound.join(', ')}`)
    }
    if (results.alreadyVerified.length > 0) {
      details.push(`ℹ️ Already verified: ${results.alreadyVerified.join(', ')}`)
    }
    if (results.errors.length > 0) {
      details.push(`⚠️ Errors: ${results.errors.join('; ')}`)
    }

    return {
      success: true,
      message: `Bulk verification completed: ${results.verified} of ${emails.length} user(s) verified`,
      verified: results.verified,
      total: emails.length,
      details
    }
  } catch (error: any) {
    console.error('Failed to bulk verify users:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to bulk verify users'
    })
  }
})
