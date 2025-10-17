<template>
  <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="border-b border-gray-200 pb-5 mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Create New Listing</h1>
      <p class="mt-2 text-gray-600">
        Post an item for sale or advertise a room for rent.
      </p>
    </div>

    <!-- Verification Check -->
    <div v-if="!canCreateListings" class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-8">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">
            Verification Required
          </h3>
          <div class="mt-2 text-sm text-yellow-700">
            <p>You need to verify your email and phone before you can create listings.</p>
            <div class="mt-3 space-x-4">
              <NuxtLink v-if="!user?.emailVerified" to="/verify/email" class="font-medium underline">
                Verify Email
              </NuxtLink>
              <NuxtLink v-if="!user?.phoneVerified" to="/verify/phone" class="font-medium underline">
                Verify Phone
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Listing Form -->
    <div v-else class="bg-white shadow rounded-lg p-6">
      <form @submit.prevent="createListing" class="space-y-6">
        <!-- Listing Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            What are you listing?
          </label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              v-for="option in listingTypes" 
              :key="option.value"
              @click="form.type = option.value"
              class="relative cursor-pointer"
            >
              <input
                :id="option.value"
                v-model="form.type"
                :value="option.value"
                type="radio"
                name="listing-type"
                class="sr-only"
              />
              <div
                class="border-2 rounded-lg p-4 text-center transition-colors"
                :class="form.type === option.value 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'"
              >
                <div class="text-2xl mb-2">{{ option.icon }}</div>
                <div class="font-medium text-gray-900">{{ option.label }}</div>
                <div class="text-sm text-gray-500 mt-1">{{ option.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter a descriptive title"
            />
          </div>

          <div>
            <label for="price" class="block text-sm font-medium text-gray-700">
              Price (€) *
            </label>
            <input
              id="price"
              v-model="form.price"
              type="number"
              min="0"
              step="0.01"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :placeholder="form.type?.includes('room') ? 'Monthly rent' : 'Sale price'"
            />
          </div>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="4"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Provide a detailed description..."
          />
        </div>

        <!-- Location -->
        <div>
          <label for="location" class="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            id="location"
            v-model="form.location"
            type="text"
            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="City, Country"
          />
        </div>

        <!-- Room-specific fields -->
        <div v-if="form.type?.includes('room')" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="availableFrom" class="block text-sm font-medium text-gray-700">
                Available From
              </label>
              <input
                id="availableFrom"
                v-model="form.availableFrom"
                type="date"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div v-if="form.type === 'room_shared'">
              <label for="capacity" class="block text-sm font-medium text-gray-700">
                Total Capacity
              </label>
              <input
                id="capacity"
                v-model="form.capacity"
                type="number"
                min="1"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Total number of people"
              />
            </div>
          </div>

          <div v-if="form.type === 'room_shared'">
            <label for="sharedSlots" class="block text-sm font-medium text-gray-700">
              Available Slots
            </label>
            <input
              id="sharedSlots"
              v-model="form.sharedSlots"
              type="number"
              min="1"
              :max="form.capacity"
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Number of available slots"
            />
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end space-x-3 pt-6">
          <NuxtLink
            to="/listings"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            :disabled="submitting || !isFormValid"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ submitting ? 'Creating...' : 'Create Listing' }}
          </button>
        </div>

        <!-- Error/Success Messages -->
        <div v-if="submitError" class="text-sm text-red-600">
          {{ submitError }}
        </div>

        <div v-if="submitSuccess" class="text-sm text-green-600">
          Listing created successfully! Redirecting...
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// ✅ Always use definePageMeta for page configuration
definePageMeta({
  middleware: 'auth'
})

// Set page meta
useSeoMeta({
  title: 'Create Listing - ItaloConnection',
  description: 'Create a new listing on ItaloConnection marketplace'
})

// Get user session
const { user } = useUserSession()

// Check if user can create listings
const canCreateListings = computed(() => {
  if (!user.value) return false
  const userData = user.value as any
  return userData.emailVerified && userData.phoneVerified
})

// Listing types
const listingTypes = [
  {
    value: 'item',
    icon: '📦',
    label: 'Item for Sale',
    description: 'Sell products, electronics, furniture, etc.'
  },
  {
    value: 'room_single',
    icon: '🛏️',
    label: 'Single Room',
    description: 'Rent out a private room'
  },
  {
    value: 'room_shared',
    icon: '🏠',
    label: 'Shared Room',
    description: 'Rent multiple beds in shared space'
  }
]

// Form state
const form = ref({
  type: '',
  title: '',
  description: '',
  price: '',
  location: '',
  availableFrom: '',
  capacity: '',
  sharedSlots: ''
})

// Form validation
const isFormValid = computed(() => {
  return form.value.type && 
         form.value.title && 
         form.value.description && 
         form.value.price &&
         parseFloat(form.value.price) > 0
})

// Submission state
const submitting = ref(false)
const submitError = ref('')
const submitSuccess = ref(false)

// ✅ Use $fetch for form submission
const createListing = async () => {
  if (!isFormValid.value) {
    submitError.value = 'Please fill in all required fields'
    return
  }

  submitting.value = true
  submitError.value = ''
  submitSuccess.value = false

  try {
    const listingData = {
      type: form.value.type,
      title: form.value.title,
      description: form.value.description,
      price: parseFloat(form.value.price),
      location: form.value.location || null,
      availableFrom: form.value.availableFrom || null,
      capacity: form.value.capacity ? parseInt(form.value.capacity) : null,
      sharedSlots: form.value.sharedSlots ? parseInt(form.value.sharedSlots) : null
    }

    await $fetch('/api/listings', {
      method: 'POST',
      body: listingData
    })

    submitSuccess.value = true

    // Redirect to listings page after success
    setTimeout(() => {
      navigateTo('/listings')
    }, 1500)
  } catch (error: any) {
    submitError.value = error.data?.message || 'Failed to create listing'
  } finally {
    submitting.value = false
  }
}
</script>