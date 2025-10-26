import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  // Check authentication
  const { user } = await getUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Please login'
    })
  }

  const userData = user as any
  const body = await readBody(event)
  const { password, reason } = body

  if (!password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password is required to delete your account'
    })
  }

  try {
    const prisma = usePrisma()

    // Get user with password hash
    const dbUser = await prisma.user.findUnique({
      where: { id: userData.id },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        deletedAt: true
      }
    })

    if (!dbUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Check if already deleted
    if (dbUser.deletedAt) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Account is already deleted'
      })
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, dbUser.passwordHash)
    if (!passwordMatch) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Incorrect password'
      })
    }

    // Soft delete the user account
    await prisma.user.update({
      where: { id: userData.id },
      data: {
        deletedAt: new Date(),
        deletionReason: reason || 'User requested account deletion'
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: userData.id,
        action: 'ACCOUNT_DELETED',
        meta: {
          reason: reason || 'Not specified',
          deletedAt: new Date().toISOString()
        }
      }
    })

    // Clear session
    await clearUserSession(event)

    return {
      success: true,
      message: 'Account deleted successfully. You can recover your account within 30 days by contacting support.'
    }
  } catch (error: any) {
    console.error('Failed to delete account:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete account'
    })
  }
})
