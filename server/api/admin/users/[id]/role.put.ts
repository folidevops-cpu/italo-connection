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

  const userId = getRouterParam(event, 'id')
  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  const body = await readBody(event)
  const { role } = body

  if (!role || !['USER', 'ADMIN'].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid role. Must be USER or ADMIN'
    })
  }

  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Verify the user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!targetUser) {
      await prisma.$disconnect()
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role
      }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: userData.id,
        action: 'user_role_changed',
        meta: {
          targetUserId: userId,
          targetUserEmail: targetUser.email,
          oldRole: targetUser.role,
          newRole: role
        }
      }
    })

    await prisma.$disconnect()

    return {
      success: true,
      message: `User role updated to ${role} successfully`
    }
  } catch (error: any) {
    console.error('Failed to update user role:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update user role'
    })
  }
})
