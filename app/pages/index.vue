<template>
  <div>
    <!-- Hero section -->
    <section class="bg-blue-600 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          {{ $t('hero.title') }}
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-blue-100">
          {{ $t('hero.subtitle') }}
        </p>
        
        <!-- Search Form -->
        <div class="max-w-3xl mx-auto mb-8">
          <form @submit.prevent="handleSearch" class="flex gap-2">
            <div class="relative flex-1">

              <InputsTextField
                v-model="searchQuery"
                type="text" 
                :placeholder="$t('hero.searchPlaceholder')"
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
              {{ $t('hero.searchButton') }}
            </button>
          </form>
        </div>

        <div class="space-x-4">
          <NuxtLink 
            to="/listings" 
            class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {{ $t('hero.browseListings') }}
          </NuxtLink>
          <NuxtLink 
            to="/register" 
            class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            {{ $t('hero.getStarted') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Latest Services Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">{{ $t('home.latestServices') }}</h2>
            <p class="mt-2 text-gray-600">
              {{ userLocation ? $t('home.servicesNearYou') : $t('home.recentlyAddedServices') }}
            </p>
          </div>
          <NuxtLink 
            to="/services" 
            class="text-blue-600 hover:text-blue-700 font-medium"
          >
            {{ $t('home.viewAll') }} →
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
            <UiServiceCard :service="service" />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <p class="text-gray-500">{{ $t('home.noServices') }}</p>
        </div>
      </div>
    </section>

    <!-- Latest Listings Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">{{ $t('home.latestListings') }}</h2>
            <p class="mt-2 text-gray-600">
              {{ userLocation ? $t('home.listingsNearYou') : $t('home.recentlyAddedListings') }}
            </p>
          </div>
          <NuxtLink 
            to="/listings" 
            class="text-blue-600 hover:text-blue-700 font-medium"
          >
            {{ $t('home.viewAll') }} →
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
           <UiListingCard :listing="listing" />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <p class="text-gray-500">{{ $t('home.noListings') }}</p>
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
  // Automatically request location when page loads
  if (navigator.geolocation) {
    console.log('Requesting geolocation...')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Geolocation granted:', position.coords)
        userLocation.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        // Refresh data with new location
        refreshServices()
        refreshListings()
      },
      (error) => {
        console.log('Geolocation error:', error.message, error.code)
        // Continue without location - will show latest items instead
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }
})

// Use i18n for translations
const { t } = useI18n()

// Format listing type
const formatListingType = (type: string) => {
  const key = `listing.type.${type}` as const
  return t(key)
}
</script>