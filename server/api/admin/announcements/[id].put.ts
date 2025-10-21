// Update an announcement (admin/moderator only)
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

  const body = await readBody(event)
  const { title, message, type, isActive } = body

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

    // If setting as active, deactivate all other announcements
    if (isActive) {
      await prisma.announcement.updateMany({
        where: { 
          isActive: true,
          id: { not: announcementId }
        },
        data: { isActive: false }
      })
    }

    // Update the announcement
    const announcement = await prisma.announcement.update({
      where: { id: announcementId },
      data: {
        ...(title !== undefined && { title: title?.trim() || null }),
        ...(message && { message: message.trim() }),
        ...(type && { type }),
        ...(isActive !== undefined && { isActive })
      }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: userData.id,
        action: 'announcement_updated',
        meta: {
          announcementId: announcement.id,
          changes: { title, message, type, isActive }
        }
      }
    })

    await prisma.$disconnect()

    return {
      success: true,
      message: 'Announcement updated successfully',
      announcement
    }
  } catch (error: any) {
    console.error('Failed to update announcement:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update announcement'
    })
  }
})
