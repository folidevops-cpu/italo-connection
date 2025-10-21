<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Notifications</h1>
            <p class="mt-1 text-sm text-gray-600">
              {{ unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!' }}
            </p>
          </div>
          <div class="flex gap-2">
            <button
              v-if="unreadCount > 0"
              @click="handleMarkAllAsRead"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Mark all read
            </button>
            <button
              @click="loadNotifications"
              :disabled="loading"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
            >
              <svg
                class="w-4 h-4 inline-block mr-1"
                :class="{ 'animate-spin': loading }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="mt-6 border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'all'"
              class="pb-4 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="activeTab === 'all' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              All
              <span class="ml-2 py-0.5 px-2 rounded-full text-xs" :class="activeTab === 'all' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'">
                {{ totalCount }}
              </span>
            </button>
            <button
              @click="activeTab = 'unread'"
              class="pb-4 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="activeTab === 'unread' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              Unread
              <span class="ml-2 py-0.5 px-2 rounded-full text-xs" :class="activeTab === 'unread' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'">
                {{ unreadCount }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && notifications.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading notifications...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <svg
          class="mx-auto h-12 w-12 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="mt-2 text-red-600">{{ error }}</p>
        <button
          @click="loadNotifications"
          class="mt-4 text-blue-600 hover:text-blue-700 font-medium"
        >
          Try again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="notifications.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <svg
          class="mx-auto h-16 w-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No notifications</h3>
        <p class="mt-2 text-gray-500">
          {{ activeTab === 'unread' ? 'You have no unread notifications' : 'You haven\'t received any notifications yet' }}
        </p>
      </div>

      <!-- Notifications List -->
      <div v-else class="space-y-2">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          @click="handleNotificationClick(notification)"
          class="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          :class="{ 'border-l-4 border-blue-600': !notification.read }"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <p
                  class="text-base text-gray-900"
                  :class="{ 'font-semibold': !notification.read }"
                >
                  {{ getNotificationMessage(notification) }}
                </p>
                <span
                  v-if="!notification.read"
                  class="inline-block flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full"
                ></span>
              </div>
              <div class="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span>{{ formatNotificationTime(notification.createdAt) }}</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {{ getNotificationType(notification.type) }}
                </span>
              </div>
            </div>
            <button
              v-if="!notification.read"
              @click.stop="markAsRead(notification.id)"
              class="ml-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Mark read
            </button>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="hasMore" class="mt-6 text-center">
        <button
          @click="loadMore"
          :disabled="loading"
          class="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
        >
          {{ loading ? 'Loading...' : 'Load More' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

useSeoMeta({
  title: 'Notifications',
  description: 'View your notifications'
})

const { notifications, unreadCount, loading, error, fetchNotifications, markAsRead, markAllAsRead, getNotificationMessage, formatNotificationTime } = useNotifications()

const activeTab = ref<'all' | 'unread'>('all')
const totalCount = ref(0)
const hasMore = ref(false)
const currentOffset = ref(0)
const pageSize = 20

// Load notifications
const loadNotifications = async (append = false) => {
  const offset = append ? currentOffset.value : 0
  
  const response = await fetchNotifications({
    limit: pageSize,
    offset,
    unreadOnly: activeTab.value === 'unread'
  })

  totalCount.value = response.pagination.total
  hasMore.value = response.pagination.hasMore
  
  if (append) {
    currentOffset.value = offset + pageSize
  } else {
    currentOffset.value = pageSize
  }
}

// Load more notifications
const loadMore = () => {
  loadNotifications(true)
}

// Watch active tab changes
watch(activeTab, () => {
  currentOffset.value = 0
  loadNotifications()
})

// Handle notification click
const handleNotificationClick = async (notification: any) => {
  if (!notification.read) {
    await markAsRead(notification.id)
  }

  const router = useRouter()
  
  switch (notification.type) {
    case 'LISTING_APPROVED':
    case 'LISTING_REJECTED':
    case 'LISTING_UPDATED':
      if (notification.payload.listingId) {
        router.push(`/listings/${notification.payload.listingId}`)
      }
      break
    
    case 'NEW_INQUIRY':
      if (notification.payload.listingId) {
        router.push(`/listings/${notification.payload.listingId}`)
      }
      break
    
    case 'EMAIL_VERIFIED':
    case 'PHONE_VERIFIED':
      router.push('/dashboard')
      break
    
    case 'VERIFICATION_REMINDER':
      if (notification.payload.verificationType === 'email') {
        router.push('/verify/email')
      } else if (notification.payload.verificationType === 'phone') {
        router.push('/verify/phone')
      }
      break
  }
}

// Mark all as read
const handleMarkAllAsRead = async () => {
  await markAllAsRead()
  await loadNotifications()
}

// Get notification type label
const getNotificationType = (type: string): string => {
  const typeMap: Record<string, string> = {
    EMAIL_VERIFIED: 'Verification',
    PHONE_VERIFIED: 'Verification',
    LISTING_APPROVED: 'Listing',
    LISTING_REJECTED: 'Listing',
    NEW_INQUIRY: 'Inquiry',
    NEW_MESSAGE: 'Message',
    ACCOUNT_SUSPENDED: 'Account',
    LISTING_UPDATED: 'Listing',
    ADMIN_MESSAGE: 'Admin',
    VERIFICATION_REMINDER: 'Reminder'
  }
  return typeMap[type] || 'Notification'
}

// Load on mount
onMounted(() => {
  loadNotifications()
})
</script>
