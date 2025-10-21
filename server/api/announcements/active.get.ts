// Get active announcement (public endpoint)
export default defineEventHandler(async (event) => {
  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Get the active announcement
    const announcement = await prisma.announcement.findFirst({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        message: true,
        type: true,
        createdAt: true
      }
    })

    await prisma.$disconnect()

    return {
      success: true,
      announcement
    }
  } catch (error: any) {
    console.error('Failed to fetch active announcement:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch active announcement'
    })
  }
})
