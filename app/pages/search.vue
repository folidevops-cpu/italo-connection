<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Search Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Search Results</h1>
      <p class="mt-2 text-gray-600">
        {{ searchQuery ? `Results for "${searchQuery}"` : 'Enter a search query' }}
      </p>
    </div>

    <!-- Search Bar -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <form @submit.prevent="handleSearch" class="flex gap-4">
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
          class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Search
        </button>
      </form>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Searching...</p>
    </div>

    <div v-else>
      <!-- Listings Results -->
      <div v-if="listings.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Listings ({{ listings.length }})</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="listing in listings"
            :key="listing.id"
            class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
          >
            <NuxtLink :to="`/listings/${listing.id}`">
              <!-- Listing Image -->
              <div class="aspect-video bg-gray-200">
                <img
                  v-if="listing.media && listing.media.length > 0"
                  :src="listing.media[0].url"
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

                <div class="text-xl font-bold text-gray-900">
                  €{{ listing.price }}
                  <span v-if="listing.type.includes('room')" class="text-sm text-gray-500">/month</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Services Results -->
      <div v-if="services.length > 0">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Services ({{ services.length }})</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="service in services"
            :key="service.id"
            class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
          >
            <NuxtLink :to="`/services/${service.id}`">
              <!-- Service Image -->
              <div class="aspect-video bg-gray-200">
                <img
                  v-if="service.media && service.media.length > 0"
                  :src="service.media[0].url"
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
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
      <div v-if="listings.length === 0 && services.length === 0 && searchQuery" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No results found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search query</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Search - ItaloConnection',
  description: 'Search for listings and services'
})

// Use location formatter
const { formatLocation } = useLocationFormatter();

const route = useRoute()
const router = useRouter()

const searchQuery = ref(route.query.q as string || '')

// Fetch search results
const { data, pending, refresh } = await useFetch('/api/search', {
  query: computed(() => ({
    q: searchQuery.value
  })),
  default: () => ({ listings: [], services: [] }),
  watch: false
})

const listings = computed(() => data.value?.listings || [])
const services = computed(() => data.value?.services || [])

// Handle search
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      query: { q: searchQuery.value }
    })
    refresh()
  }
}

// Watch route query changes
watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    searchQuery.value = newQuery as string
    refresh()
  }
})

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
</script>
