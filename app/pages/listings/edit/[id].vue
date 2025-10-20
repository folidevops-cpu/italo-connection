<template>
  <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="border-b border-gray-200 pb-5 mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Edit Listing</h1>
      <p class="mt-2 text-gray-600">
        Update your listing information
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading listing...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="fetchError" class="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
      <p class="text-red-700">{{ fetchError }}</p>
      <NuxtLink to="/listings/my" class="text-blue-600 hover:underline mt-2 inline-block">
        Go back to your listings
      </NuxtLink>
    </div>

    <!-- Edit Listing Form -->
    <div v-else-if="listing" class="bg-white shadow rounded-lg p-6">
      <form @submit.prevent="updateListing" class="space-y-6">
        <!-- Listing Type (Read-only) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Listing Type
          </label>
          <div class="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
            <div class="font-medium text-gray-900">
              {{ formatListingType(form.type) }}
            </div>
            <p class="text-sm text-gray-500 mt-1">Listing type cannot be changed</p>
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

        <!-- Current Images -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Current Images ({{ currentImages.length }}/4)
          </label>
          <p class="text-sm text-gray-500 mb-3">
            You can delete individual images and add new ones. Maximum 4 images total.
          </p>
          
          <div v-if="currentImages.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div
              v-for="(image, index) in currentImages"
              :key="image.id"
              class="relative group"
            >
              <div class="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  :src="image.url"
                  :alt="`Image ${index + 1}`"
                  class="w-full h-full object-cover"
                />
              </div>
              
              <!-- Cover Badge -->
              <div v-if="index === 0" class="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                Cover
              </div>
              
              <!-- Delete Button -->
              <button
                type="button"
                @click="deleteExistingImage(image)"
                :disabled="deletingImageId === image.id"
                class="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                title="Delete image"
              >
                <svg v-if="deletingImageId !== image.id" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <svg v-else class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
              
              <!-- Order Badge -->
              <div class="absolute bottom-2 left-2 bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {{ index + 1 }}
              </div>
            </div>
          </div>
          
          <div v-else class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="mt-2 text-sm text-gray-500">All images deleted. Add new images below.</p>
          </div>
        </div>

        <!-- Add New Images -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Add New Images
          </label>
          <p class="text-sm text-gray-500 mb-3">
            Upload additional images ({{ totalImagesCount }}/4 total).
          </p>

          <!-- Upload Button -->
          <div class="flex items-center gap-4 mb-4">
            <label
              for="image-upload"
              class="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': totalImagesCount >= 4 || uploading }"
            >
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              {{ uploading ? 'Uploading...' : 'Upload Photos' }}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              :disabled="totalImagesCount >= 4 || uploading"
              @change="handleImageSelect"
              class="hidden"
            />
            <span v-if="uploadedImages.length > 0" class="text-sm text-green-600">
              {{ uploadedImages.length }} new image{{ uploadedImages.length !== 1 ? 's' : '' }} ready
            </span>
          </div>

          <!-- Upload Error -->
          <div v-if="uploadError" class="mb-4 text-sm text-red-600">
            {{ uploadError }}
          </div>

          <!-- Delete Error -->
          <div v-if="deleteError" class="mb-4 text-sm text-red-600">
            {{ deleteError }}
          </div>

          <!-- New Image Previews -->
          <div v-if="uploadedImages.length > 0" class="space-y-3">
            <p class="text-sm font-medium text-green-700">New images to be added:</p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="(image, index) in uploadedImages"
                :key="image.publicUrl"
                class="relative group"
              >
                <div class="aspect-square rounded-lg overflow-hidden border-2 border-green-500">
                  <img
                    :src="image.publicUrl"
                    :alt="`New image ${index + 1}`"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div v-if="currentImages.length === 0 && index === 0" class="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  New Cover
                </div>
                <button
                  type="button"
                  @click="removeNewImage(index)"
                  class="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end space-x-3 pt-6">
          <NuxtLink
            to="/listings/my"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            :disabled="submitting || !isFormValid"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {{ submitting ? 'Updating...' : 'Update Listing' }}
          </button>
        </div>

        <!-- Error/Success Messages -->
        <div v-if="submitError" class="text-sm text-red-600">
          {{ submitError }}
        </div>

        <div v-if="submitSuccess" class="text-sm text-green-600">
          Listing updated successfully! Redirecting...
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

useSeoMeta({
  title: 'Edit Listing - ItaloConnection',
  description: 'Edit your listing on ItaloConnection'
})

// Get listing ID from route
const route = useRoute()
const listingId = route.params.id as string

// Fetch listing data
const { data: listing, pending, error: fetchErrorObj } = await useFetch(`/api/listings/${listingId}`)

const fetchError = computed(() => {
  if (fetchErrorObj.value) {
    return fetchErrorObj.value.data?.message || 'Failed to load listing'
  }
  return null
})

// Form state
const form = ref({
  type: '',
  title: '',
  description: '',
  price: '',
  availableFrom: '',
  capacity: '',
  sharedSlots: ''
})

// Image upload state
const uploadedImages = ref<Array<{ publicUrl: string; key: string }>>([])
const uploading = ref(false)
const uploadError = ref('')
const deleteError = ref('')
const deletingImageId = ref<string | null>(null)

// Track current images (from database)
const currentImages = ref<Array<any>>([])

// Submission state
const submitting = ref(false)
const submitError = ref('')
const submitSuccess = ref(false)

// Total images count
const totalImagesCount = computed(() => {
  return currentImages.value.length + uploadedImages.value.length
})

// Initialize form with listing data
watchEffect(() => {
  if (listing.value) {
    form.value = {
      type: listing.value.type,
      title: listing.value.title,
      description: listing.value.description,
      price: listing.value.price.toString(),
      availableFrom: listing.value.availableFrom 
        ? new Date(listing.value.availableFrom).toISOString().split('T')[0] 
        : '',
      capacity: listing.value.capacity?.toString() || '',
      sharedSlots: listing.value.sharedSlots?.toString() || ''
    }
    
    // Initialize current images
    if (listing.value.media) {
      currentImages.value = [...listing.value.media]
    }
  }
})

// Helper functions
const formatListingType = (type: string) => {
  switch (type) {
    case 'item': return 'Item for Sale'
    case 'room_single': return 'Single Room'
    case 'room_shared': return 'Shared Room'
    default: return type
  }
}

// Handle image file selection
const handleImageSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files || files.length === 0) return

  // Check total images limit
  const remainingSlots = 4 - totalImagesCount.value
  if (files.length > remainingSlots) {
    uploadError.value = `You can only upload ${remainingSlots} more image${remainingSlots !== 1 ? 's' : ''}. Total limit is 4 images.`
    setTimeout(() => uploadError.value = '', 5000)
    target.value = ''
    return
  }

  // Validate and upload
  const validFiles: File[] = []
  for (const file of Array.from(files)) {
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      uploadError.value = `${file.name} is not a valid image type`
      setTimeout(() => uploadError.value = '', 5000)
      continue
    }
    if (file.size > 5 * 1024 * 1024) {
      uploadError.value = `${file.name} is too large (max 5MB)`
      setTimeout(() => uploadError.value = '', 5000)
      continue
    }
    validFiles.push(file)
  }

  if (validFiles.length === 0) {
    target.value = ''
    return
  }

  uploading.value = true
  uploadError.value = ''

  try {
    for (const file of validFiles) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('listingType', form.value.type)

      const { publicUrl, key } = await $fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      uploadedImages.value.push({ publicUrl, key })
    }
  } catch (error: any) {
    console.error('Image upload failed:', error)
    uploadError.value = error.data?.message || error.message || 'Failed to upload images'
  } finally {
    uploading.value = false
    target.value = ''
  }
}

// Delete an existing image
const deleteExistingImage = async (image: any) => {
  if (currentImages.value.length + uploadedImages.value.length <= 1) {
    deleteError.value = 'You must have at least one image'
    setTimeout(() => deleteError.value = '', 5000)
    return
  }

  if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
    return
  }

  deletingImageId.value = image.id
  deleteError.value = ''

  try {
    await $fetch('/api/upload/delete-image', {
      method: 'POST',
      body: {
        key: image.key,
        listingId: listingId
      }
    })

    // Remove from current images array
    const index = currentImages.value.findIndex(img => img.id === image.id)
    if (index > -1) {
      currentImages.value.splice(index, 1)
    }
  } catch (error: any) {
    console.error('Failed to delete image:', error)
    deleteError.value = error.data?.message || 'Failed to delete image'
    setTimeout(() => deleteError.value = '', 5000)
  } finally {
    deletingImageId.value = null
  }
}

// Remove a newly uploaded image (before saving)
const removeNewImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
}

// Form validation
const isFormValid = computed(() => {
  return form.value.type && 
         form.value.title && 
         form.value.description && 
         form.value.price &&
         parseFloat(form.value.price) > 0 &&
         totalImagesCount.value > 0 // At least 1 image required
})

// Update listing
const updateListing = async () => {
  if (!isFormValid.value) {
    submitError.value = 'Please fill in all required fields and have at least one image'
    return
  }

  submitting.value = true
  submitError.value = ''
  submitSuccess.value = false

  try {
    const updateData: any = {
      type: form.value.type,
      title: form.value.title,
      description: form.value.description,
      price: parseFloat(form.value.price),
      availableFrom: form.value.availableFrom || null,
      capacity: form.value.capacity ? parseInt(form.value.capacity) : null,
      sharedSlots: form.value.sharedSlots ? parseInt(form.value.sharedSlots) : null
    }

    // If new images were uploaded, add them to the listing
    // Combine current images with new images
    if (uploadedImages.value.length > 0) {
      const allImages = [
        // Existing images that weren't deleted
        ...currentImages.value.map((img, index) => ({
          url: img.url,
          key: img.key,
          type: 'image',
          order: index
        })),
        // New images
        ...uploadedImages.value.map((img, index) => ({
          url: img.publicUrl,
          key: img.key,
          type: 'image',
          order: currentImages.value.length + index
        }))
      ]
      
      updateData.images = allImages
    }

    await $fetch(`/api/listings/${listingId}`, {
      method: 'PUT',
      body: updateData
    })

    submitSuccess.value = true

    // Redirect after success
    setTimeout(() => {
      navigateTo('/listings/my')
    }, 1500)
  } catch (error: any) {
    submitError.value = error.data?.message || 'Failed to update listing'
  } finally {
    submitting.value = false
  }
}
</script>
