<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Search Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Search Results</h1>
      <p class="mt-2 text-gray-600">
        {{ searchQuery ? `Results for "${searchQuery}"` : 'Enter a search query' }}
      </p>
    </div>

    <!-- Search Form -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <form @submit.prevent="performSearch" class="space-y-4">
        <!-- Main Search Bar -->
        <div class="flex gap-2">
          <div class="relative flex-1">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search for items, rooms, or services..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg 
              class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button 
            type="submit"
            :disabled="loading"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Searching...' : 'Search' }}
          </button>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap gap-4">
          <!-- Type Filter -->
          <select
            v-model="filters.type"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            @change="performSearch"
          >
            <option value="all">All Types</option>
            <option value="listings">Listings Only</option>
            <option value="services">Services Only</option>
          </select>

          <!-- Price Range -->
          <input
            v-model.number="filters.minPrice"
            type="number"
            placeholder="Min Price (€)"
            min="0"
            step="0.01"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-32"
          />
          <input
            v-model.number="filters.maxPrice"
            type="number"
            placeholder="Max Price (€)"
            min="0"
            step="0.01"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-32"
          />

          <!-- Location Filter (for services) -->
          <input
            v-model="filters.location"
            type="text"
            placeholder="Location"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 flex-1 min-w-[200px]"
          />

          <!-- Clear Filters Button -->
          <button
            type="button"
            @click="clearFilters"
            class="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </form>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Searching...</p>
    </div>

    <!-- Results -->
    <div v-else-if="results">
      <!-- Results Summary -->
      <div class="mb-6 text-gray-600">
        Found <span class="font-semibold text-gray-900">{{ results.counts.total }}</span> result{{ results.counts.total !== 1 ? 's' : '' }} for 
        "<span class="font-semibold text-gray-900">{{ searchQuery }}</span>"
        <span v-if="results.counts.listings > 0" class="ml-2">
          • {{ results.counts.listings }} listing{{ results.counts.listings !== 1 ? 's' : '' }}
        </span>
        <span v-if="results.counts.services > 0" class="ml-2">
          • {{ results.counts.services }} service{{ results.counts.services !== 1 ? 's' : '' }}
        </span>
      </div>
      <!-- Listings Results -->
      <div v-if="results.results.listings.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Listings ({{ results.counts.listings }})</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="listing in results.results.listings"
            :key="listing.id"
            class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
          >
            <NuxtLink :to="`/listings/${listing.id}`">
              <!-- Listing Image -->
              <div class="aspect-video bg-gray-200">
                <img
                  v-if="listing.imageUrl"
                  :src="listing.imageUrl"
                  :alt="listing.title"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <!-- Listing Info -->
              <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                    {{ listing.title }}
                  </h3>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2"
                    :class="{
                      'bg-green-100 text-green-800': listing.type === 'item',
                      'bg-blue-100 text-blue-800': listing.type === 'room_single',
                      'bg-purple-100 text-purple-800': listing.type === 'room_shared',
                    }"
                  >
                    {{ formatListingType(listing.type) }}
                  </span>
                </div>

                <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                  {{ listing.description }}
                </p>

                <div class="flex items-center justify-between">
                  <span class="text-xl font-bold text-gray-900">
                    €{{ listing.price }}
                    <span v-if="listing.type.includes('room')" class="text-sm text-gray-500">/month</span>
                  </span>
                  <span class="text-xs text-gray-500">
                    {{ listing.owner.town || 'Location' }}
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Services Results -->
      <div v-if="results.results.services.length > 0">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Services ({{ results.counts.services }})</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="service in results.results.services"
            :key="service.id"
            class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
          >
            <NuxtLink :to="`/services/${service.id}`">
              <!-- Service Image -->
              <div class="aspect-video bg-gray-200">
                <img
                  v-if="service.imageUrl"
                  :src="service.imageUrl"
                  :alt="service.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <!-- Service Info -->
              <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {{ service.serviceType?.name || 'Service' }}
                  </span>
                </div>

                <h3 class="text-lg font-semibold text-gray-900 mb-1 truncate">
                  {{ service.name }}
                </h3>

                <p class="text-sm text-gray-600 line-clamp-2 mb-3">
                  {{ service.description }}
                </p>

                <div class="flex items-center text-sm text-gray-500 mb-2">
                  <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ formatLocation(service.location) }}
                </div>

                <div class="text-xl font-bold text-gray-900">
                  €{{ service.price }}
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-if="results.counts.total === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No results found</h3>
        <p class="mt-1 text-sm text-gray-500">
          Try adjusting your search or filters
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: undefined
})

useSeoMeta({
  title: 'Search - ItaloConnection',
  description: 'Search for items, rooms, and services'
})

// Use location formatter
const { formatLocation } = useLocationFormatter()

const route = useRoute()
const router = useRouter()

const searchQuery = ref((route.query.q as string) || '')
const loading = ref(false)
const results = ref<any>(null)

const filters = ref({
  type: 'all',
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  location: ''
})

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    return
  }

  loading.value = true

  try {
    const response = await $fetch('/api/search', {
      method: 'POST',
      body: {
        query: searchQuery.value,
        type: filters.value.type,
        minPrice: filters.value.minPrice,
        maxPrice: filters.value.maxPrice,
        location: filters.value.location
      }
    })

    results.value = response

    // Update URL
    router.push({
      query: {
        q: searchQuery.value,
        ...(filters.value.type !== 'all' && { type: filters.value.type }),
        ...(filters.value.minPrice && { minPrice: filters.value.minPrice.toString() }),
        ...(filters.value.maxPrice && { maxPrice: filters.value.maxPrice.toString() }),
        ...(filters.value.location && { location: filters.value.location })
      }
    })
  } catch (error) {
    console.error('Search error:', error)
    results.value = {
      query: searchQuery.value,
      results: { listings: [], services: [] },
      counts: { listings: 0, services: 0, total: 0 }
    }
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  filters.value = {
    type: 'all',
    minPrice: undefined,
    maxPrice: undefined,
    location: ''
  }
  performSearch()
}

// Format listing type
const formatListingType = (type: string) => {
  switch (type) {
    case 'item':
      return 'Item'
    case 'room_single':
      return 'Single Room'
    case 'room_shared':
      return 'Shared Room'
    default:
      return type
  }
}

// Search on mount if query exists
onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q as string
    if (route.query.type) filters.value.type = route.query.type as string
    if (route.query.minPrice) filters.value.minPrice = parseFloat(route.query.minPrice as string)
    if (route.query.maxPrice) filters.value.maxPrice = parseFloat(route.query.maxPrice as string)
    if (route.query.location) filters.value.location = route.query.location as string
    
    performSearch()
  }
})
</script>
