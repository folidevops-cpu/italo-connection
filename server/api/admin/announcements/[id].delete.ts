// Delete an announcement (admin/moderator only)
export default defineEventHandler(async (event) => {
  // Check if user is authenticated and is admin/moderator
  const { user } = await getUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const userData = user as any
  if (userData.role !== 'ADMIN' && userData.role !== 'MODERATOR') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden - Admin or Moderator access required'
    })
  }

  const announcementId = getRouterParam(event, 'id')
  if (!announcementId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Announcement ID is required'
    })
  }

  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Check if announcement exists
    const existing = await prisma.announcement.findUnique({
      where: { id: announcementId }
    })

    if (!existing) {
      await prisma.$disconnect()
      throw createError({
        statusCode: 404,
        statusMessage: 'Announcement not found'
      })
    }

    // Delete the announcement
    await prisma.announcement.delete({
      where: { id: announcementId }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: userData.id,
        action: 'announcement_deleted',
        meta: {
          announcementId,
          message: existing.message
        }
      }
    })

    await prisma.$disconnect()

    return {
      success: true,
      message: 'Announcement deleted successfully'
    }
  } catch (error: any) {
    console.error('Failed to delete announcement:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete announcement'
    })
  }
})
