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
        <h1><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
</svg>
 Account Suspended</h1>
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

// Email template for listing approved
export const sendListingApprovedEmail = async (
  userEmail: string,
  userName: string,
  listingTitle: string,
  listingId: string
): Promise<boolean> => {
  const config = useRuntimeConfig()
  const appUrl = config.public?.apiBaseUrl || 'http://localhost:3000'
  const listingUrl = `${appUrl}/listings/${listingId}`

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
          background-color: #10b981;
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .icon {
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
        .success-box {
          background-color: #d1fae5;
          border-left: 4px solid #10b981;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .listing-title {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          margin: 15px 0;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background-color: #10b981;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
          font-size: 16px;
        }
        .button:hover {
          background-color: #059669;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #6b7280;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="icon">✅</div>
        <h1>Your Listing Has Been Approved!</h1>
      </div>
      <div class="content">
        <p>Hello ${userName},</p>
        
        <p>Great news! Your listing has been approved by our moderation team and is now live on ItaloConnection.</p>
        
        <div class="success-box">
          <strong>Approved Listing:</strong>
          <div class="listing-title">"${listingTitle}"</div>
        </div>
        
        <p><strong>What this means:</strong></p>
        <ul>
          <li>✅ Your listing is now visible to all users</li>
          <li>✅ Users can contact you about this listing</li>
          <li>✅ Your listing will appear in search results</li>
        </ul>
        
        <p><strong>Next steps:</strong></p>
        <ul>
          <li>Share your listing with your network</li>
          <li>Respond promptly to any inquiries</li>
          <li>Keep your listing information up to date</li>
        </ul>
        
        <div style="text-align: center;">
          <a href="${listingUrl}" class="button">
            View Your Listing
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
          <strong>Tip:</strong> Good listings with clear descriptions and quality images typically receive more inquiries!
        </p>
        
        <p>Thank you for being part of ItaloConnection!</p>
        
        <p>Best regards,<br>The ItaloConnection Team</p>
      </div>
      <div class="footer">
        <p>This is an automated message from ItaloConnection.</p>
        <p style="margin-top: 15px;">
          <a href="${appUrl}" style="color: #10b981; text-decoration: none;">Visit ItaloConnection</a>
        </p>
      </div>
    </body>
    </html>
  `

  const text = `
Listing Approved - ItaloConnection

Hello ${userName},

Great news! Your listing has been approved by our moderation team and is now live on ItaloConnection.

Approved Listing: "${listingTitle}"

What this means:
✅ Your listing is now visible to all users
✅ Users can contact you about this listing
✅ Your listing will appear in search results

Next steps:
- Share your listing with your network
- Respond promptly to any inquiries
- Keep your listing information up to date

View your listing: ${listingUrl}

Tip: Good listings with clear descriptions and quality images typically receive more inquiries!

Thank you for being part of ItaloConnection!

Best regards,
The ItaloConnection Team

---
Visit ItaloConnection: ${appUrl}
  `

  return await sendEmail({
    to: userEmail,
    subject: `✅ Your listing "${listingTitle}" has been approved - ItaloConnection`,
    html,
    text,
  })
}

// Email template for listing rejected
export const sendListingRejectedEmail = async (
  userEmail: string,
  userName: string,
  listingTitle: string,
  reason: string
): Promise<boolean> => {
  const config = useRuntimeConfig()
  const appUrl = config.public?.apiBaseUrl || 'http://localhost:3000'
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
          background-color: #ef4444;
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .icon {
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
        .rejection-box {
          background-color: #fee2e2;
          border-left: 4px solid #ef4444;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .listing-title {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          margin: 15px 0;
        }
        .reason {
          background-color: white;
          padding: 15px;
          border-radius: 4px;
          margin-top: 10px;
          font-style: italic;
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
      </style>
    </head>
    <body>
      <div class="header">
        <div class="icon">❌</div>
        <h1>Listing Not Approved</h1>
      </div>
      <div class="content">
        <p>Hello ${userName},</p>
        
        <p>We regret to inform you that your listing was not approved by our moderation team.</p>
        
        <div class="rejection-box">
          <strong>Rejected Listing:</strong>
          <div class="listing-title">"${listingTitle}"</div>
          
          <strong>Reason for rejection:</strong>
          <div class="reason">${reason}</div>
        </div>
        
        <p><strong>What you can do:</strong></p>
        <ul>
          <li>Review our <a href="${appUrl}/guidelines" style="color: #2563eb;">community guidelines</a></li>
          <li>Make the necessary changes to your listing</li>
          <li>Resubmit your listing for approval</li>
        </ul>
        
        <p><strong>Common reasons for rejection:</strong></p>
        <ul>
          <li>Inappropriate or offensive content</li>
          <li>Misleading or inaccurate information</li>
          <li>Poor quality or missing images</li>
          <li>Incomplete listing details</li>
          <li>Violation of community guidelines</li>
        </ul>
        
        <div style="text-align: center;">
          <a href="${appUrl}/listings/my" class="button">
            View My Listings
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
          <strong>Need help?</strong> If you have questions about this decision or need guidance on how to improve your listing, 
          please contact our support team at <a href="mailto:${supportEmail}" style="color: #2563eb;">${supportEmail}</a>
        </p>
        
        <p>We appreciate your understanding and look forward to seeing your improved listing!</p>
        
        <p>Best regards,<br>The ItaloConnection Team</p>
      </div>
      <div class="footer">
        <p>This is an automated message from ItaloConnection.</p>
        <p style="margin-top: 15px;">
          <a href="${appUrl}" style="color: #ef4444; text-decoration: none;">Visit ItaloConnection</a>
        </p>
      </div>
    </body>
    </html>
  `

  const text = `
Listing Not Approved - ItaloConnection

Hello ${userName},

We regret to inform you that your listing was not approved by our moderation team.

Rejected Listing: "${listingTitle}"

Reason for rejection:
${reason}

What you can do:
- Review our community guidelines
- Make the necessary changes to your listing
- Resubmit your listing for approval

Common reasons for rejection:
- Inappropriate or offensive content
- Misleading or inaccurate information
- Poor quality or missing images
- Incomplete listing details
- Violation of community guidelines

View your listings: ${appUrl}/listings/my

Need help? If you have questions about this decision or need guidance on how to improve your listing, 
please contact our support team at ${supportEmail}

We appreciate your understanding and look forward to seeing your improved listing!

Best regards,
The ItaloConnection Team

---
Visit ItaloConnection: ${appUrl}
  `

  return await sendEmail({
    to: userEmail,
    subject: `❌ Your listing "${listingTitle}" was not approved - ItaloConnection`,
    html,
    text,
  })
}

// Email template for listing deleted
export const sendListingDeletedEmail = async (
  userEmail: string,
  userName: string,
  listingTitle: string
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
          background-color: #6b7280;
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .icon {
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
        .info-box {
          background-color: #e5e7eb;
          border-left: 4px solid #6b7280;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .listing-title {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          margin: 15px 0;
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
      </style>
    </head>
    <body>
      <div class="header">
        <div class="icon">🗑️</div>
        <h1>Listing Deleted</h1>
      </div>
      <div class="content">
        <p>Hello ${userName},</p>
        
        <p>This email confirms that your listing has been successfully deleted from ItaloConnection.</p>
        
        <div class="info-box">
          <strong>Deleted Listing:</strong>
          <div class="listing-title">"${listingTitle}"</div>
        </div>
        
        <p><strong>What was deleted:</strong></p>
        <ul>
          <li>The listing details and description</li>
          <li>All images and media files</li>
          <li>Any associated inquiries or messages</li>
        </ul>
        
        <p><strong>Important notes:</strong></p>
        <ul>
          <li>This action is permanent and cannot be undone</li>
          <li>The listing is no longer visible to other users</li>
          <li>You can create a new listing at any time</li>
        </ul>
        
        <div style="text-align: center;">
          <a href="${appUrl}/listings/create" class="button">
            Create New Listing
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
          Thank you for using ItaloConnection. We hope to see you list again soon!
        </p>
        
        <p>Best regards,<br>The ItaloConnection Team</p>
      </div>
      <div class="footer">
        <p>This is an automated message from ItaloConnection.</p>
        <p style="margin-top: 15px;">
          <a href="${appUrl}" style="color: #6b7280; text-decoration: none;">Visit ItaloConnection</a>
        </p>
      </div>
    </body>
    </html>
  `

  const text = `
Listing Deleted - ItaloConnection

Hello ${userName},

This email confirms that your listing has been successfully deleted from ItaloConnection.

Deleted Listing: "${listingTitle}"

What was deleted:
- The listing details and description
- All images and media files
- Any associated inquiries or messages

Important notes:
- This action is permanent and cannot be undone
- The listing is no longer visible to other users
- You can create a new listing at any time

Create a new listing: ${appUrl}/listings/create

Thank you for using ItaloConnection. We hope to see you list again soon!

Best regards,
The ItaloConnection Team

---
Visit ItaloConnection: ${appUrl}
  `

  return await sendEmail({
    to: userEmail,
    subject: `🗑️ Your listing "${listingTitle}" has been deleted - ItaloConnection`,
    html,
    text,
  })
}

// Email template for password reset
export const sendPasswordResetEmail = async (
  userEmail: string,
  resetUrl: string,
  userName?: string
): Promise<boolean> => {
  const config = useRuntimeConfig()
  const baseUrl = config.public?.baseUrl || config.public?.apiBaseUrl || 'http://localhost:3000'

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
        .icon {
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
        .warning-box {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #6b7280;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
        .token-box {
          background-color: #f3f4f6;
          padding: 10px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
          word-break: break-all;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="icon">🔐</div>
        <h1>Reset Your Password</h1>
      </div>
      <div class="content">
        <p>Hello${userName ? ` ${userName}` : ''},</p>
        
        <p>We received a request to reset your password for your ItaloConnection account.</p>
        
        <p>Click the button below to set a new password:</p>
        
        <div style="text-align: center;">
          <a href="${resetUrl}" class="button">
            Reset My Password
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280;">
          Or copy and paste this link into your browser:
        </p>
        <div class="token-box">
          ${resetUrl}
        </div>
        
        <div class="warning-box">
          <strong>⚠️ Important:</strong>
          <ul style="margin: 10px 0;">
            <li>This link will expire in <strong>1 hour</strong></li>
            <li>The link can only be used once</li>
            <li>If you didn't request this, please ignore this email</li>
          </ul>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
          <strong>Security tip:</strong> Never share your password or reset link with anyone. 
          ItaloConnection will never ask you for your password via email.
        </p>
        
        <p>If you have any concerns about your account security, please contact our support team immediately.</p>
        
        <p>Best regards,<br>The ItaloConnection Team</p>
      </div>
      <div class="footer">
        <p>This is an automated security message from ItaloConnection.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p style="margin-top: 15px;">
          <a href="${baseUrl}" style="color: #2563eb; text-decoration: none;">Visit ItaloConnection</a>
        </p>
      </div>
    </body>
    </html>
  `

  const text = `
Reset Your Password - ItaloConnection

Hello${userName ? ` ${userName}` : ''},

We received a request to reset your password for your ItaloConnection account.

Click the link below to set a new password:
${resetUrl}

⚠️ Important:
- This link will expire in 1 hour
- The link can only be used once
- If you didn't request this, please ignore this email

Security tip: Never share your password or reset link with anyone. 
ItaloConnection will never ask you for your password via email.

If you have any concerns about your account security, please contact our support team immediately.

Best regards,
The ItaloConnection Team

---
This is an automated security message from ItaloConnection.
If you didn't request a password reset, you can safely ignore this email.

Visit ItaloConnection: ${baseUrl}
  `

  return await sendEmail({
    to: userEmail,
    subject: '🔐 Reset Your Password - ItaloConnection',
    html,
    text,
  })
}
