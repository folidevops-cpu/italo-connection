# Email Notification System

This document explains the email notification system implemented for admin user management actions.

## Overview

The system sends professional HTML emails to users when their accounts are suspended or deleted by administrators.

## Configuration

### Environment Variables (`.env`)

```env
# SMTP Configuration (Gmail)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="folidevops@gmail.com"
SMTP_PASS="jbdkfaorydeqyqrv"  # Gmail App Password
SMTP_FROM_EMAIL="folidevops@gmail.com"
SMTP_FROM_NAME="ItaloConnection"
ADMIN_EMAIL="admin@yourdomain.com"  # Support contact email
```

### Runtime Config (`nuxt.config.ts`)

All SMTP variables are exposed in the runtime config:
- `smtpHost`
- `smtpPort`
- `smtpUser`
- `smtpPass`
- `smtpFromEmail`
- `smtpFromName`
- `adminEmail`

## Email Utility (`server/utils/email.ts`)

### Core Function: `sendEmail(options)`

Base function for sending emails using nodemailer.

**Parameters:**
- `to`: Recipient email address
- `subject`: Email subject line
- `html`: HTML email body
- `text`: Plain text fallback (optional)

**Returns:** `Promise<boolean>` - Success status

### Account Suspension Email

**Function:** `sendAccountSuspendedEmail(userEmail, userName, reason)`

Sends a professionally styled email when an account is suspended.

**Email includes:**
- ⚠️ Warning header with orange theme
- Personalized greeting
- Highlighted reason for suspension
- List of account restrictions:
  - Cannot create new listings
  - Existing listings hidden
  - Limited feature access
- "Contact Support" button
- Support email contact information

**Template:** Professional HTML with inline CSS for email client compatibility

### Account Deletion Email

**Function:** `sendAccountDeletedEmail(userEmail, userName, reason)`

Sends a professionally styled email when an account is permanently deleted.

**Email includes:**
- 🚫 Alert header with red theme
- Personalized greeting
- Highlighted reason for deletion
- List of deleted data:
  - User profile and account information
  - All listings
  - All uploaded images
  - All notifications and messages
- "Contact Support" button
- Permanent action warning

**Template:** Professional HTML with inline CSS, red color scheme for severity

## API Integration

### Suspend Account Endpoint

**File:** `server/api/admin/users/[id]/unverify.post.ts`

**Flow:**
1. Validates admin authentication
2. Prevents self-suspension
3. Gets suspension reason from request body
4. Updates `emailVerified` to `false`
5. Creates audit log entry
6. Creates in-app notification
7. **Sends email notification** ✅
8. Returns success response

**Email Error Handling:**
- Catches email errors separately
- Logs error but continues (user is still suspended)
- Prevents suspension from failing due to email issues

### Delete Account Endpoint

**File:** `server/api/admin/users/[id]/delete.post.ts`

**Flow:**
1. Validates admin authentication
2. Prevents self-deletion
3. Fetches user with all relations
4. Deletes all S3 images
5. Creates audit log entry
6. Stores user email/name before deletion
7. Deletes user from database (cascade)
8. **Sends email notification** ✅
9. Returns success with statistics

**Email Error Handling:**
- Catches email errors separately
- Logs error but continues (user is already deleted)
- Prevents deletion from failing due to email issues

## Email Templates

Both templates follow email best practices:

### Design Features
- **Responsive:** Mobile-friendly design
- **Inline CSS:** Maximum email client compatibility
- **Professional Layout:** Header, content area, footer
- **Branded:** Uses ItaloConnection colors and styling
- **Accessible:** Includes plain text fallback

### Color Schemes
- **Suspension:** Orange/amber (#f97316) for warning
- **Deletion:** Red (#dc2626) for critical action

### Call-to-Action
- Prominent "Contact Support" button
- Support email clearly visible
- Mailto links for easy contact

## Testing

### Test Account Suspension

1. Navigate to Admin Users page: `/admin/users`
2. Find a verified user (not yourself)
3. Click "Suspend" button
4. Enter suspension reason
5. Check:
   - ✅ User's `emailVerified` set to `false`
   - ✅ Audit log created
   - ✅ In-app notification created
   - ✅ **Email sent to user** 📧
   - ✅ Check spam folder if not in inbox

### Test Account Deletion

1. Navigate to Admin Users page: `/admin/users`
2. Find any user (not yourself)
3. Click "Delete" button
4. Enter deletion reason in modal
5. Confirm deletion
6. Check:
   - ✅ User deleted from database
   - ✅ All listings deleted
   - ✅ All S3 images deleted
   - ✅ Audit log created
   - ✅ **Email sent to user** 📧
   - ✅ Check spam folder if not in inbox

### Check Email Logs

Server console will show:
```
Email sent successfully to user@example.com
Account suspension email sent to user@example.com
```

Or if failed:
```
Failed to send email: <error details>
Failed to send suspension email: <error details>
```

## Gmail Setup

If using Gmail SMTP, you need an **App Password**:

1. Enable 2-Factor Authentication on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate new app password for "Mail"
4. Use the 16-character password in `SMTP_PASS`
5. Never use your regular Gmail password

## Troubleshooting

### Email Not Sending

1. **Check SMTP credentials:**
   ```bash
   # Verify environment variables are loaded
   echo $SMTP_HOST
   echo $SMTP_USER
   ```

2. **Check Gmail settings:**
   - 2FA enabled?
   - App password generated?
   - "Less secure app access" NOT needed (deprecated)

3. **Check server logs:**
   ```bash
   npm run dev
   # Look for email-related errors in console
   ```

4. **Test SMTP connection:**
   - Try sending test email from another tool
   - Verify Gmail isn't blocking the IP

### Email Goes to Spam

1. **Add SPF record** to your domain (if using custom domain)
2. **Add DKIM signature** (requires email service upgrade)
3. **Use professional "from" address** (not personal Gmail)
4. **Avoid spam trigger words** in subject/body
5. **Include unsubscribe link** (optional for transactional emails)

### Emails Not Received

1. Check spam/junk folder
2. Check email address is correct in database
3. Check server logs for email errors
4. Verify SMTP_FROM_EMAIL is verified with Gmail
5. Test with different email provider (Gmail, Outlook, etc.)

## Production Recommendations

For production, consider using a dedicated email service:

### Options:
1. **SendGrid** (Free tier: 100 emails/day)
2. **AWS SES** (Free tier: 62,000 emails/month)
3. **Resend** (Free tier: 3,000 emails/month)
4. **Mailgun** (Free tier: 5,000 emails/month)
5. **Postmark** (Free tier: 100 emails/month)

### Benefits:
- Higher deliverability rates
- Better analytics
- Automatic bounce handling
- Template management
- No rate limiting issues
- Professional reputation

### Migration:
To switch to a different service, update the `createTransporter()` function in `server/utils/email.ts`.

## Email Templates Customization

To customize email templates:

1. Edit HTML in `server/utils/email.ts`
2. Modify colors, layout, or content
3. Test in multiple email clients:
   - Gmail
   - Outlook
   - Apple Mail
   - Yahoo Mail
   - Mobile devices

### Email Testing Tools:
- [Litmus](https://www.litmus.com/)
- [Email on Acid](https://www.emailonacid.com/)
- [Mail Tester](https://www.mail-tester.com/)

## Security Considerations

1. **Never expose SMTP credentials** in client-side code
2. **Use environment variables** for all sensitive data
3. **Validate email addresses** before sending
4. **Rate limit** email sending to prevent abuse
5. **Log email activity** for audit trails
6. **Use App Passwords** instead of main password
7. **Monitor for suspicious activity** (mass emails, etc.)

## Future Enhancements

- [ ] Add email queue for bulk operations
- [ ] Add email templates for other actions (role change, etc.)
- [ ] Add "View in browser" link
- [ ] Add unsubscribe functionality
- [ ] Add email preferences for users
- [ ] Add email delivery tracking
- [ ] Add retry logic for failed emails
- [ ] Add email verification before account deletion
- [ ] Add admin notification emails
- [ ] Create email template builder UI

## Support

If you encounter issues:
1. Check this documentation
2. Review server logs
3. Test SMTP connection independently
4. Contact support at ${ADMIN_EMAIL}
