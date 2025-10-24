<template>
  <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="border-b border-gray-200 pb-5 mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Offer a Service</h1>
      <p class="mt-2 text-gray-600">
        Share your skills and services with the community.
      </p>
    </div>

    <!-- Create Service Form -->
    <div class="bg-white shadow rounded-lg p-6">
      <form @submit.prevent="submitService" class="space-y-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Service Name *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Professional Hair Braiding"
            />
          </div>

          <div>
            <label for="serviceType" class="block text-sm font-medium text-gray-700">
              Service Type *
            </label>
            <select
              id="serviceType"
              v-model="form.serviceTypeId"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a service type</option>
              <option v-for="type in serviceTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
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
            placeholder="Describe your service, experience, and what customers can expect..."
          />
        </div>

        <!-- Location and Price -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700">
              Location *
            </label>
            <input
              id="location"
              v-model="form.location"
              type="text"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="City, Country"
            />
          </div>

          <div>
            <label for="price" class="block text-sm font-medium text-gray-700">
              Price (€) *
            </label>
            <input
              id="price"
              v-model.number="form.price"
              type="number"
              min="0"
              step="0.01"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Service price"
            />
          </div>
        </div>

        <!-- Image Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Images (Maximum 4) *
          </label>
          <p class="text-sm text-gray-500 mb-3">
            Upload up to 4 photos. First image will be the cover photo.
          </p>

          <!-- Upload Button -->
          <div class="flex items-center gap-4 mb-4">
            <label
              for="image-upload"
              class="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :class="{ 'opacity-50 cursor-not-allowed': uploadedImages.length >= 4 || uploading }"
            >
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              {{ uploading ? 'Uploading...' : 'Add Photos' }}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              :disabled="uploadedImages.length >= 4 || uploading"
              @change="handleImageSelect"
              class="hidden"
            />
            <span class="text-sm text-gray-500">
              {{ uploadedImages.length }} / 4 images
            </span>
          </div>

          <!-- Upload Error -->
          <div v-if="uploadError" class="mb-4 text-sm text-red-600">
            {{ uploadError }}
          </div>

          <!-- Image Previews -->
          <div v-if="uploadedImages.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="(image, index) in uploadedImages"
              :key="image.publicUrl"
              class="relative group"
            >
              <div class="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  :src="image.publicUrl"
                  :alt="`Image ${index + 1}`"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Cover Badge -->
              <div v-if="index === 0" class="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                Cover
              </div>

              <!-- Remove Button -->
              <button
                type="button"
                @click="removeImage(index)"
                class="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <!-- Order Badge -->
              <div class="absolute bottom-2 left-2 bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {{ index + 1 }}
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="mt-2 text-sm text-gray-500">No images uploaded yet</p>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end space-x-3 pt-6">
          <NuxtLink
            to="/services"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            :disabled="submitting || !isFormValid"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ submitting ? 'Creating...' : 'Create Service' }}
          </button>
        </div>

        <!-- Error/Success Messages -->
        <div v-if="submitError" class="text-sm text-red-600">
          {{ submitError }}
        </div>

        <div v-if="submitSuccess" class="text-sm text-green-600">
          Service created successfully! Redirecting...
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
  title: 'Offer a Service - ItaloConnection',
  description: 'Share your skills and services with the community'
})

// Form state
const form = ref({
  name: '',
  serviceTypeId: '',
  description: '',
  location: '',
  price: 0
})

// Image upload state
const uploadedImages = ref<Array<{ publicUrl: string; key: string }>>([])
const uploading = ref(false)
const uploadError = ref('')

// Submission state
const submitting = ref(false)
const submitError = ref('')
const submitSuccess = ref(false)

// Fetch service types
const { data: typesData } = await useFetch('/api/service-types')
const serviceTypes = computed(() => typesData.value?.serviceTypes?.filter((t: any) => t.isActive) || [])

// Handle image file selection
const handleImageSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files || files.length === 0) return

  // Check if adding these files would exceed the limit
  const remainingSlots = 4 - uploadedImages.value.length
  if (files.length > remainingSlots) {
    uploadError.value = `You can only upload ${remainingSlots} more image${remainingSlots !== 1 ? 's' : ''}`
    setTimeout(() => uploadError.value = '', 5000)
    return
  }

  // Validate file types and sizes
  const validFiles: File[] = []
  for (const file of Array.from(files)) {
    // Check file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      uploadError.value = `${file.name} is not a valid image type. Only JPEG, PNG, and WebP are allowed.`
      setTimeout(() => uploadError.value = '', 5000)
      continue
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      uploadError.value = `${file.name} is too large. Maximum size is 5MB.`
      setTimeout(() => uploadError.value = '', 5000)
      continue
    }

    validFiles.push(file)
  }

  if (validFiles.length === 0) return

  uploading.value = true
  uploadError.value = ''

  try {
    // Upload each file to the server (which uploads to S3)
    for (const file of validFiles) {
      // Create FormData to send the file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('listingType', 'service') // Use 'service' as the type

      // Upload to our server endpoint
      const { publicUrl, key } = await $fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      // Add to uploaded images
      uploadedImages.value.push({ publicUrl, key })
    }
  } catch (error: any) {
    console.error('Image upload failed:', error)
    uploadError.value = error.message || 'Failed to upload images. Please try again.'
  } finally {
    uploading.value = false
    // Reset input
    target.value = ''
  }
}

// Remove an image
const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
}

// Form validation
const isFormValid = computed(() => {
  return form.value.name && 
         form.value.serviceTypeId && 
         form.value.description && 
         form.value.location &&
         form.value.price > 0 &&
         uploadedImages.value.length > 0 // Require at least 1 image
})

// Handle form submission
const submitService = async () => {
  if (!isFormValid.value) {
    submitError.value = 'Please fill in all required fields and upload at least one image'
    return
  }

  submitting.value = true
  submitError.value = ''
  submitSuccess.value = false

  try {
    const serviceData = {
      name: form.value.name,
      serviceTypeId: form.value.serviceTypeId,
      description: form.value.description,
      location: form.value.location,
      price: parseFloat(String(form.value.price)),
      // Add images data
      images: uploadedImages.value.map((img, index) => ({
        url: img.publicUrl,
        key: img.key,
        type: 'image',
        order: index
      }))
    }

    await $fetch('/api/services', {
      method: 'POST',
      body: serviceData
    })

    submitSuccess.value = true

    // Redirect to services page after success
    setTimeout(() => {
      navigateTo('/services')
    }, 1500)
  } catch (error: any) {
    submitError.value = error.data?.message || 'Failed to create service'
  } finally {
    submitting.value = false
  }
}
</script>
