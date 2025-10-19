import { PrismaClient } from '@prisma/client'
import { defineEventHandler, createError } from 'h3'
import nodemailer from 'nodemailer'
import crypto from 'crypto'

const prisma = new PrismaClient()

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export default defineEventHandler(async (event) => {
  try {
    console.log('Email verification request received')
    
    // Get user from session using nuxt-auth-utils
    const session = await getUserSession(event)
    const user = session.user as any
    
    console.log('User from session:', user)

    if (!user?.id || !user?.email) {
      console.error('User not authenticated or missing email')
      throw createError({
        statusCode: 401,
        message: 'You must be logged in to verify your email'
      })
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    
    console.log('Generated verification token, expires at:', expiresAt)

    // Save token to database
    try {
      await prisma.verificationToken.create({
        data: {
          token,
          userId: user.id,
          type: 'email',
          expiresAt
        }
      })
      console.log('Verification token saved to database')
    } catch (dbError) {
      console.error('Failed to save verification token:', dbError)
      throw createError({
        statusCode: 500,
        message: 'Failed to create verification token'
      })
    }

    // Create verification link using public app URL
    const verifyUrl = `${process.env.NUXT_PUBLIC_APP_URL}/api/verify/email/${token}`
    
    console.log('Verification URL:', verifyUrl)

    // Send verification email
    await transporter.sendMail({
      from: {
        name: process.env.SMTP_FROM_NAME || 'ItaloConnection',
        address: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || ''
      },
      to: user.email,
      subject: 'Verify your email - ItaloConnection',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Verify your email</h1>
          <p>Hello,</p>
          <p>Thank you for registering with ItaloConnection. Please click the button below to verify your email address:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" 
              style="background-color: #2563eb; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </p>
          <p>Or copy and paste this link in your browser:</p>
          <p style="background-color: #f3f4f6; padding: 10px; border-radius: 5px;">
            ${verifyUrl}
          </p>
          <p>This link will expire in 24 hours for security reasons.</p>
          <p>If you didn't create an account with ItaloConnection, you can safely ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 0.875rem;">
            Best regards,<br>
            The ItaloConnection Team
          </p>
        </div>
      `
    })
    
    console.log('Verification email sent successfully')
    return { message: 'Verification email sent' }
  } catch (error) {
    console.error('Failed to send verification email:', error)
    throw createError({
      statusCode: 500,
      message: `Failed to send verification email: ${error instanceof Error ? error.message : String(error)}`
    })
  }
})