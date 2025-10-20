<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">User Verification</h1>
        <p class="mt-2 text-gray-600">
          Manually verify users or override verification status
        </p>
      </div>
      <NuxtLink 
        to="/admin" 
        class="text-blue-600 hover:text-blue-700 font-medium"
      >
        ← Back to Dashboard
      </NuxtLink>
    </div>

    <!-- Unverified Users -->
    <div class="bg-white shadow rounded-lg p-6 mb-8">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Unverified Users</h2>
      
      <div v-if="pending" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-sm text-gray-500">Loading unverified users...</p>
      </div>

      <div v-else-if="error" class="text-center py-8 text-red-600">
        <p>Failed to load unverified users</p>
      </div>

      <div v-else-if="!unverifiedUsers || unverifiedUsers.length === 0" class="text-center py-8 text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <p class="mt-2">All users are verified!</p>
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="user in unverifiedUsers" 
          :key="user.id"
          class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0 h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
              {{ user.email.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-900">
                {{ user.profile?.displayName || 'No name' }}
              </h3>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
              <p class="text-xs text-gray-400">
                Joined {{ formatDate(user.createdAt) }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <span class="px-3 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
              ✗ Unverified
            </span>
            <button
              @click="verifyUser(user.id)"
              :disabled="verifying === user.id"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium disabled:opacity-50"
            >
              {{ verifying === user.id ? 'Verifying...' : 'Verify Now' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Verification -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Bulk Verification</h2>
      <p class="text-sm text-gray-600 mb-4">
        Verify multiple users at once by entering their email addresses (one per line)
      </p>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email Addresses
          </label>
          <textarea
            v-model="bulkEmails"
            rows="6"
            placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div v-if="bulkResult" class="p-4 rounded-md" :class="{
          'bg-green-50 text-green-800': bulkResult.success,
          'bg-red-50 text-red-800': !bulkResult.success
        }">
          <p class="text-sm font-medium">{{ bulkResult.message }}</p>
          <ul v-if="bulkResult.details" class="mt-2 text-sm list-disc list-inside">
            <li v-for="(detail, index) in bulkResult.details" :key="index">
              {{ detail }}
            </li>
          </ul>
        </div>

        <div class="flex space-x-3">
          <button
            @click="bulkVerify"
            :disabled="bulkProcessing || !bulkEmails.trim()"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50"
          >
            {{ bulkProcessing ? 'Verifying...' : 'Verify All' }}
          </button>
          <button
            @click="clearBulk"
            class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Enforce admin access
definePageMeta({
  middleware: 'admin'
})

// Set page meta
useSeoMeta({
  title: 'User Verification - Admin Dashboard',
  description: 'Manually verify users or override verification status'
})

// Fetch unverified users
const { data: unverifiedUsers, pending, error, refresh } = await useFetch('/api/admin/users/unverified', {
  default: () => []
})

// Verification state
const verifying = ref<string | null>(null)

// Bulk verification state
const bulkEmails = ref('')
const bulkProcessing = ref(false)
const bulkResult = ref<{ success: boolean; message: string; details?: string[] } | null>(null)

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Verify single user
const verifyUser = async (userId: string) => {
  if (!confirm('Are you sure you want to manually verify this user?')) return
  
  verifying.value = userId
  try {
    await $fetch(`/api/admin/users/${userId}/verify`, {
      method: 'POST'
    })
    await refresh()
  } catch (error: any) {
    alert('Failed to verify user: ' + error.message)
  } finally {
    verifying.value = null
  }
}

// Bulk verify
const bulkVerify = async () => {
  const emails = bulkEmails.value
    .split('\n')
    .map(e => e.trim())
    .filter(e => e && e.includes('@'))
  
  if (emails.length === 0) {
    bulkResult.value = {
      success: false,
      message: 'No valid email addresses found'
    }
    return
  }

  if (!confirm(`Are you sure you want to verify ${emails.length} user(s)?`)) return
  
  bulkProcessing.value = true
  bulkResult.value = null
  
  try {
    const response = await $fetch('/api/admin/users/bulk-verify', {
      method: 'POST',
      body: { emails }
    })
    
    bulkResult.value = {
      success: true,
      message: response.message,
      details: response.details
    }
    
    // Refresh the unverified users list
    await refresh()
    
    // Clear the textarea on success
    if (response.verified > 0) {
      bulkEmails.value = ''
    }
  } catch (error: any) {
    bulkResult.value = {
      success: false,
      message: error.data?.message || 'Failed to verify users'
    }
  } finally {
    bulkProcessing.value = false
  }
}

// Clear bulk form
const clearBulk = () => {
  bulkEmails.value = ''
  bulkResult.value = null
}
</script>
