<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Welcome Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Welcome back, {{ userName }}!
      </h1>
      <p class="mt-2 text-gray-600">
        Manage your listings, profile, and notifications from your dashboard.
      </p>
    </div>

    <!-- Success Message -->
    <div v-if="route.query.verified === 'true'" class="mb-8">
      <div class="bg-green-50 border border-green-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">Email Verified Successfully!</h3>
            <p class="mt-2 text-sm text-green-700">You can now create listings.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Verification Status -->
    <div v-if="!isEmailVerified" class="mb-8">
      <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">
              Email Verification Required
            </h3>
            <div class="mt-2 text-sm text-yellow-700">
              <p>You need to verify your email before you can create listings.</p>
              <div class="mt-2 space-x-4">
                <button 
                  v-if="!isEmailVerified" 
                  @click="sendVerificationEmail" 
                  class="font-medium underline"
                  :disabled="isSending"
                >
                  {{ isSending ? 'Sending...' : 'Verify Email' }}
                </button>
                <span v-if="emailSent" class="text-green-600">Verification email sent! Please check your inbox.</span>
                <span v-if="emailSendError" class="text-red-600 block mt-1">{{ emailSendError }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5v4" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 5v4" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Listings</dt>
                <dd class="text-lg font-medium text-gray-900">
                  <span v-if="loadingStats">...</span>
                  <span v-else>{{ stats?.totalListings || 0 }}</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Active Listings</dt>
                <dd class="text-lg font-medium text-gray-900">
                  <span v-if="loadingStats">...</span>
                  <span v-else>{{ stats?.activeListings || 0 }}</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Notifications</dt>
                <dd class="text-lg font-medium text-gray-900">
                  <span v-if="loadingStats">...</span>
                  <span v-else>{{ stats?.unreadNotifications || 0 }}</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Services</dt>
                <dd class="text-lg font-medium text-gray-900">
                  <span v-if="loadingStats">...</span>
                  <span v-else>{{ stats?.totalServices || 0 }}</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <NuxtLink 
              to="/listings/create" 
              class="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              :class="{ 'opacity-50 pointer-events-none': !canCreateListings }"
            >
              <svg class="h-5 w-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="text-blue-700 font-medium">Create New Listing</span>
              <span v-if="!canCreateListings" class="ml-2 text-xs text-gray-500">(Verification required)</span>
            </NuxtLink>

            <NuxtLink to="/profile" class="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <svg class="h-5 w-5 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="text-green-700 font-medium">Edit Profile</span>
            </NuxtLink>

            <NuxtLink to="/listings/my" class="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <svg class="h-5 w-5 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span class="text-purple-700 font-medium">Manage Listings</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div class="space-y-3">
            <div v-if="loadingActivity" class="text-gray-500 text-sm">
              Loading activity...
            </div>
            <div v-else-if="!recentActivity || recentActivity.length === 0" class="text-gray-500 text-sm">
              No recent activity
            </div>
            <div v-else v-for="activity in recentActivity" :key="activity.id" class="flex items-start p-3 rounded-lg transition-colors" :class="{
              'bg-blue-50': activity.type === 'listing',
              'bg-purple-50': activity.type === 'service',
              'bg-yellow-50': activity.type === 'notification' && activity.status === 'unread',
              'bg-gray-50': activity.type === 'notification' && activity.status === 'read'
            }">
              <div class="flex-shrink-0 mt-0.5">
                <svg v-if="activity.type === 'listing'" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <svg v-else-if="activity.type === 'service'" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <svg v-else class="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                <div class="flex items-center mt-1">
                  <p class="text-xs text-gray-500">{{ activity.date }}</p>
                  <span v-if="activity.status" class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="{
                    'bg-green-100 text-green-800': activity.status === 'APPROVED' || activity.status === 'active',
                    'bg-yellow-100 text-yellow-800': activity.status === 'PENDING' || activity.status === 'unread',
                    'bg-gray-100 text-gray-800': activity.status === 'inactive' || activity.status === 'read',
                    'bg-red-100 text-red-800': activity.status === 'REJECTED'
                  }">
                    {{ activity.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ✅ Always use definePageMeta for page configuration
definePageMeta({
  middleware: 'auth'
})

// Set page meta
useSeoMeta({
  title: 'Dashboard - ItaloConnection',
  description: 'Manage your listings, profile, and notifications'
})

// Use the global auth state composable
const { user, refreshUser, isEmailVerified, canCreateListings, userName } = useAuthState()

// Get route for query params
const route = useRoute()

// Email verification state
const isSending = ref(false)
const emailSent = ref(false)
const emailSendError = ref('')

// Handle verification email send
const sendVerificationEmail = async () => {
  isSending.value = true
  emailSendError.value = ''
  
  try {
    await $fetch('/api/verify/send', { method: 'POST' })
    emailSent.value = true
    setTimeout(() => {
      emailSent.value = false
    }, 5000) // Hide message after 5 seconds
  } catch (error: any) {
    console.error('Failed to send verification email:', error)
    emailSendError.value = error.data?.message || 'Failed to send verification email. Please try again.'
    
    // Hide error after 5 seconds
    setTimeout(() => {
      emailSendError.value = ''
    }, 5000)
  } finally {
    isSending.value = false
  }
}

// Check for verification success message
onMounted(async () => {
  console.log('Dashboard mounted, refreshing user session...')
  await refreshUser()
  
  // Load dashboard data
  await Promise.all([
    loadStats(),
    loadActivity()
  ])
  
  // Check for verification success message
  if (route.query.verified === 'true') {
    console.log('Email verified! Session refreshed.')
    emailSent.value = true
    setTimeout(() => {
      emailSent.value = false
      // Remove query param from URL
      navigateTo('/dashboard', { replace: true })
    }, 5000)
  }
})

// Watch for route changes and refresh session
watch(() => route.query.verified, async (newVal) => {
  if (newVal === 'true') {
    console.log('Email verified, refreshing session...')
    await refreshUser()
    await loadStats()
  }
})

// Loading states
const loadingStats = ref(false)
const loadingActivity = ref(false)

// Stats data
const stats = ref<{
  totalListings: number
  activeListings: number
  totalServices: number
  activeServices: number
  unreadNotifications: number
  profileViews: number
} | null>(null)

// Recent activity
const recentActivity = ref<Array<{
  id: string
  type: string
  title: string
  status?: string
  date: string
  timestamp: string
}>>([])

// Load stats from API
const loadStats = async () => {
  loadingStats.value = true
  try {
    const data = await $fetch('/api/dashboard/stats')
    stats.value = data
  } catch (error) {
    console.error('Failed to load dashboard stats:', error)
    // Set default values on error
    stats.value = {
      totalListings: 0,
      activeListings: 0,
      totalServices: 0,
      activeServices: 0,
      unreadNotifications: 0,
      profileViews: 0
    }
  } finally {
    loadingStats.value = false
  }
}

// Load activity from API
const loadActivity = async () => {
  loadingActivity.value = true
  try {
    const data = await $fetch('/api/dashboard/activity') as { activity: Array<{
      id: string
      type: string
      title: string
      status?: string
      date: string
      timestamp: string
    }> }
    recentActivity.value = data.activity
  } catch (error) {
    console.error('Failed to load recent activity:', error)
    recentActivity.value = []
  } finally {
    loadingActivity.value = false
  }
}
</script>