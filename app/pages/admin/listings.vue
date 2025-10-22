<template>
  <div class="p-4 md:p-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Listings</h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Track and manage all listings to boost your platform.
      </p>
    </div>

    <!-- Main Content Card -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <!-- Filters and Actions Bar -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- Search -->
          <div class="relative flex-1 max-w-md">
            <input 
              v-model="filters.search" 
              type="text" 
              placeholder="Search listings..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              @input="debouncedSearch"
            >
            <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Filters -->
          <div class="flex gap-3">
            <select 
              v-model="filters.status" 
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              @change="applyFilters"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            
            <select 
              v-model="filters.type" 
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              @change="applyFilters"
            >
              <option value="">All Types</option>
              <option value="item">Items</option>
              <option value="room_single">Single Room</option>
              <option value="room_shared">Shared Room</option>
            </select>

            <button 
              @click="resetFilters"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              title="Reset Filters"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <!-- Loading State -->
        <div v-if="pending" class="text-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">Loading listings...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-600 dark:text-red-400">Failed to load listings</p>
          <button @click="refresh" class="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400">
            Try again
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="!listings || listings.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No listings found</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters</p>
        </div>

        <!-- Table Content -->
        <table v-else class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Image
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Listing
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Owner
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Posted
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="listing in listings" 
              :key="listing.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <!-- Image -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="h-12 w-16 rounded overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img 
                    v-if="listing.media && listing.media.length > 0"
                    :src="listing.media[0].url" 
                    :alt="listing.title"
                    class="h-full w-full object-cover"
                  >
                  <div v-else class="h-full w-full flex items-center justify-center">
                    <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </td>

              <!-- Listing Title -->
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">
                  {{ listing.title }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <svg class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ listing.media?.length || 0 }} images
                </div>
              </td>

              <!-- Type -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {{ formatType(listing.type) }}
                </span>
              </td>

              <!-- Owner -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full overflow-hidden bg-blue-600 flex-shrink-0">
                    <img 
                      v-if="listing.owner?.profile?.avatarUrl"
                      :src="listing.owner.profile.avatarUrl"
                      :alt="listing.owner.profile?.displayName || 'User'"
                      class="h-full w-full object-cover"
                    >
                    <span v-else class="h-full w-full flex items-center justify-center text-white text-xs font-medium">
                      {{ (listing.owner?.profile?.displayName || listing.owner?.email || 'U').charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div class="ml-2">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ listing.owner?.profile?.displayName || 'Unknown' }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Price -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-gray-900 dark:text-white">
                  €{{ listing.price }}
                </div>
                <div v-if="listing.type.includes('room')" class="text-xs text-gray-500 dark:text-gray-400">
                  /month
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': listing.status === 'PENDING',
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': listing.status === 'APPROVED',
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': listing.status === 'REJECTED'
                  }"
                >
                  {{ listing.status }}
                </span>
              </td>

              <!-- Posted Date -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(listing.createdAt) }}
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink
                    :to="`/listings/${listing.id}`"
                    target="_blank"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="View"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </NuxtLink>
                  
                  <button
                    v-if="listing.status !== 'APPROVED'"
                    @click="approveListing(listing.id)"
                    :disabled="processing === listing.id"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                    title="Approve"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                  <button
                    v-if="listing.status !== 'REJECTED'"
                    @click="rejectListing(listing.id)"
                    :disabled="processing === listing.id"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                    title="Reject"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                  <button
                    @click="deleteListing(listing.id)"
                    :disabled="deleting === listing.id"
                    class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50"
                    title="Delete"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="listings && listings.length > 0" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Showing <span class="font-medium">{{ ((currentPage - 1) * pageSize) + 1 }}</span> to 
            <span class="font-medium">{{ Math.min(currentPage * pageSize, ((currentPage - 1) * pageSize) + listings.length) }}</span>
          </div>
          <div class="flex gap-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div class="flex items-center gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                class="px-3 py-1 border rounded"
                :class="page === currentPage 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="nextPage"
              :disabled="!hasMore"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Enforce admin access
definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

// Set page meta
useSeoMeta({
  title: 'Listings Moderation - Admin Dashboard',
  description: 'Review and moderate user listings'
})

// Filters
const filters = ref({
  status: 'PENDING', // Default to pending listings
  type: '',
  search: ''
})

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)

// Loading states
const processing = ref<string | null>(null)
const deleting = ref<string | null>(null)

// Build query params
const queryParams = computed(() => {
  const params: any = {
    page: currentPage.value,
    limit: pageSize.value
  }
  if (filters.value.status) params.status = filters.value.status
  if (filters.value.type) params.type = filters.value.type
  if (filters.value.search) params.search = filters.value.search
  return params
})

// Fetch listings
const { data: listings, pending, error, refresh } = await useFetch('/api/admin/listings', {
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
    status: '',
    type: '',
    search: ''
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

const goToPage = (page: number) => {
  currentPage.value = page
}

// Calculate visible page numbers for pagination
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 3
  
  if (currentPage.value <= 2) {
    for (let i = 1; i <= Math.min(maxVisible, currentPage.value + 1); i++) {
      pages.push(i)
    }
  } else {
    pages.push(currentPage.value - 1)
    pages.push(currentPage.value)
    if (hasMore.value) {
      pages.push(currentPage.value + 1)
    }
  }
  
  return pages
})

// Watch listings data to update hasMore
watch(listings, (newListings) => {
  hasMore.value = newListings && newListings.length === pageSize.value
})

// Format helpers
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatType = (type: string) => {
  const typeMap: Record<string, string> = {
    'item': 'Item',
    'room_single': 'Single Room',
    'room_shared': 'Shared Room'
  }
  return typeMap[type] || type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Moderation actions
const approveListing = async (listingId: string) => {
  if (!confirm('Are you sure you want to approve this listing?')) return
  
  processing.value = listingId
  try {
    await $fetch(`/api/admin/listings/${listingId}/approve`, {
      method: 'POST'
    })
    await refresh()
  } catch (error: any) {
    alert('Failed to approve listing: ' + error.message)
  } finally {
    processing.value = null
  }
}

const rejectListing = async (listingId: string) => {
  const reason = prompt('Reason for rejection (optional):')
  if (reason === null) return // User cancelled
  
  processing.value = listingId
  try {
    await $fetch(`/api/admin/listings/${listingId}/reject`, {
      method: 'POST',
      body: { reason }
    })
    await refresh()
  } catch (error: any) {
    alert('Failed to reject listing: ' + error.message)
  } finally {
    processing.value = null
  }
}

const deleteListing = async (listingId: string) => {
  if (!confirm('Are you sure you want to permanently delete this listing? This action cannot be undone.')) return
  
  deleting.value = listingId
  try {
    await $fetch(`/api/admin/listings/${listingId}`, {
      method: 'DELETE'
    })
    await refresh()
  } catch (error: any) {
    alert('Failed to delete listing: ' + error.message)
  } finally {
    deleting.value = null
  }
}
</script>
