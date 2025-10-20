<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <p class="mt-2 text-gray-600">
          View system activity and user actions
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
          <label class="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
          <select 
            v-model="filters.action" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          >
            <option value="">All Actions</option>
            <option value="user_created">User Created</option>
            <option value="user_verified">User Verified</option>
            <option value="listing_created">Listing Created</option>
            <option value="listing_approved">Listing Approved</option>
            <option value="listing_rejected">Listing Rejected</option>
            <option value="listing_deleted">Listing Deleted</option>
            <option value="user_role_changed">Role Changed</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">User ID</label>
          <input 
            v-model="filters.userId" 
            type="text" 
            placeholder="User ID..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="debouncedSearch"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <select 
            v-model="filters.dateRange" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
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

    <!-- Logs Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div v-if="pending" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading logs...</p>
      </div>

      <div v-else-if="error" class="text-center py-12 text-red-600">
        <p>Failed to load logs</p>
        <button @click="refresh" class="mt-4 text-blue-600 hover:text-blue-700">
          Try again
        </button>
      </div>

      <div v-else-if="!logs || logs.length === 0" class="text-center py-12 text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="mt-2">No audit logs found</p>
      </div>

      <div v-else>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatTimestamp(log.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getActionColor(log.action)"
                >
                  {{ formatAction(log.action) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="log.user" class="text-sm">
                  <div class="font-medium text-gray-900">
                    {{ log.user.profile?.displayName || 'No name' }}
                  </div>
                  <div class="text-gray-500">{{ log.user.email }}</div>
                </div>
                <div v-else class="text-sm text-gray-400">System</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                <button 
                  v-if="log.meta"
                  @click="selectedLog = log"
                  class="text-blue-600 hover:text-blue-700"
                >
                  View Details
                </button>
                <span v-else class="text-gray-400">No details</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="logs && logs.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
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

    <!-- Log Details Modal -->
    <div v-if="selectedLog" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50" @click="selectedLog = null">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6" @click.stop>
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-medium text-gray-900">Log Details</h3>
          <button @click="selectedLog = null" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-3">
          <div>
            <span class="text-sm font-medium text-gray-500">Action:</span>
            <span class="ml-2 text-sm text-gray-900">{{ formatAction(selectedLog.action) }}</span>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-500">Timestamp:</span>
            <span class="ml-2 text-sm text-gray-900">{{ formatTimestamp(selectedLog.createdAt) }}</span>
          </div>
          <div v-if="selectedLog.user">
            <span class="text-sm font-medium text-gray-500">User:</span>
            <span class="ml-2 text-sm text-gray-900">
              {{ selectedLog.user.profile?.displayName || 'No name' }} ({{ selectedLog.user.email }})
            </span>
          </div>
          <div v-if="selectedLog.meta">
            <span class="text-sm font-medium text-gray-500">Metadata:</span>
            <pre class="mt-2 text-xs bg-gray-50 p-3 rounded-md overflow-auto max-h-96">{{ JSON.stringify(selectedLog.meta, null, 2) }}</pre>
          </div>
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
  title: 'Audit Logs - Admin Dashboard',
  description: 'View system activity and user actions'
})

// Filters
const filters = ref({
  action: '',
  userId: '',
  dateRange: ''
})

// Pagination
const currentPage = ref(1)
const pageSize = ref(50)
const hasMore = ref(true)

// Selected log for details modal
const selectedLog = ref<any>(null)

// Build query params
const queryParams = computed(() => {
  const params: any = {
    page: currentPage.value,
    limit: pageSize.value
  }
  if (filters.value.action) params.action = filters.value.action
  if (filters.value.userId) params.userId = filters.value.userId
  if (filters.value.dateRange) params.dateRange = filters.value.dateRange
  return params
})

// Fetch logs
const { data: logs, pending, error, refresh } = await useFetch('/api/admin/logs', {
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
    action: '',
    userId: '',
    dateRange: ''
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

// Watch logs data to update hasMore
watch(logs, (newLogs) => {
  hasMore.value = newLogs && newLogs.length === pageSize.value
})

// Format helpers
const formatTimestamp = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const formatAction = (action: string) => {
  return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getActionColor = (action: string) => {
  if (action.includes('created')) return 'bg-blue-100 text-blue-800'
  if (action.includes('approved') || action.includes('verified')) return 'bg-green-100 text-green-800'
  if (action.includes('rejected') || action.includes('deleted')) return 'bg-red-100 text-red-800'
  if (action.includes('updated') || action.includes('changed')) return 'bg-yellow-100 text-yellow-800'
  return 'bg-gray-100 text-gray-800'
}
</script>
