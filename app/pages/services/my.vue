<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="border-b border-gray-200 pb-5 mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">My Services</h1>
          <p class="mt-2 text-gray-600">
            Manage your service offerings
          </p>
        </div>
        <NuxtLink
          to="/services/create"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Service
        </NuxtLink>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading your services...</p>
    </div>

    <!-- Services List -->
    <div v-else-if="services && services.length > 0" class="space-y-6">
      <div
        v-for="service in services"
        :key="service.id"
        class="bg-white rounded-lg shadow overflow-hidden"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <!-- Service Info -->
          <div class="md:col-span-2 space-y-4">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-gray-900">{{ service.name }}</h3>
                <div class="flex items-center gap-3 mt-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ service.serviceType.name }}
                  </span>
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
              <div class="text-2xl font-bold text-gray-900">
                €{{ service.price }}
              </div>
            </div>

            <p class="text-gray-600 line-clamp-2">{{ service.description }}</p>

            <div class="flex items-center text-sm text-gray-500">
              <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ formatLocation(service.location) }}
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-3 pt-4">
              <button
                @click="editingService = service.id"
                class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Details
              </button>
              <button
                @click="managingImages = service.id"
                class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Manage Images ({{ service.media?.length || 0 }})
              </button>
              <NuxtLink
                :to="`/services/${service.id}`"
                class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View
              </NuxtLink>
              <button
                @click="deleteService(service.id)"
                class="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
              >
                <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>

          <!-- Service Images Preview -->
          <div class="md:col-span-1">
            <div v-if="service.media && service.media.length > 0" class="grid grid-cols-2 gap-2">
              <div
                v-for="(image, index) in service.media.slice(0, 4)"
                :key="image.id"
                class="aspect-square rounded overflow-hidden"
              >
                <img
                  :src="image.url"
                  :alt="`Service image ${index + 1}`"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            <div v-else class="aspect-video bg-gray-200 rounded flex items-center justify-center">
              <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 bg-white rounded-lg shadow">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No services yet</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating your first service</p>
      <div class="mt-6">
        <NuxtLink
          to="/services/create"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Service
        </NuxtLink>
      </div>
    </div>

    <!-- Edit Service Modal -->
    <div
      v-if="editingService"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click.self="cancelEdit"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Edit Service</h2>
            <button
              @click="cancelEdit"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="updateService" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Service Name *
                </label>
                <input
                  v-model="editForm.name"
                  type="text"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Service Type *
                </label>
                <select
                  v-model="editForm.serviceTypeId"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option v-for="type in serviceTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                v-model="editForm.description"
                rows="4"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <InputsGooglePlacesField
                  v-model="editForm.location"
                  label="Location"
                  placeholder="Start typing an address..."
                  country-restrict="IT"
                  hint="Select your service location from the dropdown"
                  required
                  @place-selected="handleLocationSelected"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Price (€) *
                </label>
                <input
                  v-model.number="editForm.price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div v-if="updateError" class="text-sm text-red-600">
              {{ updateError }}
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="cancelEdit"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="updating"
                class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {{ updating ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Manage Images Modal -->
    <div
      v-if="managingImages"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click.self="cancelImageManagement"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Manage Images</h2>
            <button
              @click="cancelImageManagement"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Upload New Images -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Add New Images (Maximum 4 total)
            </label>
            <div class="flex items-center gap-4">
              <label
                for="image-upload"
                class="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentImages.length >= 4 || uploadingImage }"
              >
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                {{ uploadingImage ? 'Uploading...' : 'Upload Image' }}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                :disabled="currentImages.length >= 4 || uploadingImage"
                @change="uploadNewImage"
                class="hidden"
              />
              <span class="text-sm text-gray-500">
                {{ currentImages.length }} / 4 images
              </span>
            </div>
            <div v-if="imageUploadError" class="mt-2 text-sm text-red-600">
              {{ imageUploadError }}
            </div>
          </div>

          <!-- Current Images -->
          <div v-if="currentImages.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
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

              <!-- Remove Button -->
              <button
                type="button"
                @click="removeServiceImage(image.id)"
                class="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                :disabled="deletingImage === image.id"
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
          <div v-else class="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="mt-2 text-sm text-gray-500">No images uploaded yet</p>
          </div>

          <div class="flex justify-end mt-6">
            <button
              @click="cancelImageManagement"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

useSeoMeta({
  title: 'My Services - ItaloConnection',
  description: 'Manage your service offerings'
})

// Use location formatter
const { formatLocation } = useLocationFormatter();

// Fetch user's services
const { data, pending, refresh } = await useFetch('/api/services/my')
const services = computed(() => data.value?.services || [])

// Fetch service types
const { data: typesData } = await useFetch('/api/service-types')
const serviceTypes = computed(() => typesData.value?.serviceTypes || [])

// Edit service state
const editingService = ref<string | null>(null)
const editForm = ref({
  name: '',
  serviceTypeId: '',
  description: '',
  location: '',
  price: 0
})
const updating = ref(false)
const updateError = ref('')

// Image management state
const managingImages = ref<string | null>(null)
const currentImages = ref<any[]>([])
const uploadingImage = ref(false)
const deletingImage = ref<string | null>(null)
const imageUploadError = ref('')

// Edit service
const editService = (serviceId: string) => {
  const service = services.value.find((s: any) => s.id === serviceId)
  if (service) {
    editForm.value = {
      name: service.name,
      serviceTypeId: service.serviceTypeId,
      description: service.description,
      location: service.location,
      price: service.price
    }
    editingService.value = serviceId
  }
}

watchEffect(() => {
  if (editingService.value) {
    const service = services.value.find((s: any) => s.id === editingService.value)
    if (service) {
      editForm.value = {
        name: service.name,
        serviceTypeId: service.serviceTypeId,
        description: service.description,
        location: service.location,
        price: service.price
      }
    }
  }
})

const updateService = async () => {
  if (!editingService.value) return

  updating.value = true
  updateError.value = ''

  try {
    await $fetch(`/api/services/${editingService.value}`, {
      method: 'PUT',
      body: editForm.value
    })

    await refresh()
    editingService.value = null
  } catch (error: any) {
    updateError.value = error.data?.message || 'Failed to update service'
  } finally {
    updating.value = false
  }
}

const cancelEdit = () => {
  editingService.value = null
  updateError.value = ''
}

// Delete service
const deleteService = async (serviceId: string) => {
  if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
    return
  }

  try {
    await $fetch(`/api/services/${serviceId}`, {
      method: 'DELETE'
    })

    await refresh()
  } catch (error: any) {
    alert(error.data?.message || 'Failed to delete service')
  }
}

// Image management
const startManagingImages = (serviceId: string) => {
  const service = services.value.find((s: any) => s.id === serviceId)
  if (service) {
    currentImages.value = [...(service.media || [])]
    managingImages.value = serviceId
  }
}

watchEffect(() => {
  if (managingImages.value) {
    const service = services.value.find((s: any) => s.id === managingImages.value)
    if (service) {
      currentImages.value = [...(service.media || [])]
    }
  }
})

const uploadNewImage = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file || !managingImages.value) return

  if (currentImages.value.length >= 4) {
    imageUploadError.value = 'Maximum 4 images allowed'
    setTimeout(() => imageUploadError.value = '', 5000)
    return
  }

  uploadingImage.value = true
  imageUploadError.value = ''

  try {
    // Upload image to S3
    const formData = new FormData()
    formData.append('file', file)
    formData.append('listingType', 'service')

    const { publicUrl, key } = await $fetch('/api/upload/image', {
      method: 'POST',
      body: formData
    })

    // Add image to service
    await $fetch(`/api/services/${managingImages.value}/media`, {
      method: 'POST',
      body: {
        url: publicUrl,
        key,
        type: 'image',
        order: currentImages.value.length
      }
    })

    // Refresh service data
    await refresh()
    const service = services.value.find((s: any) => s.id === managingImages.value)
    if (service) {
      currentImages.value = [...(service.media || [])]
    }
  } catch (error: any) {
    console.error('Image upload failed:', error)
    imageUploadError.value = error.data?.message || 'Failed to upload image'
  } finally {
    uploadingImage.value = false
    target.value = ''
  }
}

const removeServiceImage = async (imageId: string) => {
  if (!managingImages.value) return

  if (!confirm('Are you sure you want to delete this image?')) {
    return
  }

  deletingImage.value = imageId

  try {
    await $fetch(`/api/services/${managingImages.value}/media/${imageId}`, {
      method: 'DELETE'
    })

    // Refresh service data
    await refresh()
    const service = services.value.find((s: any) => s.id === managingImages.value)
    if (service) {
      currentImages.value = [...(service.media || [])]
    }
  } catch (error: any) {
    alert(error.data?.message || 'Failed to delete image')
  } finally {
    deletingImage.value = null
  }
}

const cancelImageManagement = () => {
  managingImages.value = null
  currentImages.value = []
  imageUploadError.value = ''
}

// Handle location selected from Google Places
const handleLocationSelected = (placeData: any) => {
  // Format location as "Town, Country"
  const town = placeData.addressComponents?.locality || 
               placeData.addressComponents?.administrative_area_level_2 || 
               'Unknown'
  const country = placeData.addressComponents?.country || 'Italy'
  
  // Set the formatted location
  editForm.value.location = `${town}, ${country}`
  
  // Store additional data if needed (lat/lng, place_id, etc.)
  console.log('Location selected:', placeData)
}
</script>
