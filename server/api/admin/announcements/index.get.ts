// Get all announcements (admin only)
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
  if (userData.role !== 'ADMIN' && userData.role !== 'MODERATOR') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden - Admin or Moderator access required'
    })
  }

  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    const announcements = await prisma.announcement.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    await prisma.$disconnect()

    return {
      success: true,
      announcements
    }
  } catch (error: any) {
    console.error('Failed to fetch announcements:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch announcements'
    })
  }
})
