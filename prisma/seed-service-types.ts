import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const serviceTypes = [
    {
      name: 'Hair Braiding',
      description: 'Professional hair braiding services',
    },
    {
      name: 'African Cuisine',
      description: 'Authentic African food and catering services',
    },
    {
      name: 'Local Taxi',
      description: 'Transportation and taxi services',
    },
    {
      name: 'Baby Sitting',
      description: 'Childcare and babysitting services',
    },
    {
      name: 'Home Cleaning',
      description: 'House cleaning and maintenance services',
    },
    {
      name: 'Tutoring',
      description: 'Educational tutoring services',
    },
  ]

  for (const type of serviceTypes) {
    await prisma.serviceType.upsert({
      where: { name: type.name },
      update: {},
      create: type,
    })
  }

  console.log('✅ Service types seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
