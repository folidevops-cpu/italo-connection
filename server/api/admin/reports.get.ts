import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Check if user is admin
  const session = await getUserSession(event)
  
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied'
    })
  }

  // Get query params
  const query = getQuery(event)
  const status = query.status as string | undefined

  try {
    // Build where clause
    const where: any = {}
    if (status) {
      where.status = status
    }

    // Fetch reports with related data
    const reports = await prisma.userReport.findMany({
      where,
      include: {
        reportedUser: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true
              }
            }
          }
        },
        reporter: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return reports
  } catch (error) {
    console.error('Error fetching reports:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch reports'
    })
  }
})
