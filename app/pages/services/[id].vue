<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Loading State -->
    <div v-if="pending" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading service...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <p class="text-red-700">{{ error.data?.message || 'Failed to load service' }}</p>
      <NuxtLink to="/services" class="text-blue-600 hover:underline mt-2 inline-block">
        Back to services
      </NuxtLink>
    </div>

    <!-- Service Detail -->
    <div v-else-if="service">
      <!-- Back Button -->
      <div class="mb-6">
        <NuxtLink 
          to="/services" 
          class="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to services
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Images and Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Image Gallery -->
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div v-if="service.media && service.media.length > 0">
              <!-- Main Image -->
              <div class="aspect-video bg-gray-200">
                <img
                  :src="currentImage.url"
                  :alt="service.name"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Thumbnail Gallery -->
              <div v-if="service.media.length > 1" class="p-4 bg-gray-50">
                <div class="grid grid-cols-4 gap-2">
                  <button
                    v-for="(image, index) in service.media"
                    :key="image.id"
                    @click="currentImageIndex = index"
                    class="aspect-square rounded overflow-hidden border-2 transition-all"
                    :class="currentImageIndex === index ? 'border-blue-500' : 'border-transparent hover:border-gray-300'"
                  >
                    <img
                      :src="image.url"
                      :alt="`Image ${index + 1}`"
                      class="w-full h-full object-cover"
                    />
                  </button>
                </div>
              </div>
            </div>

            <!-- No Images Placeholder -->
            <div v-else class="aspect-video bg-gray-200 flex items-center justify-center">
              <svg class="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">About This Service</h2>
            <p class="text-gray-700 whitespace-pre-line">{{ service.description }}</p>
          </div>

          <!-- Location -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Location</h2>
            <div class="flex items-center text-gray-700">
              <svg class="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ service.location }}
            </div>
          </div>
        </div>

        <!-- Right Column - Pricing and Contact -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6 sticky top-6 space-y-6">
            <!-- Title and Category -->
            <div>
              <div class="flex items-start justify-between mb-2">
                <h1 class="text-2xl font-bold text-gray-900 flex-1">{{ service.name }}</h1>
              </div>
              <span 
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {{ service.serviceType.name }}
              </span>
              <div class="flex items-center text-sm text-gray-500 mt-2">
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Posted {{ formatDate(service.createdAt) }}
              </div>
            </div>

            <!-- Price -->
            <div class="border-t border-b border-gray-200 py-4">
              <div class="text-3xl font-bold text-gray-900">
                €{{ service.price }}
              </div>
            </div>

            <!-- Service Provider Info -->
            <div v-if="service.owner">
              <h3 class="text-sm font-medium text-gray-900 mb-3">Service Provider</h3>
              <NuxtLink 
                v-if="service.owner.profile?.displayName"
                :to="`/users/${service.owner.profile.displayName}`"
                class="flex items-center hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
              >
                <div 
                  v-if="service.owner.profile?.avatarUrl"
                  class="h-12 w-12 rounded-full overflow-hidden mr-3"
                >
                  <img
                    :src="service.owner.profile.avatarUrl"
                    :alt="service.owner.profile?.displayName || 'User'"
                    class="h-full w-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center mr-3"
                >
                  <span class="text-white text-lg font-medium">
                    {{ (service.owner.profile?.displayName || service.owner.email).charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-blue-600 hover:text-blue-700">
                    {{ service.owner.profile?.displayName || 'User' }}
                  </p>
                  <p class="text-xs text-gray-500">
                    Member since {{ formatDate(service.owner.createdAt) }}
                  </p>
                </div>
              </NuxtLink>
            </div>

            <!-- Contact Button -->
            <div v-if="!isOwner">
              <button
            
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <NuxtLink :to="`/users/${service.owner.profile.displayName}`">
                Contact Provider
                </NuxtLink>
              </button>
              <p class="text-xs text-gray-500 text-center mt-2">
                Response time: Usually within 24 hours
              </p>
            </div>

            <!-- Owner Actions -->
            <div v-else class="space-y-2">
              <button
                @click="deleteService"
                class="w-full inline-flex justify-center items-center bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Service
              </button>
            </div>

            <!-- Status Badge -->
            <div class="pt-4 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Status</span>
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-yellow-100 text-yellow-800': service.status === 'PENDING',
                    'bg-green-100 text-green-800': service.status === 'APPROVED',
                    'bg-red-100 text-red-800': service.status === 'REJECTED'
                  }"
                >
                  {{ service.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Service Detail - ItaloConnection'
})

// Get service ID from route
const route = useRoute()
const serviceId = route.params.id as string

// Get current user
const { user } = useUserSession()

// Fetch service data
const { data: service, pending, error } = await useFetch(`/api/services/${serviceId}`)

// Image gallery state
const currentImageIndex = ref(0)
const currentImage = computed(() => {
  if (service.value?.media && service.value.media.length > 0) {
    return service.value.media[currentImageIndex.value]
  }
  return null
})

// Check if current user is the owner
const isOwner = computed(() => {
  if (!user.value || !service.value) return false
  return (user.value as any).id === service.value.ownerId
})

// Delete functionality
const deleteService = async () => {
  if (!service.value) return

  if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
    return
  }

  try {
    await $fetch(`/api/services/${service.value.id}`, {
      method: 'DELETE'
    })

    await navigateTo('/services', { replace: true })
  } catch (error: any) {
    alert(error.data?.statusMessage || 'Failed to delete service. Please try again.')
  }
}

// Contact provider
// const contactProvider = () => {
//   alert('Messaging feature coming soon! For now, contact the provider through their profile.')
// }

// Helper function
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Update page title with service name
watchEffect(() => {
  if (service.value) {
    useSeoMeta({
      title: `${service.value.name} - ItaloConnection`,
      description: service.value.description.substring(0, 160)
    })
  }
})
</script>
