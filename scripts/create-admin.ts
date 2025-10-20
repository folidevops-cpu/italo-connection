import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import * as readline from 'readline'

const prisma = new PrismaClient()

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Promisify readline question
function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve))
}

async function createAdmin() {
  console.log('🔐 Admin User Creation Script')
  console.log('================================\n')

  try {
    // Get admin details
    const email = await question('Enter admin email: ')
    
    if (!email || !email.includes('@')) {
      console.error('❌ Invalid email address')
      process.exit(1)
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('\n⚠️  User with this email already exists!')
      const makeAdmin = await question('Do you want to make this user an admin? (yes/no): ')
      
      if (makeAdmin.toLowerCase() === 'yes' || makeAdmin.toLowerCase() === 'y') {
        const updated = await prisma.user.update({
          where: { email },
          data: { 
            role: 'ADMIN',
            emailVerified: true
          }
        })
        
        console.log('\n✅ User updated to admin successfully!')
        console.log('Email:', updated.email)
        console.log('Role:', updated.role)
        console.log('ID:', updated.id)
        process.exit(0)
      } else {
        console.log('Operation cancelled.')
        process.exit(0)
      }
    }

    const password = await question('Enter admin password (min 8 characters): ')
    
    if (!password || password.length < 8) {
      console.error('❌ Password must be at least 8 characters')
      process.exit(1)
    }

    const displayName = await question('Enter display name (or press Enter to use email): ')
    const finalDisplayName = displayName.trim() || email.split('@')[0]

    console.log('\n📝 Creating admin user...')

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: 'ADMIN',
        emailVerified: true,
        phoneVerified: false,
        profile: {
          create: {
            displayName: finalDisplayName,
            bio: 'Administrator'
          }
        }
      }
    })

    // Fetch the profile separately to display it
    const profile = await prisma.profile.findUnique({
      where: { userId: admin.id }
    })

    console.log('\n✅ Admin user created successfully!')
    console.log('================================')
    console.log('Email:', admin.email)
    console.log('Display Name:', profile?.displayName)
    console.log('Role:', admin.role)
    console.log('ID:', admin.id)
    console.log('Email Verified:', admin.emailVerified)
    console.log('================================\n')
    console.log('You can now login with these credentials.')

  } catch (error: any) {
    console.error('\n❌ Error creating admin user:', error.message)
    process.exit(1)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

// Run the script
createAdmin()
