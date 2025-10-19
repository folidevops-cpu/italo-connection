<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Browse Listings</h1>
        <p class="mt-2 text-gray-600">
          Find items for sale or rooms to rent
        </p>
      </div>
      <NuxtLink 
        to="/listings/create" 
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
        :class="{ 'opacity-50 pointer-events-none': !canCreateListings }"
      >
        Create Listing
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-white p-6 rounded-lg shadow mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select v-model="filters.type" class="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="">All Types</option>
            <option value="item">Items for Sale</option>
            <option value="room_single">Single Room</option>
            <option value="room_shared">Shared Room</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search listings..."
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
          <input
            v-model="filters.maxPrice"
            type="number"
            placeholder="Max price"
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading listings...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
      <p class="text-red-700">Failed to load listings: {{ error.data?.message || error.message }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!listings || listings.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No listings found</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating your first listing.</p>
      <div class="mt-6">
        <NuxtLink 
          to="/listings/create" 
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          :class="{ 'opacity-50 pointer-events-none': !canCreateListings }"
        >
          Create Listing
        </NuxtLink>
      </div>
    </div>

    <!-- Listings Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="listing in listings"
        :key="listing.id"
        class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
      >
        <!-- Image placeholder -->
        <div class="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg">
          <div class="flex items-center justify-center">
            <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <!-- Content -->
        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">
              {{ listing.title }}
            </h3>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="{
                'bg-green-100 text-green-800': listing.type === 'item',
                'bg-blue-100 text-blue-800': listing.type === 'room_single',
                'bg-purple-100 text-purple-800': listing.type === 'room_shared'
              }"
            >
              {{ formatListingType(listing.type) }}
            </span>
          </div>

          <p class="text-gray-600 text-sm mb-3 line-clamp-2">
            {{ listing.description }}
          </p>

          <div class="flex justify-between items-center">
            <span class="text-lg font-bold text-gray-900">
              €{{ listing.price }}
              <span v-if="listing.type.includes('room')" class="text-sm text-gray-500">/month</span>
            </span>
            <NuxtLink 
              :to="`/listings/${listing.id}`"
              class="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View Details
            </NuxtLink>
          </div>

          <div class="mt-3 flex items-center text-xs text-gray-500">
            <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ listing.location || 'Location not specified' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="listings && listings.length > 0" class="mt-12 flex justify-center">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button
          @click="currentPage--"
          :disabled="currentPage <= 1"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="currentPage++"
          :disabled="currentPage >= totalPages"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set page meta
useSeoMeta({
  title: 'Browse Listings - ItaloConnection',
  description: 'Find items for sale and rooms to rent on ItaloConnection marketplace'
})

// Get user session to check if user can create listings
const { user } = useUserSession()

// Check if user can create listings (email verified only)
const canCreateListings = computed(() => {
  if (!user.value) return false
  const userData = user.value as any
  return userData.emailVerified
})

// Filter state
const filters = ref({
  type: '',
  search: '',
  maxPrice: ''
})

// Pagination state
const currentPage = ref(1)
const pageSize = ref(9)

// ✅ Use useFetch for reactive listings data
const { data: listingsData, pending, error, refresh } = await useFetch('/api/listings', {
  query: computed(() => ({
    page: currentPage.value,
    limit: pageSize.value,
    type: filters.value.type || undefined,
    search: filters.value.search || undefined,
    maxPrice: filters.value.maxPrice || undefined
  })),
  default: () => ({ listings: [], total: 0, page: 1, totalPages: 1 })
})

// Computed properties
const listings = computed(() => listingsData.value.listings)
const totalPages = computed(() => listingsData.value.totalPages)

// Helper functions
const formatListingType = (type: string) => {
  switch (type) {
    case 'item': return 'Item'
    case 'room_single': return 'Single Room'
    case 'room_shared': return 'Shared Room'
    default: return type
  }
}

const resetFilters = () => {
  filters.value = {
    type: '',
    search: '',
    maxPrice: ''
  }
  currentPage.value = 1
}

// Watch filters to reset pagination
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })
</script>