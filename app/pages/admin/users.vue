<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
        <p class="mt-2 text-gray-600">
          View and manage all registered users
        </p>
      </div>
      <NuxtLink 
        to="/admin" 
        class="text-blue-600 hover:text-blue-700 font-medium"
      >
        ← Back to Dashboard
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-white p-6 rounded-lg shadow mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input 
            v-model="filters.search" 
            type="text" 
            placeholder="Email or name..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="debouncedSearch"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select 
            v-model="filters.role" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          >
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Verification</label>
          <select 
            v-model="filters.verified" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          >
            <option value="">All Users</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
        </div>
        <div class="flex items-end">
          <button 
            @click="resetFilters"
            class="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div v-if="pending" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading users...</p>
      </div>

      <div v-else-if="error" class="text-center py-12 text-red-600">
        <p>Failed to load users</p>
        <button @click="refresh" class="mt-4 text-blue-600 hover:text-blue-700">
          Try again
        </button>
      </div>

      <div v-else-if="!users || users.length === 0" class="text-center py-12 text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <p class="mt-2">No users found</p>
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Joined
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {{ user.profile?.displayName?.charAt(0) || user.email.charAt(0).toUpperCase() }}
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ user.profile?.displayName || 'No name' }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ user.id.slice(0, 8) }}...
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ user.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-purple-100 text-purple-800': user.role === 'ADMIN',
                  'bg-gray-100 text-gray-800': user.role === 'USER'
                }"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center space-x-2">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': user.emailVerified,
                    'bg-red-100 text-red-800': !user.emailVerified
                  }"
                >
                  {{ user.emailVerified ? '✓ Verified' : '✗ Unverified' }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(user.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button
                v-if="!user.emailVerified"
                @click="verifyUser(user.id)"
                class="text-green-600 hover:text-green-900"
                :disabled="verifying === user.id"
              >
                {{ verifying === user.id ? 'Verifying...' : 'Verify' }}
              </button>
              <button
                v-if="user.role === 'USER'"
                @click="makeAdmin(user.id)"
                class="text-purple-600 hover:text-purple-900"
                :disabled="updating === user.id"
              >
                {{ updating === user.id ? 'Updating...' : 'Make Admin' }}
              </button>
              <button
                v-if="user.role === 'ADMIN' && user.id !== currentUserId"
                @click="removeAdmin(user.id)"
                class="text-yellow-600 hover:text-yellow-900"
                :disabled="updating === user.id"
              >
                {{ updating === user.id ? 'Updating...' : 'Remove Admin' }}
              </button>
              <NuxtLink
                :to="`/admin/users/${user.id}`"
                class="text-blue-600 hover:text-blue-900"
              >
                View Details
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="!hasMore"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing page <span class="font-medium">{{ currentPage }}</span>
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="!hasMore"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
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
  title: 'User Management - Admin Dashboard',
  description: 'Manage all registered users'
})

// Get current user ID to prevent self-demotion
const { user } = useUserSession()
const currentUserId = computed(() => (user.value as any)?.id)

// Filters
const filters = ref({
  search: '',
  role: '',
  verified: ''
})

// Pagination
const currentPage = ref(1)
const pageSize = ref(20)
const hasMore = ref(true)

// Loading states
const verifying = ref<string | null>(null)
const updating = ref<string | null>(null)

// Build query params
const queryParams = computed(() => {
  const params: any = {
    page: currentPage.value,
    limit: pageSize.value
  }
  if (filters.value.search) params.search = filters.value.search
  if (filters.value.role) params.role = filters.value.role
  if (filters.value.verified) params.verified = filters.value.verified
  return params
})

// Fetch users
const { data: users, pending, error, refresh } = await useFetch('/api/admin/users', {
  query: queryParams,
  default: () => [],
  watch: [queryParams]
})

// Debounced search
let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    refresh()
  }, 500)
}

// Apply filters
const applyFilters = () => {
  currentPage.value = 1
  refresh()
}

// Reset filters
const resetFilters = () => {
  filters.value = {
    search: '',
    role: '',
    verified: ''
  }
  currentPage.value = 1
  refresh()
}

// Pagination
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (hasMore.value) {
    currentPage.value++
  }
}

// Watch users data to update hasMore
watch(users, (newUsers) => {
  hasMore.value = newUsers && newUsers.length === pageSize.value
})

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Verify user
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

// Make user admin
const makeAdmin = async (userId: string) => {
  if (!confirm('Are you sure you want to make this user an admin?')) return
  
  updating.value = userId
  try {
    await $fetch(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      body: { role: 'ADMIN' }
    })
    await refresh()
  } catch (error: any) {
    alert('Failed to update user role: ' + error.message)
  } finally {
    updating.value = null
  }
}

// Remove admin role
const removeAdmin = async (userId: string) => {
  if (!confirm('Are you sure you want to remove admin role from this user?')) return
  
  updating.value = userId
  try {
    await $fetch(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      body: { role: 'USER' }
    })
    await refresh()
  } catch (error: any) {
    alert('Failed to update user role: ' + error.message)
  } finally {
    updating.value = null
  }
}
</script>
