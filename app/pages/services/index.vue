<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Services</h1>
      <p class="mt-2 text-gray-600">
        Find and connect with service providers in your community
      </p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Service Type Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Service Type
          </label>
          <select
            v-model="filters.serviceType"
            @change="fetchServices"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Services</option>
            <option v-for="type in serviceTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>
        </div>

        <!-- Search -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            v-model="filters.search"
            @input="debouncedSearch"
            type="text"
            placeholder="Search services by name, description, or location..."
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading services...</p>
    </div>

    <!-- Services Grid -->
    <div v-else-if="services && services.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                {{ service.serviceType.name }}
              </span>
            </div>

            <h3 class="text-lg font-semibold text-gray-900 mb-1">
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
              {{ service.location }}
            </div>

            <div class="flex items-center justify-between">
              <div class="text-xl font-bold text-gray-900">
                €{{ service.price }}
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <img
                  v-if="service.owner.profile?.avatarUrl"
                  :src="service.owner.profile.avatarUrl"
                  :alt="service.owner.profile.displayName"
                  class="w-6 h-6 rounded-full mr-1"
                />
                <div v-else class="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mr-1">
                  <span class="text-white text-xs">
                    {{ (service.owner.profile?.displayName || 'U').charAt(0).toUpperCase() }}
                  </span>
                </div>
                {{ service.owner.profile?.displayName || 'User' }}
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No services found</h3>
      <p class="mt-1 text-sm text-gray-500">Try adjusting your filters</p>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.pages > 1" class="mt-8 flex justify-center">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button
          @click="goToPage(pagination.page - 1)"
          :disabled="pagination.page === 1"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          v-for="page in pagination.pages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            page === pagination.page
              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
            'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="goToPage(pagination.page + 1)"
          :disabled="pagination.page === pagination.pages"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Services - ItaloConnection',
  description: 'Find and connect with service providers in your community'
})

const filters = ref({
  serviceType: 'all',
  search: '',
  page: 1
})

// Fetch service types
const { data: typesData } = await useFetch('/api/service-types')
const serviceTypes = computed(() => typesData.value?.serviceTypes || [])

// Fetch services
const { data, pending, refresh } = await useFetch('/api/services', {
  query: filters,
  watch: false
})

const services = computed(() => data.value?.services || [])
const pagination = computed(() => data.value?.pagination)

const fetchServices = () => {
  filters.value.page = 1
  refresh()
}

// Debounced search
let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchServices()
  }, 500)
}

const goToPage = (page: number) => {
  filters.value.page = page
  refresh()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
