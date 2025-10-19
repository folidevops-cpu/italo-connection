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
    <div v-if="!user?.emailVerified" class="mb-8">
      <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">
              Verification Required
            </h3>
            <div class="mt-2 text-sm text-yellow-700">
              <p>You need to verify your email before you can create listings.</p>
              <div class="mt-2 space-x-4">
                <button 
                  v-if="!user?.emailVerified" 
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
                <dd class="text-lg font-medium text-gray-900">{{ stats.totalListings }}</dd>
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
                <dd class="text-lg font-medium text-gray-900">{{ stats.activeListings }}</dd>
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
                <dd class="text-lg font-medium text-gray-900">{{ stats.unreadNotifications }}</dd>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Profile Views</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.profileViews }}</dd>
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

            <NuxtLink to="/listings" class="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
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
            <div v-if="recentActivity.length === 0" class="text-gray-500 text-sm">
              No recent activity
            </div>
            <div v-else v-for="activity in recentActivity" :key="activity.id" class="flex items-center p-3 bg-gray-50 rounded-lg">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                <p class="text-xs text-gray-500">{{ activity.date }}</p>
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

// Get session from nuxt-auth-utils
const { user, loggedIn, fetch: fetchSession } = useUserSession()

// Get route for query params
const route = useRoute()

// Computed user name
const userName = computed(() => {
  if (!user.value) return ''
  const userData = user.value as any
  return userData.displayName || userData.email || 'User'
})

// Check if user can create listings (only email verification required)
const canCreateListings = computed(() => {
  if (!user.value) return false
  const userData = user.value as any
  return userData.emailVerified
})

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
  if (route.query.verified === 'true') {
    // Refresh user session to get updated verification status
    await fetchSession()
  }
})

// Mock stats data - will be replaced with real API calls later
const stats = ref({
  totalListings: 0,
  activeListings: 0,
  unreadNotifications: 0,
  profileViews: 0
})

// Mock recent activity - will be replaced with real API calls later
const recentActivity = ref([
  // Will be populated from API
])

// TODO: Replace with real API calls using useFetch when backend is ready
// const { data: dashboardStats } = await useFetch('/api/dashboard/stats', {
//   default: () => ({ totalListings: 0, activeListings: 0, unreadNotifications: 0, profileViews: 0 })
// })

// const { data: recentActivity } = await useFetch('/api/dashboard/activity', {
//   default: () => []
// })
</script>