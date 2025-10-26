import { PrismaClient } from '@prisma/client'
import { randomInt } from 'crypto'

const prisma = new PrismaClient()

/**
 * Generate a 6-digit OTP code
 */
export const generateOTP = (): string => {
  // Generate a random 6-digit number
  const otp = randomInt(100000, 999999)
  return otp.toString()
}

/**
 * Store OTP code for a user
 * @param userId - User ID
 * @param otp - The OTP code
 * @returns boolean - Success status
 */
export const storeOTP = async (userId: string, otp: string): Promise<boolean> => {
  try {
    // OTP expires in 10 minutes
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: otp,
        twoFactorExpiry: expiryTime,
      },
    })

    return true
  } catch (error) {
    console.error('Error storing OTP:', error)
    return false
  }
}

/**
 * Verify OTP code for a user
 * @param userId - User ID
 * @param otp - The OTP code to verify
 * @returns boolean - Whether the OTP is valid
 */
export const verifyOTP = async (userId: string, otp: string): Promise<boolean> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        twoFactorSecret: true,
        twoFactorExpiry: true,
      },
    })

    if (!user || !user.twoFactorSecret || !user.twoFactorExpiry) {
      return false
    }

    // Check if OTP has expired
    if (new Date() > user.twoFactorExpiry) {
      // Clear expired OTP
      await clearOTP(userId)
      return false
    }

    // Check if OTP matches
    if (user.twoFactorSecret !== otp) {
      return false
    }

    // Clear OTP after successful verification (one-time use)
    await clearOTP(userId)
    return true
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return false
  }
}

/**
 * Clear OTP code for a user
 * @param userId - User ID
 */
export const clearOTP = async (userId: string): Promise<void> => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: null,
        twoFactorExpiry: null,
      },
    })
  } catch (error) {
    console.error('Error clearing OTP:', error)
  }
}

/**
 * Check if user has a pending OTP
 * @param userId - User ID
 * @returns boolean - Whether user has valid pending OTP
 */
export const hasPendingOTP = async (userId: string): Promise<boolean> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        twoFactorSecret: true,
        twoFactorExpiry: true,
      },
    })

    if (!user || !user.twoFactorSecret || !user.twoFactorExpiry) {
      return false
    }

    // Check if OTP has expired
    if (new Date() > user.twoFactorExpiry) {
      await clearOTP(userId)
      return false
    }

    return true
  } catch (error) {
    console.error('Error checking pending OTP:', error)
    return false
  }
}
