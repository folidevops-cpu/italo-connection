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

            <!-- Activity Stats -->
            <div class="flex gap-4 mb-4">
              <div class="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <div>
                  <div class="text-xs text-gray-600">Listings</div>
                  <div class="text-sm font-semibold text-gray-900">{{ userProfile.totalListings }}</div>
                </div>
              </div>
              <div v-if="userProfile.totalServices > 0" class="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg">
                <svg class="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <div class="text-xs text-gray-600">Services</div>
                  <div class="text-sm font-semibold text-gray-900">{{ userProfile.totalServices }}</div>
                </div>
              </div>
            </div>

            <!-- Social Links -->
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
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.10-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.40-.67.41-1.06.10-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>

            <!-- Contact Information (Phone & WhatsApp) -->
            <div v-if="userProfile.phone || userProfile.whatsapp" class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                Contact Information
                <span v-if="!userProfile.canSeeFullContact" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  🔒 Partially Hidden
                </span>
              </h3>
              
              <!-- Warning message for unverified users -->
              <div v-if="userProfile.contactMessage" class="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                {{ userProfile.contactMessage }}
              </div>
              
              <div class="space-y-2">
                <div v-if="userProfile.phone" class="flex items-center gap-2 text-sm">
                  <svg class="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span :class="userProfile.canSeeFullContact ? 'text-gray-900 font-medium' : 'text-gray-500'">
                    📞 {{ userProfile.phone }}
                  </span>
                  <a v-if="userProfile.canSeeFullContact" :href="`tel:${userProfile.phone}`" 
                     class="ml-auto text-blue-600 hover:text-blue-700 text-xs font-medium">
                    Call
                  </a>
                </div>
                <div v-if="userProfile.whatsapp" class="flex items-center gap-2 text-sm">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span :class="userProfile.canSeeFullContact ? 'text-gray-900 font-medium' : 'text-gray-500'">
                    💬 {{ userProfile.whatsapp }}
                  </span>
                  <a v-if="userProfile.canSeeFullContact" :href="`https://wa.me/${userProfile.whatsapp.replace(/[^0-9]/g, '')}`" 
                     target="_blank" rel="noopener noreferrer"
                     class="ml-auto text-green-600 hover:text-green-700 text-xs font-medium">
                    Chat
                  </a>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->

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

      <!-- Services Section -->
      <div v-if="userProfile.services && userProfile.services.length > 0" class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          Active Services ({{ userProfile.totalServices }})
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="service in userProfile.services" :key="service.id" 
               class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <NuxtLink :to="`/services/${service.id}`">
              <!-- Service Image -->
              <div class="h-48 bg-gray-200 overflow-hidden">
                <img v-if="service.imageUrl" 
                     :src="service.imageUrl" 
                     :alt="service.name"
                     class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              </div>

              <!-- Service Details -->
              <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">{{ service.name }}</h3>
                  <span class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                    {{ service.serviceType }}
                  </span>
                </div>
                
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ service.description }}</p>
                
                <div class="flex justify-between items-center">
                  <span class="text-xl font-bold text-purple-600">€{{ service.price }}</span>
                  <span v-if="service.location" class="text-sm text-gray-500 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ service.location }}
                  </span>
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
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-900">Contact {{ userProfile?.displayName }}</h3>
            <button @click="showContactModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Loading Contact Info -->
          <div v-if="loadingContactInfo" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2 text-gray-600">Loading contact information...</p>
          </div>

          <!-- Contact Information -->
          <div v-else-if="contactInfo" class="space-y-4">
            <!-- Warning Message -->
            <div v-if="!contactInfo.canSeeFullInfo" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p class="text-sm text-yellow-800">
                {{ contactInfo.message }}
              </p>
            </div>

            <!-- Social Links -->
            <div v-if="contactInfo.facebookUrl || contactInfo.instagramUrl || contactInfo.tiktokUrl">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Social Media</h4>
              <div class="space-y-2">
                <a v-if="contactInfo.facebookUrl" :href="contactInfo.facebookUrl" target="_blank" rel="noopener noreferrer" 
                   class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span class="text-sm text-gray-700">Facebook Profile</span>
                </a>

                <a v-if="contactInfo.instagramUrl" :href="contactInfo.instagramUrl" target="_blank" rel="noopener noreferrer"
                   class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg class="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span class="text-sm text-gray-700">Instagram Profile</span>
                </a>

                <a v-if="contactInfo.tiktokUrl" :href="contactInfo.tiktokUrl" target="_blank" rel="noopener noreferrer"
                   class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg class="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.10-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.40-.67.41-1.06.10-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                  <span class="text-sm text-gray-700">TikTok Profile</span>
                </a>
              </div>
            </div>

            <!-- Phone Number -->
            <div v-if="contactInfo.phone">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Phone Number</h4>
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span :class="contactInfo.canSeeFullInfo ? 'text-gray-900 font-medium' : 'text-gray-500'">
                  {{ contactInfo.phone }}
                </span>
                <a v-if="contactInfo.canSeeFullInfo" :href="`tel:${contactInfo.phone}`" 
                   class="ml-auto text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Call
                </a>
              </div>
            </div>

            <!-- WhatsApp Number -->
            <div v-if="contactInfo.whatsapp">
              <h4 class="text-sm font-medium text-gray-700 mb-2">WhatsApp</h4>
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span :class="contactInfo.canSeeFullInfo ? 'text-gray-900 font-medium' : 'text-gray-500'">
                  {{ contactInfo.whatsapp }}
                </span>
                <a v-if="contactInfo.canSeeFullInfo" :href="`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`" 
                   target="_blank" rel="noopener noreferrer"
                   class="ml-auto text-green-600 hover:text-green-700 text-sm font-medium">
                  Chat
                </a>
              </div>
            </div>

            <!-- No Contact Info Available -->
            <div v-if="!contactInfo.facebookUrl && !contactInfo.instagramUrl && !contactInfo.tiktokUrl && !contactInfo.phone && !contactInfo.whatsapp" 
                 class="text-center py-8 text-gray-500">
              No contact information available
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="contactInfoError" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-sm text-red-800">{{ contactInfoError }}</p>
          </div>
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

const contactInfo = ref<any>(null)
const loadingContactInfo = ref(false)
const contactInfoError = ref('')

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

// Fetch contact info
const fetchContactInfo = async () => {
  loadingContactInfo.value = true
  contactInfoError.value = ''
  contactInfo.value = null

  try {
    const response = await $fetch(`/api/users/${displayName}/contact`)
    contactInfo.value = response
  } catch (err: any) {
    contactInfoError.value = err.data?.statusMessage || 'Failed to load contact information'
  } finally {
    loadingContactInfo.value = false
  }
}

// Watch for contact modal opening to fetch contact info
watch(showContactModal, (newValue) => {
  if (newValue && !contactInfo.value) {
    fetchContactInfo()
  }
})

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
