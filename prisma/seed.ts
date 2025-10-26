import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// Service types that should exist in the database
const SERVICE_TYPES = [
  { id: 'translation', name: 'Translation Services', description: 'Professional translation services' },
  { id: 'tutoring', name: 'Tutoring', description: 'Academic tutoring and lessons' },
  { id: 'legal', name: 'Legal Assistance', description: 'Legal consultation and assistance' },
  { id: 'tech', name: 'Tech Support', description: 'Technical support and IT services' },
  { id: 'moving', name: 'Moving Services', description: 'Relocation and moving assistance' }
]

// Listing types
const LISTING_TYPES = ['room_single', 'room_shared', 'item']

// Italian cities for realistic locations
const ITALIAN_CITIES = [
  'Rome', 'Milan', 'Naples', 'Turin', 'Palermo',
  'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania',
  'Venice', 'Verona', 'Messina', 'Padua', 'Trieste'
]

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.service.deleteMany()
  await prisma.listing.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.userReport.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.serviceType.deleteMany()
  await prisma.user.deleteMany()

  // Create service types
  console.log('📋 Creating service types...')
  for (const serviceType of SERVICE_TYPES) {
    await prisma.serviceType.create({
      data: serviceType
    })
  }

  // Create 10 users
  console.log('👥 Creating 10 users...')
  const users = []
  const hashedPassword = await bcrypt.hash('password123', 10)

  for (let i = 0; i < 10; i++) {
    const firstName = faker.person.firstName()
    const surname = faker.person.lastName()
    const email = `${firstName.toLowerCase()}.${surname.toLowerCase()}@emailnow.net`
    const isAdmin = i === 0 // Make first user admin

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        emailVerified: faker.datatype.boolean(0.8), // 80% verified
        phoneVerified: faker.datatype.boolean(0.5), // 50% verified
        phone: faker.helpers.maybe(() => faker.phone.number('+39 ### ### ####'), { probability: 0.7 }),
        role: isAdmin ? 'ADMIN' : 'USER',
        profile: {
          create: {
            firstName,
            surname,
            displayName: `${firstName}${surname}${faker.number.int({ min: 10, max: 99 })}`,
            bio: faker.lorem.paragraph(),
            avatarUrl: faker.image.avatar(),
            nationality: 'Italian',
            maritalStatus: faker.helpers.arrayElement(['single', 'married', 'prefer_not_say']),
            street: faker.location.street(),
            streetNumber: faker.number.int({ min: 1, max: 200 }).toString(),
            town: faker.helpers.arrayElement(ITALIAN_CITIES),
            province: faker.location.state({ abbreviated: true }),
            cap: faker.location.zipCode('#####'),
            phone: faker.helpers.maybe(() => faker.phone.number('+39 ### ### ####'), { probability: 0.7 }),
            whatsapp: faker.helpers.maybe(() => faker.phone.number('+39 ### ### ####'), { probability: 0.6 }),
            instagramUrl: faker.helpers.maybe(() => `https://instagram.com/${faker.internet.username()}`, { probability: 0.5 }),
            facebookUrl: faker.helpers.maybe(() => `https://facebook.com/${faker.internet.username()}`, { probability: 0.4 }),
            tiktokUrl: faker.helpers.maybe(() => `https://tiktok.com/@${faker.internet.username()}`, { probability: 0.3 })
          }
        }
      },
      include: {
        profile: true
      }
    })

    users.push(user)
    console.log(`   ✅ Created user: ${email}${isAdmin ? ' (ADMIN)' : ''}`)
  }

  // Create listings for each user (0-2 listings per user)
  console.log('🏠 Creating listings...')
  let totalListings = 0

  for (const user of users) {
    const numListings = faker.number.int({ min: 0, max: 2 })

    for (let i = 0; i < numListings; i++) {
      const listingType = faker.helpers.arrayElement(LISTING_TYPES)
      const isRoomListing = listingType.startsWith('room_')

      const listing = await prisma.listing.create({
        data: {
          ownerId: user.id,
          title: isRoomListing
            ? `${faker.helpers.arrayElement(['Cozy', 'Spacious', 'Modern', 'Beautiful', 'Charming'])} ${listingType === 'room_single' ? 'Single Room' : 'Shared Room'} in ${faker.helpers.arrayElement(ITALIAN_CITIES)}`
            : `${faker.commerce.productAdjective()} ${faker.commerce.product()} - ${faker.commerce.productDescription().split(' ').slice(0, 3).join(' ')}`,
          description: faker.lorem.paragraphs(2),
          price: faker.number.int({ min: 50, max: 1500 }),
          type: listingType,
          status: faker.helpers.arrayElement(['PENDING', 'APPROVED', 'REJECTED']),
          availableFrom: faker.date.future(),
          capacity: isRoomListing && listingType === 'room_shared' ? faker.number.int({ min: 2, max: 6 }) : (isRoomListing ? 1 : null),
          sharedSlots: isRoomListing && listingType === 'room_shared' ? faker.number.int({ min: 1, max: 3 }) : null
        }
      })

      totalListings++
    }
  }
  console.log(`   ✅ Created ${totalListings} listings`)

  // Create services for each user (0-2 services per user)
  console.log('💼 Creating services...')
  let totalServices = 0

  for (const user of users) {
    const numServices = faker.number.int({ min: 0, max: 2 })

    for (let i = 0; i < numServices; i++) {
      const serviceType = faker.helpers.arrayElement(SERVICE_TYPES)

      const service = await prisma.service.create({
        data: {
          ownerId: user.id,
          serviceTypeId: serviceType.id,
          name: `${faker.company.buzzAdjective()} ${serviceType.name}`,
          description: faker.lorem.paragraphs(2),
          price: faker.number.int({ min: 20, max: 200 }),
          location: `${faker.helpers.arrayElement(ITALIAN_CITIES)}, Italy`,
          status: faker.helpers.arrayElement(['PENDING', 'APPROVED', 'REJECTED'])
        }
      })

      totalServices++
    }
  }
  console.log(`   ✅ Created ${totalServices} services`)

  // Create some notifications for users
  console.log('🔔 Creating notifications...')
  let totalNotifications = 0

  for (const user of users) {
    const numNotifications = faker.number.int({ min: 0, max: 5 })

    for (let i = 0; i < numNotifications; i++) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: faker.helpers.arrayElement(['LISTING_APPROVED', 'LISTING_REJECTED', 'SERVICE_APPROVED', 'SERVICE_REJECTED', 'ACCOUNT_VERIFIED', 'NEW_MESSAGE']),
          payload: {
            title: faker.lorem.sentence(),
            message: faker.lorem.paragraph()
          },
          read: faker.datatype.boolean(0.4) // 40% read
        }
      })
      totalNotifications++
    }
  }
  console.log(`   ✅ Created ${totalNotifications} notifications`)

  console.log('\n✨ Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`   - Users: ${users.length} (1 ADMIN, ${users.length - 1} regular users)`)
  console.log(`   - Listings: ${totalListings}`)
  console.log(`   - Services: ${totalServices}`)
  console.log(`   - Service Types: ${SERVICE_TYPES.length}`)
  console.log(`   - Notifications: ${totalNotifications}`)
  console.log('\n🔑 Login credentials for all users:')
  console.log('   Email: <firstname>.<lastname>@emailnow.net')
  console.log('   Password: password123')
  console.log(`\n👤 Admin user: ${users[0].email}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
