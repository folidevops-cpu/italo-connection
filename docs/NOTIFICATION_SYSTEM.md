how does the # Notification System Documentation

This document provides comprehensive information about the notification system implementation in the ItaloConnection marketplace platform.

## Overview

The notification system allows users to receive real-time updates about important events such as:
- Email and phone verification success
- Listing approval or rejection
- New inquiries or messages
- Account actions (suspension, etc.)
- Admin messages
- Verification reminders

## Architecture

### Database Model

The `Notification` model is defined in the Prisma schema:

```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String
  channel   String   @default("IN_APP")
  payload   Json
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("notifications")
}
```

### Notification Types

The system supports the following notification types:

- `EMAIL_VERIFIED` - User's email has been verified
- `PHONE_VERIFIED` - User's phone number has been verified
- `LISTING_APPROVED` - User's listing has been approved by admin
- `LISTING_REJECTED` - User's listing has been rejected by admin
- `NEW_INQUIRY` - User received a new inquiry about a listing
- `NEW_MESSAGE` - User received a new message
- `ACCOUNT_SUSPENDED` - User's account has been suspended
- `LISTING_UPDATED` - User's listing has been updated
- `ADMIN_MESSAGE` - Admin sent a message to the user
- `VERIFICATION_REMINDER` - Reminder to complete verification

### Notification Channels

Currently supported channels:
- `IN_APP` - In-app notifications (default) ✅
- `EMAIL` - Email notifications (automatic) ✅
- `SMS` - SMS notifications (planned)

### Email Notifications

**Overview**: Every notification automatically triggers an email alert to the user. The email uses a generic template that does NOT include sensitive details for security/privacy reasons.

**Features**:
- 🔔 Generic alert message (no notification details)
- 🔒 Security-first approach (users must log in to see details)
- ✨ Professional HTML email template
- 📱 Mobile-responsive design
- 🔗 Direct link to `/notifications` page
- ⚡ Automatic (enabled by default)
- 🛡️ Graceful error handling (notification still created if email fails)

**Email Template**:
```
Subject: 🔔 You have 1 new notification - ItaloConnection

Hello [User Name],

You have received 1 new notification on ItaloConnection.

[Info Box]
For security and privacy reasons, we don't include notification 
details in emails. Please log in to your account to view your notifications.

[View Notifications Button]

Quick tip: You can manage your notification preferences and view 
all notifications by clicking the bell icon 🔔 in your account dashboard.
```

**Implementation**: When `createNotification()` is called, it automatically:
1. Creates the notification in the database
2. Fetches user's email and name
3. Sends generic email alert via `sendNewNotificationEmail()`
4. Logs success/failure (email failure doesn't affect notification creation)

**Disable Email for Specific Notification**:
```typescript
await createNotification(prisma, {
  userId: 'user-id',
  type: 'LISTING_APPROVED',
  payload: { /* ... */ },
  sendEmail: false  // Disable email for this notification
})
```

**SMTP Configuration**: See `.env` file or `EMAIL_NOTIFICATIONS.md` for setup details.

## Backend API

### API Endpoints

#### 1. Get Notifications
```
GET /api/notifications
```

**Query Parameters:**
- `limit` (number, default: 20) - Number of notifications to fetch
- `offset` (number, default: 0) - Pagination offset
- `unreadOnly` (boolean) - Only fetch unread notifications

**Response:**
```json
{
  "notifications": [
    {
      "id": "notification_id",
      "userId": "user_id",
      "type": "LISTING_APPROVED",
      "channel": "IN_APP",
      "payload": {
        "listingId": "listing_id",
        "listingTitle": "Beautiful Apartment",
        "approvedAt": "2025-10-21T00:00:00.000Z"
      },
      "read": false,
      "createdAt": "2025-10-21T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  },
  "unreadCount": 5
}
```

#### 2. Get Unread Count
```
GET /api/notifications/unread-count
```

**Response:**
```json
{
  "unreadCount": 5
}
```

#### 3. Mark Notification as Read
```
PATCH /api/notifications/:id/read
```

**Response:**
```json
{
  "success": true,
  "notification": { ... },
  "unreadCount": 4
}
```

#### 4. Mark All as Read
```
POST /api/notifications/read-all
```

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "unreadCount": 0
}
```

## Server Utilities

### Notification Helper Functions

Located in `server/utils/notifications.ts`:

#### Create Notification
```typescript
await createNotification(prisma, {
  userId: 'user_id',
  type: 'LISTING_APPROVED',
  channel: 'IN_APP',
  payload: {
    listingId: 'listing_id',
    listingTitle: 'Beautiful Apartment'
  }
})
```

#### Helper Methods

The `NotificationHelpers` object provides convenient methods for common notification scenarios:

```typescript
// Email verified
await NotificationHelpers.emailVerified(prisma, userId)

// Phone verified
await NotificationHelpers.phoneVerified(prisma, userId)

// Listing approved
await NotificationHelpers.listingApproved(
  prisma, 
  userId, 
  'Listing Title', 
  listingId
)

// Listing rejected
await NotificationHelpers.listingRejected(
  prisma, 
  userId, 
  'Listing Title', 
  listingId, 
  'Reason for rejection'
)

// New inquiry
await NotificationHelpers.newInquiry(
  prisma, 
  userId, 
  'Listing Title', 
  listingId, 
  'Inquirer Name'
)

// Admin message
await NotificationHelpers.adminMessage(
  prisma, 
  userId, 
  'Your custom message'
)

// Verification reminder
await NotificationHelpers.verificationReminder(
  prisma, 
  userId, 
  'email' // or 'phone'
)
```

## Frontend Components

### NotificationBell Component

A dropdown component that displays recent notifications in the navigation bar.

**Location:** `app/components/NotificationBell.vue`

**Features:**
- Bell icon with unread badge
- Dropdown with last 10 notifications
- Click notification to navigate to related page
- Mark individual notifications as read
- Mark all as read button
- Auto-refresh unread count every minute
- Link to full notifications page

**Usage:**
```vue
<template>
  <NotificationBell />
</template>
```

### Notifications Page

A full-page view of all notifications with filtering and pagination.

**Location:** `app/pages/notifications.vue`

**Features:**
- Tab filtering (All / Unread)
- Unread count display
- Mark all as read button
- Refresh button
- Click to navigate to related content
- Load more pagination
- Notification type badges
- Relative time display

**Route:** `/notifications`

## Frontend Composable

### useNotifications

A composable that provides notification functionality to Vue components.

**Location:** `app/composables/useNotifications.ts`

**Usage:**
```vue
<script setup>
const {
  notifications,       // Ref<Notification[]>
  unreadCount,        // Ref<number>
  loading,            // Ref<boolean>
  error,              // Ref<string | null>
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
  markAllAsRead,
  getNotificationMessage,
  formatNotificationTime,
  startAutoRefresh
} = useNotifications()

// Fetch notifications
await fetchNotifications({ limit: 20, offset: 0, unreadOnly: false })

// Mark as read
await markAsRead(notificationId)

// Mark all as read
await markAllAsRead()

// Start auto-refresh (returns cleanup function)
const stopAutoRefresh = startAutoRefresh(60000) // 60 seconds
</script>
```

## Integration Points

### Email Verification

When a user verifies their email:

**File:** `server/api/verify/email/[token].get.ts`

```typescript
// After successful verification
await NotificationHelpers.emailVerified(prisma, updatedUser.id)
```

### Phone Verification

When a user verifies their phone:

**File:** `server/api/verify/phone.post.ts`

```typescript
// After successful verification
await NotificationHelpers.phoneVerified(prisma, updatedUser.id)
```

### Listing Approval

When an admin approves a listing:

**File:** `server/api/admin/listings/[id]/approve.post.ts`

```typescript
await NotificationHelpers.listingApproved(
  prisma,
  listing.ownerId,
  listing.title,
  listingId
)
```

### Listing Rejection

When an admin rejects a listing:

**File:** `server/api/admin/listings/[id]/reject.post.ts`

```typescript
await NotificationHelpers.listingRejected(
  prisma,
  listing.ownerId,
  listing.title,
  listingId,
  reason || 'No reason provided'
)
```

### Account Suspension

When an admin suspends a user account:

**File:** `server/api/admin/users/[id]/unverify.post.ts`

```typescript
await prisma.notification.create({
  data: {
    userId: targetUser.id,
    type: 'ACCOUNT_SUSPENDED',
    channel: 'IN_APP',
    payload: {
      message: reason,
      suspendedBy: adminEmail,
      suspendedAt: new Date().toISOString()
    }
  }
})
```

## Notification Messages

Notification messages are dynamically generated based on the notification type and payload:

```typescript
getNotificationMessage(notification: Notification): string
```

### Message Templates

- **EMAIL_VERIFIED:** "🎉 Your email has been verified successfully!"
- **PHONE_VERIFIED:** "🎉 Your phone number has been verified successfully!"
- **LISTING_APPROVED:** "✅ Your listing '[Title]' has been approved and is now live!"
- **LISTING_REJECTED:** "❌ Your listing '[Title]' was rejected. Reason: [Reason]"
- **NEW_INQUIRY:** "💬 You have a new inquiry about '[Title]'"
- **NEW_MESSAGE:** "📩 You have a new message from [Name]"
- **ACCOUNT_SUSPENDED:** "⚠️ [Custom Message]"
- **LISTING_UPDATED:** "📝 Your listing '[Title]' has been updated"
- **ADMIN_MESSAGE:** "📢 Admin: [Message]"
- **VERIFICATION_REMINDER:** "⏰ Reminder: Please verify your [Type]"

## Navigation Behavior

When a user clicks on a notification, they are automatically navigated to the relevant page:

- **LISTING_APPROVED/REJECTED/UPDATED:** → `/listings/[listingId]`
- **NEW_INQUIRY:** → `/listings/[listingId]`
- **EMAIL_VERIFIED/PHONE_VERIFIED:** → `/dashboard`
- **VERIFICATION_REMINDER (email):** → `/verify/email`
- **VERIFICATION_REMINDER (phone):** → `/verify/phone`
- **All others:** → `/notifications`

## Styling

### Notification Bell Badge
- Red badge for unread count
- Shows "9+" for counts > 9
- Positioned at top-right of bell icon

### Notification Items
- Unread: Blue left border + blue dot + bold text + light blue background
- Read: Standard styling
- Hover: Gray background
- Click: Navigate + mark as read

### Time Formatting
- "Just now" - < 1 minute
- "X minutes ago" - < 1 hour
- "X hours ago" - < 1 day
- "X days ago" - < 1 week
- "Month Day" or "Month Day, Year" - older

## Best Practices

### Creating Notifications

1. **Always use helper functions** when available:
   ```typescript
   // Good
   await NotificationHelpers.listingApproved(prisma, userId, title, id)
   
   // Avoid (unless custom notification)
   await createNotification(prisma, { ... })
   ```

2. **Include relevant data in payload:**
   ```typescript
   payload: {
     listingId: 'id',
     listingTitle: 'title',
     reason: 'reason',
     timestamp: new Date().toISOString()
   }
   ```

3. **Always wrap in try-catch:**
   ```typescript
   try {
     await NotificationHelpers.listingApproved(...)
   } catch (error) {
     console.error('Failed to create notification:', error)
     // Continue - don't fail the main operation
   }
   ```

### Performance

1. **Use pagination** for listing notifications
2. **Auto-refresh sparingly** - default 60 seconds
3. **Fetch unread count only** when needed
4. **Mark as read immediately** on click for better UX

### Security

1. **Always verify user ownership** before sending notifications
2. **Validate notification IDs** before marking as read
3. **Use Prisma cascade delete** to clean up notifications when users are deleted

## Testing

### Manual Testing

1. **Email Verification:**
   - Sign up → Verify email → Check for notification

2. **Phone Verification:**
   - Add phone → Verify → Check for notification

3. **Listing Approval:**
   - Create listing → Admin approves → Check notification

4. **Listing Rejection:**
   - Create listing → Admin rejects → Check notification

5. **Mark as Read:**
   - Click notification → Verify marked as read
   - Click "Mark all read" → Verify all marked

6. **Auto-Refresh:**
   - Leave notification bell open
   - Wait 60 seconds
   - Verify unread count updates

### API Testing

```bash
# Get notifications
curl -X GET http://localhost:3000/api/notifications?limit=10

# Get unread count
curl -X GET http://localhost:3000/api/notifications/unread-count

# Mark as read
curl -X PATCH http://localhost:3000/api/notifications/[id]/read

# Mark all as read
curl -X POST http://localhost:3000/api/notifications/read-all
```

## Future Enhancements

- [ ] Email notifications (integration with email service)
- [ ] SMS notifications (integration with Twilio)
- [ ] Push notifications (web push API)
- [ ] Notification preferences (allow users to customize)
- [ ] Notification grouping (combine similar notifications)
- [ ] Notification sound/toast
- [ ] Real-time notifications (WebSocket/SSE)
- [ ] Notification history export
- [ ] Notification analytics dashboard

## Troubleshooting

### Notifications not appearing

1. Check user authentication
2. Verify notification was created in database
3. Check browser console for errors
4. Refresh notifications manually

### Unread count incorrect

1. Refresh page
2. Call `fetchUnreadCount()` manually
3. Check database for orphaned notifications

### Navigation not working

1. Verify payload contains required data (listingId, etc.)
2. Check router configuration
3. Verify routes exist

## Support

For issues or questions about the notification system:
1. Check this documentation
2. Review server logs for errors
3. Test API endpoints with curl/Postman
4. Check browser console for frontend errors
