import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// Create reusable transporter
const createTransporter = () => {
  const config = useRuntimeConfig()
  
  return nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  })
}

// Send email function
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const config = useRuntimeConfig()
    const transporter = createTransporter()

    await transporter.sendMail({
      from: `"${config.smtpFromName}" <${config.smtpFromEmail}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    })

    console.log(`Email sent successfully to ${options.to}`)
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

// Email template for account suspension
export const sendAccountSuspendedEmail = async (
  userEmail: string,
  userName: string,
  reason: string
): Promise<boolean> => {
  const config = useRuntimeConfig()
  const supportEmail = config.adminEmail || config.smtpFromEmail

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #f97316;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #f9fafb;
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 5px 5px;
        }
        .reason-box {
          background-color: #fff3cd;
          border-left: 4px solid #f97316;
          padding: 15px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #6b7280;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>⚠️ Account Suspended</h1>
      </div>
      <div class="content">
        <p>Hello ${userName},</p>
        
        <p>We are writing to inform you that your ItaloConnection account has been temporarily suspended by our administration team.</p>
        
        <div class="reason-box">
          <strong>Reason:</strong>
          <p>${reason}</p>
        </div>
        
        <p><strong>What this means:</strong></p>
        <ul>
          <li>You will not be able to create new listings</li>
          <li>Your existing listings may be hidden from public view</li>
          <li>You may have limited access to certain features</li>
        </ul>
        
        <p><strong>What you should do:</strong></p>
        <p>If you believe this suspension was made in error or you would like to discuss this matter, please contact our support team immediately.</p>
        
        <p style="text-align: center;">
          <a href="mailto:${supportEmail}" class="button">Contact Support</a>
        </p>
        
        <p>We take the safety and integrity of our platform seriously. Thank you for your understanding.</p>
        
        <p>Best regards,<br>The ItaloConnection Team</p>
      </div>
      <div class="footer">
        <p>This is an automated message. Please do not reply directly to this email.</p>
        <p>If you need assistance, contact us at <a href="mailto:${supportEmail}">${supportEmail}</a></p>
      </div>
    </body>
    </html>
  `

  const text = `
Account Suspended - ItaloConnection

Hello ${userName},

Your ItaloConnection account has been temporarily suspended by our administration team.

Reason: ${reason}

What this means:
- You will not be able to create new listings
- Your existing listings may be hidden from public view
- You may have limited access to certain features

If you believe this suspension was made in error or you would like to discuss this matter, please contact our support team at ${supportEmail}.

Best regards,
The ItaloConnection Team
  `

  return await sendEmail({
    to: userEmail,
    subject: '⚠️ Your ItaloConnection Account Has Been Suspended',
    html,
    text,
  })
}

// Email template for account deletion
export const sendAccountDeletedEmail = async (
  userEmail: string,
  userName: string,
  reason: string
): Promise<boolean> => {
  const config = useRuntimeConfig()
  const supportEmail = config.adminEmail || config.smtpFromEmail

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #dc2626;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #f9fafb;
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 5px 5px;
        }
        .reason-box {
          background-color: #fee2e2;
          border-left: 4px solid #dc2626;
          padding: 15px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚫 Account Deleted</h1>
      </div>
      <div class="content">
        <p>Hello ${userName},</p>
        
        <p>We are writing to inform you that your ItaloConnection account has been permanently deleted by our administration team.</p>
        
        <div class="reason-box">
          <strong>Reason:</strong>
          <p>${reason}</p>
        </div>
        
        <p><strong>What has been deleted:</strong></p>
        <ul>
          <li>Your user profile and account information</li>
          <li>All listings you created on the platform</li>
          <li>All images and media files you uploaded</li>
          <li>All notifications and messages</li>
        </ul>
        
        <p><strong>This action is permanent and cannot be undone.</strong></p>
        
        <p>If you believe this deletion was made in error or you have questions about this action, please contact our support team.</p>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="mailto:${supportEmail}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">Contact Support</a>
        </p>
        
        <p>Thank you for being part of ItaloConnection.</p>
        
        <p>Best regards,<br>The ItaloConnection Team</p>
      </div>
      <div class="footer">
        <p>This is an automated message. Please do not reply directly to this email.</p>
        <p>If you need assistance, contact us at <a href="mailto:${supportEmail}">${supportEmail}</a></p>
      </div>
    </body>
    </html>
  `

  const text = `
Account Deleted - ItaloConnection

Hello ${userName},

Your ItaloConnection account has been permanently deleted by our administration team.

Reason: ${reason}

What has been deleted:
- Your user profile and account information
- All listings you created on the platform
- All images and media files you uploaded
- All notifications and messages

This action is permanent and cannot be undone.

If you believe this deletion was made in error or you have questions about this action, please contact our support team at ${supportEmail}.

Thank you for being part of ItaloConnection.

Best regards,
The ItaloConnection Team
  `

  return await sendEmail({
    to: userEmail,
    subject: '🚫 Your ItaloConnection Account Has Been Deleted',
    html,
    text,
  })
}

// Email template for new notification alert
export const sendNewNotificationEmail = async (
  userEmail: string,
  userName: string,
  notificationCount: number = 1
): Promise<boolean> => {
  const config = useRuntimeConfig()
  const appUrl = config.public?.apiBaseUrl || 'http://localhost:3000'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2563eb;
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .bell-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .content {
          background-color: #f9fafb;
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 5px 5px;
        }
        .notification-badge {
          display: inline-block;
          background-color: #ef4444;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 18px;
          margin: 20px 0;
        }
        .message {
          font-size: 16px;
          color: #4b5563;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background-color: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
          font-size: 16px;
        }
        .button:hover {
          background-color: #1d4ed8;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #6b7280;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
        .info-box {
          background-color: #dbeafe;
          border-left: 4px solid #2563eb;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="bell-icon">🔔</div>
        <h1>You Have ${notificationCount} New Notification${notificationCount > 1 ? 's' : ''}!</h1>
      </div>
      <div class="content">
        <p class="message">Hello ${userName},</p>
        
        <div style="text-align: center;">
          <div class="notification-badge">
            ${notificationCount} New
          </div>
        </div>
        
        <p class="message">
          You have received ${notificationCount} new notification${notificationCount > 1 ? 's' : ''} on ItaloConnection.
        </p>
        
        <div class="info-box">
          <strong>Important:</strong> For security and privacy reasons, we don't include notification details in emails. 
          Please log in to your account to view your notifications.
        </div>
        
        <p class="message">
          Click the button below to sign in and view your notification${notificationCount > 1 ? 's' : ''}:
        </p>
        
        <div style="text-align: center;">
          <a href="${appUrl}/notifications" class="button">
            View Notification${notificationCount > 1 ? 's' : ''}
          </a>
        </div>
        
        <p class="message" style="font-size: 14px; color: #6b7280; margin-top: 30px;">
          <strong>Quick tip:</strong> You can manage your notification preferences and view all notifications 
          by clicking the bell icon 🔔 in your account dashboard.
        </p>
      </div>
      <div class="footer">
        <p>This is an automated notification from ItaloConnection.</p>
        <p>If you didn't expect this notification, you can safely ignore this email.</p>
        <p style="margin-top: 15px;">
          <a href="${appUrl}" style="color: #2563eb; text-decoration: none;">Visit ItaloConnection</a>
        </p>
      </div>
    </body>
    </html>
  `

  const text = `
New Notification - ItaloConnection

Hello ${userName},

You have ${notificationCount} new notification${notificationCount > 1 ? 's' : ''} on ItaloConnection.

For security and privacy reasons, we don't include notification details in emails. 
Please log in to your account to view your notifications.

View your notifications: ${appUrl}/notifications

Quick tip: You can manage your notification preferences and view all notifications 
by clicking the bell icon in your account dashboard.

---
This is an automated notification from ItaloConnection.
If you didn't expect this notification, you can safely ignore this email.

Visit ItaloConnection: ${appUrl}
  `

  return await sendEmail({
    to: userEmail,
    subject: `🔔 You have ${notificationCount} new notification${notificationCount > 1 ? 's' : ''} - ItaloConnection`,
    html,
    text,
  })
}
