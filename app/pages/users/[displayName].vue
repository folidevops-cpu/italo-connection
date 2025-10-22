<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="max-w-2xl mx-auto px-4 py-20 text-center">
      <div class="text-red-600 text-xl mb-4">{{ error }}</div>
      <NuxtLink to="/" class="text-blue-600 hover:underline">Go back home</NuxtLink>
    </div>

    <div v-else-if="userProfile" class="max-w-7xl mx-auto px-4 py-8">
      <!-- User Info Card -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <img 
              :src="userProfile.avatarUrl || '/default-avatar.png'" 
              :alt="userProfile.displayName"
              class="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
            />
          </div>

          <!-- User Details -->
          <div class="flex-grow">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">{{ userProfile.displayName }}</h1>
                <p v-if="userProfile.firstName || userProfile.surname" class="text-lg text-gray-600 mt-1">
                  {{ userProfile.firstName }} {{ userProfile.surname }}
                </p>
              </div>
              
              <!-- Verification Badges -->
              <div class="flex gap-2">
                <span v-if="userProfile.emailVerified" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Email Verified
                </span>
                <span v-if="userProfile.phoneVerified" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Phone Verified
                </span>
              </div>
            </div>

            <p v-if="userProfile.bio" class="text-gray-700 mb-4">{{ userProfile.bio }}</p>

            <!-- Location & Member Since -->
            <div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <span v-if="userProfile.town || userProfile.province" class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ userProfile.town }}{{ userProfile.province ? ', ' + userProfile.province : '' }}
              </span>
              <span v-if="userProfile.nationality" class="flex items-center">
                🌍 {{ userProfile.nationality }}
              </span>
              <span class="flex items-center">
                📅 Member since {{ formatDate(userProfile.memberSince) }}
              </span>
            </div>

            <!-- Social Links -->
            <div v-if="userProfile.facebookUrl || userProfile.instagramUrl || userProfile.tiktokUrl" class="flex gap-3 mb-4">
              <a v-if="userProfile.facebookUrl" :href="userProfile.facebookUrl" target="_blank" rel="noopener noreferrer" 
                 class="text-blue-600 hover:text-blue-800">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a v-if="userProfile.instagramUrl" :href="userProfile.instagramUrl" target="_blank" rel="noopener noreferrer"
                 class="text-pink-600 hover:text-pink-800">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a v-if="userProfile.tiktokUrl" :href="userProfile.tiktokUrl" target="_blank" rel="noopener noreferrer"
                 class="text-gray-800 hover:text-black">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button @click="showContactModal = true" 
                      class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Contact User
              </button>
              <button @click="showReportModal = true"
                      class="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                Report User
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Listings Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          Active Listings ({{ userProfile.totalListings }})
        </h2>

        <div v-if="userProfile.listings.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          No active listings at the moment.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="listing in userProfile.listings" :key="listing.id" 
               class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <NuxtLink :to="`/listings/${listing.id}`">
              <!-- Listing Image -->
              <div class="h-48 bg-gray-200 overflow-hidden">
                <img v-if="listing.imageUrl" 
                     :src="listing.imageUrl" 
                     :alt="listing.title"
                     class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              </div>

              <!-- Listing Details -->
              <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">{{ listing.title }}</h3>
                  <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {{ listing.type }}
                  </span>
                </div>
                
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ listing.description }}</p>
                
                <div class="flex justify-between items-center">
                  <span class="text-xl font-bold text-blue-600">€{{ listing.price }}</span>
                  <span v-if="listing.availableFrom" class="text-sm text-gray-500">
                    Available {{ formatDate(listing.availableFrom) }}
                  </span>
                </div>

                <div v-if="listing.capacity || listing.sharedSlots" class="mt-2 text-sm text-gray-600">
                  <span v-if="listing.capacity">Capacity: {{ listing.capacity }}</span>
                  <span v-if="listing.sharedSlots" class="ml-3">Slots: {{ listing.sharedSlots }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Modal -->
    <Teleport to="body">
      <div v-if="showReportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Report User</h3>
          
          <form @submit.prevent="submitReport">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Reason</label>
              <input 
                v-model="reportForm.reason" 
                type="text" 
                placeholder="E.g., Spam, Inappropriate content, Scam"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                maxlength="100"
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                v-model="reportForm.description" 
                rows="4"
                placeholder="Please provide details about your report..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minlength="10"
                maxlength="1000"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">{{ reportForm.description.length }}/1000 characters</p>
            </div>

            <div v-if="reportError" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {{ reportError }}
            </div>

            <div class="flex gap-3 justify-end">
              <button 
                type="button" 
                @click="showReportModal = false"
                class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                :disabled="reportSubmitting"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                :disabled="reportSubmitting"
              >
                {{ reportSubmitting ? 'Submitting...' : 'Submit Report' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Contact Modal -->
    <Teleport to="body">
      <div v-if="showContactModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Contact {{ userProfile?.displayName }}</h3>
          
          <form @submit.prevent="submitContact">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
              <input 
                v-model="contactForm.email" 
                type="email" 
                placeholder="your@email.com"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input 
                v-model="contactForm.subject" 
                type="text" 
                placeholder="What is this about?"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                maxlength="100"
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea 
                v-model="contactForm.message" 
                rows="4"
                placeholder="Write your message..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minlength="10"
                maxlength="1000"
              ></textarea>
            </div>

            <div v-if="contactError" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {{ contactError }}
            </div>

            <div class="flex gap-3 justify-end">
              <button 
                type="button" 
                @click="showContactModal = false"
                class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                :disabled="contactSubmitting"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                :disabled="contactSubmitting"
              >
                {{ contactSubmitting ? 'Sending...' : 'Send Message' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Success Modal -->
    <Teleport to="body">
      <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <div class="text-green-500 text-5xl mb-4">✓</div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ successMessage }}</h3>
          <button 
            @click="showSuccessModal = false"
            class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const displayName = route.params.displayName as string

const userProfile = ref<any>(null)
const loading = ref(true)
const error = ref('')

const showReportModal = ref(false)
const showContactModal = ref(false)
const showSuccessModal = ref(false)
const successMessage = ref('')

const reportForm = ref({
  reason: '',
  description: ''
})
const reportError = ref('')
const reportSubmitting = ref(false)

const contactForm = ref({
  email: '',
  subject: '',
  message: ''
})
const contactError = ref('')
const contactSubmitting = ref(false)

// Fetch user profile
const fetchProfile = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await $fetch(`/api/users/${displayName}`)
    userProfile.value = response
  } catch (err: any) {
    error.value = err.data?.statusMessage || 'Failed to load user profile'
  } finally {
    loading.value = false
  }
}

// Submit report
const submitReport = async () => {
  reportError.value = ''
  reportSubmitting.value = true

  try {
    const response = await $fetch(`/api/users/${displayName}/report`, {
      method: 'POST',
      body: reportForm.value
    })

    showReportModal.value = false
    successMessage.value = 'Report submitted successfully. Our team will review it shortly.'
    showSuccessModal.value = true
    
    // Reset form
    reportForm.value = { reason: '', description: '' }
  } catch (err: any) {
    reportError.value = err.data?.statusMessage || 'Failed to submit report'
  } finally {
    reportSubmitting.value = false
  }
}

// Submit contact (placeholder - to be implemented)
const submitContact = async () => {
  contactError.value = ''
  contactSubmitting.value = true

  try {
    // TODO: Implement contact endpoint
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    showContactModal.value = false
    successMessage.value = 'Message sent successfully!'
    showSuccessModal.value = true
    
    // Reset form
    contactForm.value = { email: '', subject: '', message: '' }
  } catch (err: any) {
    contactError.value = 'Failed to send message'
  } finally {
    contactSubmitting.value = false
  }
}

// Format date helper
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Fetch profile on mount
onMounted(() => {
  fetchProfile()
})

// Update page title
useHead({
  title: () => userProfile.value ? `${userProfile.value.displayName} - Profile` : 'User Profile'
})
</script>
