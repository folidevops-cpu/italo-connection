<template>
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
</template>

<script setup lang="ts">
// Use location formatter
const { formatLocation } = useLocationFormatter()

// Define props
defineProps<{
  service: any
}>()
</script>
