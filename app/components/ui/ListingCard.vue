<template>
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
</template>

<script setup lang="ts">
// Use i18n for translations
const { t } = useI18n()

// Define props
defineProps<{
  listing: any
}>()

// Format listing type
const formatListingType = (type: string) => {
  const key = `listing.type.${type}` as const
  return t(key)
}
</script>