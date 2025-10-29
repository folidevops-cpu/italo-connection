<template>
  <div>
    <!-- Hero section -->
    <section class="bg-blue-600 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          Welcome to ItaloConnection
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-blue-100">
          Your marketplace for buying, selling, and finding rooms to rent
        </p>
        
        <!-- Search Form -->
        <div class="max-w-3xl mx-auto mb-8">
          <form @submit.prevent="handleSearch" class="flex gap-2">
            <div class="relative flex-1">

              <InputsTextField
                v-model="searchQuery"
                type="text" 
                placeholder="Search for items, rooms, or services..."
                />

      
              <svg 
                class="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              type="submit"
              class="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        <div class="space-x-4">
          <NuxtLink 
            to="/listings" 
            class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse Listings
          </NuxtLink>
          <NuxtLink 
            to="/register" 
            class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Get Started
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Latest Services Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Latest Services</h2>
            <p class="mt-2 text-gray-600">
              {{ userLocation ? 'Services near you' : 'Recently added services' }}
            </p>
          </div>
          <NuxtLink 
            to="/services" 
            class="text-blue-600 hover:text-blue-700 font-medium"
          >
            View all →
          </NuxtLink>
        </div>

        <!-- Loading State -->
        <div v-if="servicesPending" class="text-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>

        <!-- Services Grid -->
        <div v-else-if="latestServices.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="service in latestServices"
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

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <p class="text-gray-500">No services available yet</p>
        </div>
      </div>
    </section>

    <!-- Latest Listings Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Latest Listings</h2>
            <p class="mt-2 text-gray-600">
              {{ userLocation ? 'Listings near you' : 'Recently added listings' }}
            </p>
          </div>
          <NuxtLink 
            to="/listings" 
            class="text-blue-600 hover:text-blue-700 font-medium"
          >
            View all →
          </NuxtLink>
        </div>

        <!-- Loading State -->
        <div v-if="listingsPending" class="text-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>

        <!-- Listings Grid -->
        <div v-else-if="latestListings.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="listing in latestListings"
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
                  <h3 class="text-lg font-semibold text-gray-900 line-clamp-1 flex-1">
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

                <div class="flex items-center text-sm text-gray-500 mb-2">
                  <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ listing.owner?.profile?.town || 'Location' }}
                </div>

                <div class="text-xl font-bold text-gray-900">
                  €{{ listing.price }}
                  <span v-if="listing.type.includes('room')" class="text-sm text-gray-500">/month</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <p class="text-gray-500">No listings available yet</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Homepage - uses default layout with navbar
definePageMeta({
  layout: 'default'
})

// SEO meta tags
useSeoMeta({
  title: 'ItaloConnection - Marketplace for Items and Rooms',
  ogDescription: 'Buy, sell items and find rooms to rent in your area. Safe, verified marketplace platform.',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image'
})

// Use location formatter
const { formatLocation } = useLocationFormatter();

// Search functionality
const searchQuery = ref('')
const router = useRouter()

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Navigate to search results page (we'll search both listings and services)
    router.push({
      path: '/search',
      query: { q: searchQuery.value }
    })
  }
}

// Geolocation
const userLocation = ref<{ latitude: number; longitude: number } | null>(null)

// Fetch latest services with reactive location
const servicesQuery = computed(() => {
  const query: any = {
    page: 1,
    limit: 4,
    status: 'APPROVED'
  }
  
  if (userLocation.value) {
    query.userLat = userLocation.value.latitude
    query.userLon = userLocation.value.longitude
  }
  
  return query
})

const { data: servicesData, pending: servicesPending, refresh: refreshServices } = await useFetch('/api/services', {
  query: servicesQuery,
  default: () => ({ services: [] })
})

const latestServices = computed(() => servicesData.value?.services || [])

// Fetch latest listings with reactive location
const listingsQuery = computed(() => {
  const query: any = {
    page: 1,
    limit: 4
  }
  
  if (userLocation.value) {
    query.userLat = userLocation.value.latitude
    query.userLon = userLocation.value.longitude
  }
  
  return query
})

const { data: listingsData, pending: listingsPending, refresh: refreshListings } = await useFetch('/api/listings', {
  query: listingsQuery,
  default: () => ({ listings: [] })
})

const latestListings = computed(() => listingsData.value?.listings || [])

onMounted(() => {
  // Try to get user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        // Refresh data with new location
        refreshServices()
        refreshListings()
      },
      (error) => {
        console.log('Geolocation not available:', error.message)
        // Continue without location - will show latest items instead
      }
    )
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