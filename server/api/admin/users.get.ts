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

  // Get query parameters
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 20
  const search = query.search as string || ''
  const role = query.role as string || ''
  const verified = query.verified as string || ''

  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { profile: { displayName: { contains: search, mode: 'insensitive' } } }
      ]
    }

    if (role) {
      where.role = role
    }

    if (verified === 'true') {
      where.emailVerified = true
    } else if (verified === 'false') {
      where.emailVerified = false
    }

    // Fetch users with pagination
    const users = await prisma.user.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        email: true,
        role: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        profile: {
          select: {
            displayName: true
          }
        }
      }
    })

    await prisma.$disconnect()

    return users
  } catch (error: any) {
    console.error('Failed to fetch users:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch users'
    })
  }
})
