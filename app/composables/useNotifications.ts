import type { Ref } from 'vue'

export interface Notification {
  id: string
  userId: string
  type: string
  channel: string
  payload: any
  read: boolean
  createdAt: string
}

export interface NotificationsResponse {
  notifications: Notification[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  unreadCount: number
}

export const useNotifications = () => {
  const notifications = ref<Notification[]>([])
  const unreadCount = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch notifications
  const fetchNotifications = async (params?: {
    limit?: number
    offset?: number
    unreadOnly?: boolean
  }) => {
    loading.value = true
    error.value = null

    try {
      const query: any = {}
      if (params?.limit) query.limit = params.limit
      if (params?.offset) query.offset = params.offset
      if (params?.unreadOnly) query.unreadOnly = 'true'

      const response = await $fetch<NotificationsResponse>('/api/notifications', {
        query
      })

      notifications.value = response.notifications
      unreadCount.value = response.unreadCount

      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch notifications'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch unread count only
  const fetchUnreadCount = async () => {
    try {
      const response = await $fetch<{ unreadCount: number }>('/api/notifications/unread-count')
      unreadCount.value = response.unreadCount
      return response.unreadCount
    } catch (err: any) {
      console.error('Failed to fetch unread count:', err)
      return unreadCount.value
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await $fetch<{ success: boolean; unreadCount: number }>(
        `/api/notifications/${notificationId}/read`,
        {
          method: 'PATCH'
        }
      )

      // Update local state
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
      }
      unreadCount.value = response.unreadCount

      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to mark notification as read'
      throw err
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await $fetch<{ success: boolean; unreadCount: number }>(
        '/api/notifications/read-all',
        {
          method: 'POST'
        }
      )

      // Update local state
      notifications.value.forEach(n => {
        n.read = true
      })
      unreadCount.value = 0

      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to mark all notifications as read'
      throw err
    }
  }

  // Get notification message
  const getNotificationMessage = (notification: Notification): string => {
    const { type, payload } = notification

    switch (type) {
      case 'EMAIL_VERIFIED':
        return '🎉 Your email has been verified successfully!'
      
      case 'PHONE_VERIFIED':
        return '🎉 Your phone number has been verified successfully!'
      
      case 'LISTING_APPROVED':
        return `✅ Your listing "${payload.listingTitle}" has been approved and is now live!`
      
      case 'LISTING_REJECTED':
        return `❌ Your listing "${payload.listingTitle}" was rejected. Reason: ${payload.reason || 'Not specified'}`
      
      case 'NEW_INQUIRY':
        return `💬 You have a new inquiry about "${payload.listingTitle}"`
      
      case 'NEW_MESSAGE':
        return `📩 You have a new message from ${payload.senderName}`
      
      case 'ACCOUNT_SUSPENDED':
        return `⚠️ ${payload.message || 'Your account has been suspended. Please contact support.'}`
      
      case 'LISTING_UPDATED':
        return `📝 Your listing "${payload.listingTitle}" has been updated`
      
      case 'ADMIN_MESSAGE':
        return `📢 Admin: ${payload.message}`
      
      case 'VERIFICATION_REMINDER':
        return `⏰ Reminder: Please verify your ${payload.verificationType} to start posting listings`
      
      default:
        return 'You have a new notification'
    }
  }

  // Format notification time
  const formatNotificationTime = (createdAt: string): string => {
    const date = new Date(createdAt)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  // Auto-refresh unread count periodically
  const startAutoRefresh = (intervalMs: number = 60000) => {
    const interval = setInterval(() => {
      fetchUnreadCount()
    }, intervalMs)

    // Cleanup function
    return () => clearInterval(interval)
  }

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    getNotificationMessage,
    formatNotificationTime,
    startAutoRefresh
  }
}
