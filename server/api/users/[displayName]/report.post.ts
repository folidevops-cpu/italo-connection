import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const displayName = getRouterParam(event, 'displayName')
  const body = await readBody(event)

  if (!displayName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Display name is required'
    })
  }

  // Validate request body
  const { reason, description } = body

  if (!reason || !description) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Reason and description are required'
    })
  }

  if (reason.length < 3 || reason.length > 100) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Reason must be between 3 and 100 characters'
    })
  }

  if (description.length < 10 || description.length > 1000) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Description must be between 10 and 1000 characters'
    })
  }

  try {
    // Find the reported user by display name
    const reportedProfile = await prisma.profile.findFirst({
      where: {
        displayName: displayName
      },
      include: {
        user: true
      }
    })

    if (!reportedProfile) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Get the reporter's ID if they're logged in
    const session = await getUserSession(event)
    let reporterId = null

    if (session?.user && (session.user as any).id) {
      reporterId = (session.user as any).id

      // Check if this user has already reported this user recently (within 7 days)
      const recentReport = await prisma.userReport.findFirst({
        where: {
          reporterId: reporterId,
          reportedUserId: reportedProfile.userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
          }
        }
      })

      if (recentReport) {
        throw createError({
          statusCode: 400,
          statusMessage: 'You have already reported this user recently. Please wait before submitting another report.'
        })
      }
    }

    // Create the report
    const report = await prisma.userReport.create({
      data: {
        reporterId: reporterId,
        reportedUserId: reportedProfile.userId,
        reason: reason,
        description: description,
        status: 'PENDING'
      }
    })

    // Create notification for admins
    const adminUsers = await prisma.user.findMany({
      where: {
        role: 'ADMIN'
      }
    })

    await Promise.all(
      adminUsers.map(admin =>
        prisma.notification.create({
          data: {
            userId: admin.id,
            type: 'USER_REPORT',
            channel: 'IN_APP',
            payload: {
              title: 'New User Report',
              message: `A user has been reported: ${reportedProfile.displayName}. Reason: ${reason}`,
              link: `/admin/reports/${report.id}`,
              reportId: report.id,
              reportedUserId: reportedProfile.userId,
              reportedUserDisplayName: reportedProfile.displayName
            },
            read: false
          }
        })
      )
    )

    return {
      success: true,
      message: 'Report submitted successfully. Our team will review it shortly.'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Error submitting user report:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to submit report'
    })
  }
})