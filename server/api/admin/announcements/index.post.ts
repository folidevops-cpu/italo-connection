// Create a new announcement (admin/moderator only)
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

  const body = await readBody(event)
  const { title, message, type, isActive } = body

  // Validate required fields
  if (!message || message.trim() === '') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Message is required'
    })
  }

  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // If setting as active, deactivate all other announcements
    if (isActive) {
      await prisma.announcement.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      })
    }

    // Create the new announcement
    const announcement = await prisma.announcement.create({
      data: {
        title: title?.trim() || null,
        message: message.trim(),
        type: type || 'info',
        isActive: isActive || false,
        createdBy: userData.id
      }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: userData.id,
        action: 'announcement_created',
        meta: {
          announcementId: announcement.id,
          message: announcement.message,
          isActive: announcement.isActive
        }
      }
    })

    await prisma.$disconnect()

    return {
      success: true,
      message: 'Announcement created successfully',
      announcement
    }
  } catch (error: any) {
    console.error('Failed to create announcement:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create announcement'
    })
  }
})
