<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Loading State -->
    <div v-if="pending" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading listing...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <p class="text-red-700">{{ error.data?.message || 'Failed to load listing' }}</p>
      <NuxtLink to="/listings" class="text-blue-600 hover:underline mt-2 inline-block">
        Back to listings
      </NuxtLink>
    </div>

    <!-- Listing Detail -->
    <div v-else-if="listing">
      <!-- Back Button -->
      <div class="mb-6">
        <NuxtLink 
          to="/listings" 
          class="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to listings
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Images and Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Image Gallery -->
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div v-if="listing.media && listing.media.length > 0">
              <!-- Main Image -->
              <div class="aspect-video bg-gray-200">
                <img
                  :src="currentImage.url"
                  :alt="listing.title"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Thumbnail Gallery -->
              <div v-if="listing.media.length > 1" class="p-4 bg-gray-50">
                <div class="grid grid-cols-4 gap-2">
                  <button
                    v-for="(image, index) in listing.media"
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p class="text-gray-700 whitespace-pre-line">{{ listing.description }}</p>
          </div>

          <!-- Room Details -->
          <div v-if="listing.type.includes('room')" class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Room Details</h2>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-if="listing.availableFrom">
                <dt class="text-sm font-medium text-gray-500">Available From</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(listing.availableFrom) }}</dd>
              </div>
              <div v-if="listing.capacity">
                <dt class="text-sm font-medium text-gray-500">Total Capacity</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ listing.capacity }} people</dd>
              </div>
              <div v-if="listing.sharedSlots">
                <dt class="text-sm font-medium text-gray-500">Available Slots</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ listing.sharedSlots }} slots</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Right Column - Pricing and Contact -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6 sticky top-6 space-y-6">
            <!-- Title and Type -->
            <div>
              <div class="flex items-start justify-between mb-2">
                <h1 class="text-2xl font-bold text-gray-900 flex-1">{{ listing.title }}</h1>
                <span 
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ml-2"
                  :class="{
                    'bg-green-100 text-green-800': listing.type === 'item',
                    'bg-blue-100 text-blue-800': listing.type === 'room_single',
                    'bg-purple-100 text-purple-800': listing.type === 'room_shared'
                  }"
                >
                  {{ formatListingType(listing.type) }}
                </span>
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Posted {{ formatDate(listing.createdAt) }}
              </div>
            </div>

            <!-- Price -->
            <div class="border-t border-b border-gray-200 py-4">
              <div class="text-3xl font-bold text-gray-900">
                €{{ listing.price }}
                <span v-if="listing.type.includes('room')" class="text-lg text-gray-500 font-normal">/month</span>
              </div>
            </div>

            <!-- Seller Info -->
            <div v-if="listing.owner">
              <h3 class="text-sm font-medium text-gray-900 mb-3">Listed by</h3>
              <div class="flex items-center">
                <div 
                  v-if="listing.owner.profile?.avatarUrl"
                  class="h-12 w-12 rounded-full overflow-hidden mr-3"
                >
                  <img
                    :src="listing.owner.profile.avatarUrl"
                    :alt="listing.owner.profile?.displayName || 'User'"
                    class="h-full w-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center mr-3"
                >
                  <span class="text-white text-lg font-medium">
                    {{ (listing.owner.profile?.displayName || listing.owner.email).charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ listing.owner.profile?.displayName || 'User' }}
                  </p>
                  <p class="text-xs text-gray-500">
                    Member since {{ formatDate(listing.owner.createdAt) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Contact Button -->
            <div v-if="!isOwner">
              <button
                @click="contactSeller"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Contact Seller
              </button>
              <p class="text-xs text-gray-500 text-center mt-2">
                Response time: Usually within 24 hours
              </p>
            </div>

            <!-- Owner Actions -->
            <div v-else class="space-y-2">
              <NuxtLink
                :to="`/listings/edit/${listing.id}`"
                class="w-full inline-flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Listing
              </NuxtLink>
              <button
                @click="showDeleteConfirm = true"
                class="w-full inline-flex justify-center items-center bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Listing
              </button>
            </div>

            <!-- Status Badge -->
            <div class="pt-4 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Status</span>
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-yellow-100 text-yellow-800': listing.status === 'PENDING',
                    'bg-green-100 text-green-800': listing.status === 'APPROVED',
                    'bg-red-100 text-red-800': listing.status === 'REJECTED'
                  }"
                >
                  {{ listing.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteConfirm" class="fixed z-50 inset-0 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showDeleteConfirm = false"></div>
          
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Delete Listing
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to delete this listing? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                @click="deleteListing"
                :disabled="deleting"
                type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {{ deleting ? 'Deleting...' : 'Delete' }}
              </button>
              <button
                @click="showDeleteConfirm = false"
                :disabled="deleting"
                type="button"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Listing Detail - ItaloConnection'
})

// Get listing ID from route
const route = useRoute()
const listingId = route.params.id as string

// Get current user
const { user } = useUserSession()

// Fetch listing data
const { data: listing, pending, error } = await useFetch(`/api/listings/${listingId}`, {
  // Don't require auth for viewing public listings
  headers: user.value ? {} : {}
})

// Image gallery state
const currentImageIndex = ref(0)
const currentImage = computed(() => {
  if (listing.value?.media && listing.value.media.length > 0) {
    return listing.value.media[currentImageIndex.value]
  }
  return null
})

// Check if current user is the owner
const isOwner = computed(() => {
  if (!user.value || !listing.value) return false
  return (user.value as any).id === listing.value.ownerId
})

// Delete functionality
const showDeleteConfirm = ref(false)
const deleting = ref(false)

const deleteListing = async () => {
  if (!listing.value) return

  deleting.value = true

  try {
    await $fetch(`/api/listings/${listing.value.id}`, {
      method: 'DELETE'
    })

    // Redirect to user's listings
    navigateTo('/listings/my')
  } catch (error: any) {
    console.error('Failed to delete listing:', error)
    alert('Failed to delete listing. Please try again.')
  } finally {
    deleting.value = false
    showDeleteConfirm.value = false
  }
}

// Contact seller
const contactSeller = () => {
  // TODO: Implement messaging system
  alert('Messaging feature coming soon! For now, contact the seller through their profile.')
}

// Helper functions
const formatListingType = (type: string) => {
  switch (type) {
    case 'item': return 'Item for Sale'
    case 'room_single': return 'Single Room'
    case 'room_shared': return 'Shared Room'
    default: return type
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Update page title with listing title
watchEffect(() => {
  if (listing.value) {
    useSeoMeta({
      title: `${listing.value.title} - ItaloConnection`,
      description: listing.value.description.substring(0, 160)
    })
  }
})
</script>
