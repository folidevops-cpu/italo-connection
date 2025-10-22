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

  const reportId = getRouterParam(event, 'id')
  
  if (!reportId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Report ID is required'
    })
  }

  const body = await readBody(event)
  const { status, adminNote } = body

  // Validate status
  const validStatuses = ['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED']
  if (status && !validStatuses.includes(status)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid status'
    })
  }

  try {
    // Update the report
    const updatedReport = await prisma.userReport.update({
      where: {
        id: reportId
      },
      data: {
        ...(status && { status }),
        ...(adminNote !== undefined && { adminNote })
      },
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
      }
    })

    return {
      success: true,
      report: updatedReport
    }
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Report not found'
      })
    }

    console.error('Error updating report:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update report'
    })
  }
})
