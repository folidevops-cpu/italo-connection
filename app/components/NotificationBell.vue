<template>
  <div class="relative">
    <!-- Bell Icon Button -->
    <button
      @click="toggleDropdown"
      class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      :class="{ 'bg-gray-100': isOpen }"
    >
      <!-- Bell Icon -->
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>

      <!-- Unread Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
          <button
            v-if="unreadCount > 0"
            @click="handleMarkAllAsRead"
            class="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Mark all read
          </button>
        </div>

        <!-- Notifications List -->
        <div class="max-h-96 overflow-y-auto">
          <!-- Loading State -->
          <div v-if="loading" class="px-4 py-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2 text-sm text-gray-500">Loading notifications...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="px-4 py-8 text-center text-red-600">
            <p>Failed to load notifications</p>
            <button
              @click="loadNotifications"
              class="mt-2 text-sm text-blue-600 hover:text-blue-700"
            >
              Try again
            </button>
          </div>

          <!-- Empty State -->
          <div v-else-if="notifications.length === 0" class="px-4 py-8 text-center">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p class="mt-2 text-sm text-gray-500">No notifications yet</p>
          </div>

          <!-- Notifications -->
          <div v-else>
            <div
              v-for="notification in notifications"
              :key="notification.id"
              @click="handleNotificationClick(notification)"
              class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
              :class="{ 'bg-blue-50': !notification.read }"
            >
              <div class="flex items-start">
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-900" :class="{ 'font-semibold': !notification.read }">
                    {{ getNotificationMessage(notification) }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ formatNotificationTime(notification.createdAt) }}
                  </p>
                </div>
                <div
                  v-if="!notification.read"
                  class="ml-2 flex-shrink-0"
                >
                  <span class="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <NuxtLink
            to="/notifications"
            @click="isOpen = false"
            class="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all notifications
          </NuxtLink>
        </div>
      </div>
    </Transition>

    <!-- Click Outside Handler -->
    <div
      v-if="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup lang="ts">
const { notifications, unreadCount, loading, error, fetchNotifications, markAsRead, markAllAsRead, getNotificationMessage, formatNotificationTime, startAutoRefresh } = useNotifications()

const isOpen = ref(false)

// Load notifications when component mounts
onMounted(async () => {
  console.log('🔔 NotificationBell: Component mounted, fetching initial notifications...')
  try {
    await fetchNotifications({ limit: 10 })
    console.log('🔔 NotificationBell: Initial fetch complete. Unread count:', unreadCount.value)
    console.log('🔔 NotificationBell: Notifications:', notifications.value.length)
  } catch (err) {
    console.error('🔔 NotificationBell: Error fetching initial notifications:', err)
  }
  
  // Start auto-refresh for unread count
  console.log('🔔 NotificationBell: Starting auto-refresh (60s interval)')
  const stopAutoRefresh = startAutoRefresh(60000) // Refresh every minute
  
  // Cleanup on unmount
  onUnmounted(() => {
    console.log('🔔 NotificationBell: Component unmounting, stopping auto-refresh')
    stopAutoRefresh()
  })
})

// Toggle dropdown
const toggleDropdown = async () => {
  isOpen.value = !isOpen.value
  console.log('🔔 NotificationBell: Dropdown toggled:', isOpen.value ? 'open' : 'closed')
  
  if (isOpen.value) {
    // Reload notifications when opening
    console.log('🔔 NotificationBell: Reloading notifications...')
    try {
      await fetchNotifications({ limit: 10 })
      console.log('🔔 NotificationBell: Reload complete. Count:', notifications.value.length)
    } catch (err) {
      console.error('🔔 NotificationBell: Error reloading notifications:', err)
    }
  }
}

// Handle notification click
const handleNotificationClick = async (notification: any) => {
  // Mark as read if unread
  if (!notification.read) {
    await markAsRead(notification.id)
  }

  // Navigate based on notification type
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
    
    default:
      router.push('/notifications')
  }
  
  isOpen.value = false
}

// Mark all as read
const handleMarkAllAsRead = async () => {
  await markAllAsRead()
}

// Load notifications
const loadNotifications = async () => {
  await fetchNotifications({ limit: 10 })
}
</script>
