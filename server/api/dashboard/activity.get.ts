export default defineEventHandler(async (event) => {
  // Check authentication
  const { user } = await getUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const userData = user as any
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 10

  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Fetch recent notifications as activity
    const recentNotifications = await prisma.notification.findMany({
      where: {
        userId: userData.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    // Fetch recent listings
    const recentListings = await prisma.listing.findMany({
      where: {
        ownerId: userData.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Fetch recent services
    const recentServices = await prisma.service.findMany({
      where: {
        ownerId: userData.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3,
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    })

    await prisma.$disconnect()

    // Combine and format activity
    const activity = [
      ...recentListings.map(listing => ({
        id: `listing-${listing.id}`,
        type: 'listing',
        title: `Listing: ${listing.title}`,
        status: listing.status,
        date: formatRelativeTime(listing.createdAt),
        timestamp: listing.createdAt.toISOString()
      })),
      ...recentServices.map(service => ({
        id: `service-${service.id}`,
        type: 'service',
        title: `Service: ${service.name}`,
        status: service.status,
        date: formatRelativeTime(service.createdAt),
        timestamp: service.createdAt.toISOString()
      })),
      ...recentNotifications.slice(0, 4).map(notification => {
        // Parse payload to get title
        const payload = notification.payload as any
        const title = payload?.title || payload?.message || 'Notification'
        
        return {
          id: `notification-${notification.id}`,
          type: 'notification',
          title: title,
          status: notification.read ? 'read' : 'unread',
          date: formatRelativeTime(notification.createdAt),
          timestamp: notification.createdAt.toISOString()
        }
      })
    ]

    // Sort by timestamp and limit
    activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return {
      activity: activity.slice(0, limit)
    }
  } catch (error: any) {
    console.error('Failed to fetch recent activity:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch recent activity'
    })
  }
})

// Helper function to format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 7) {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: new Date(date).getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else {
    return 'Just now'
  }
}
