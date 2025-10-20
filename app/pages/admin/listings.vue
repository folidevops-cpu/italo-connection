<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Listings Moderation</h1>
        <p class="mt-2 text-gray-600">
          Review and moderate user listings
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
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select 
            v-model="filters.status" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select 
            v-model="filters.type" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          >
            <option value="">All Types</option>
            <option value="SALE">For Sale</option>
            <option value="SINGLE_ROOM">Single Room</option>
            <option value="SHARED_ROOM">Shared Room</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input 
            v-model="filters.search" 
            type="text" 
            placeholder="Title or owner..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="debouncedSearch"
          >
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

    <!-- Listings Grid -->
    <div v-if="pending" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading listings...</p>
    </div>

    <div v-else-if="error" class="text-center py-12 text-red-600">
      <p>Failed to load listings</p>
      <button @click="refresh" class="mt-4 text-blue-600 hover:text-blue-700">
        Try again
      </button>
    </div>

    <div v-else-if="!listings || listings.length === 0" class="bg-white shadow rounded-lg p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No listings found</h3>
      <p class="mt-1 text-sm text-gray-500">Try adjusting your filters</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-6">
      <div 
        v-for="listing in listings" 
        :key="listing.id"
        class="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="md:flex">
          <!-- Image -->
          <div class="md:w-1/3">
            <img 
              v-if="listing.media && listing.media.length > 0"
              :src="listing.media[0].url" 
              :alt="listing.title"
              class="w-full h-64 object-cover"
            >
            <div v-else class="w-full h-64 bg-gray-200 flex items-center justify-center">
              <svg class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="md:w-2/3 p-6">
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <span 
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    :class="{
                      'bg-yellow-100 text-yellow-800': listing.status === 'PENDING',
                      'bg-green-100 text-green-800': listing.status === 'APPROVED',
                      'bg-red-100 text-red-800': listing.status === 'REJECTED'
                    }"
                  >
                    {{ listing.status }}
                  </span>
                  <span class="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                    {{ formatType(listing.type) }}
                  </span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">{{ listing.title }}</h3>
                <p class="text-gray-600 mb-2 line-clamp-2">{{ listing.description }}</p>
                <p class="text-2xl font-bold text-blue-600">€{{ listing.price }}</p>
              </div>
            </div>

            <!-- Owner Info -->
            <div class="border-t pt-4 mb-4">
              <p class="text-sm text-gray-500">
                <span class="font-medium">Owner:</span> {{ listing.owner?.profile?.displayName || listing.owner?.email || 'Unknown' }}
              </p>
              <p class="text-sm text-gray-500">
                <span class="font-medium">Posted:</span> {{ formatDate(listing.createdAt) }}
              </p>
              <p class="text-sm text-gray-500">
                <span class="font-medium">Images:</span> {{ listing.media?.length || 0 }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex space-x-3">
              <NuxtLink
                :to="`/listings/${listing.id}`"
                target="_blank"
                class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium text-center"
              >
                View Details
              </NuxtLink>
              <button
                v-if="listing.status !== 'APPROVED'"
                @click="approveListing(listing.id)"
                :disabled="processing === listing.id"
                class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium disabled:opacity-50"
              >
                {{ processing === listing.id ? 'Approving...' : 'Approve' }}
              </button>
              <button
                v-if="listing.status !== 'REJECTED'"
                @click="rejectListing(listing.id)"
                :disabled="processing === listing.id"
                class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium disabled:opacity-50"
              >
                {{ processing === listing.id ? 'Rejecting...' : 'Reject' }}
              </button>
              <button
                @click="deleteListing(listing.id)"
                :disabled="deleting === listing.id"
                class="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-md font-medium disabled:opacity-50"
              >
                {{ deleting === listing.id ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="listings && listings.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
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
  return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
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
