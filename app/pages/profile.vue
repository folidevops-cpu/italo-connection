<template>
  <div class="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <div class="space-y-8">
      <!-- Page Header -->
      <div class="border-b border-gray-200 pb-5">
        <h1 class="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p class="mt-2 text-gray-600">
          Manage your personal information, residence details, and social media links.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="profilePending" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading profile...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="profileError" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Error loading profile
            </h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ profileError.data?.message || 'Failed to load profile data' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Form -->
      <div v-else class="space-y-8">
        <!-- Account Verification Status -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Account Verification</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <div class="mt-1 flex items-center gap-2">
                <input
                  type="email"
                  :value="profile.user.email"
                  disabled
                  class="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                />
                <span v-if="profile.user.emailVerified" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verified
                </span>
                <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Not Verified
                </span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Phone</label>
              <div class="mt-1 flex items-center gap-2">
                <input
                  type="tel"
                  :value="profile.user.phone || 'Not provided'"
                  disabled
                  class="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                />
                <span v-if="profile.user.phoneVerified" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verified
                </span>
                <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Not Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        <form @submit.prevent="updateProfile" class="space-y-8">
          <!-- Section 1: Personal Information -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700">
                  First Name <span class="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Mario"
                />
              </div>

              <div>
                <label for="middleName" class="block text-sm font-medium text-gray-700">
                  Middle Name
                </label>
                <input
                  id="middleName"
                  v-model="form.middleName"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Giuseppe"
                />
              </div>

              <div>
                <label for="surname" class="block text-sm font-medium text-gray-700">
                  Surname <span class="text-red-500">*</span>
                </label>
                <input
                  id="surname"
                  v-model="form.surname"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Rossi"
                />
              </div>
            </div>

            <div class="mt-6">
              <label for="displayName" class="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <input
                id="displayName"
                v-model="form.displayName"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="How you want to be shown to others"
              />
              <p class="mt-1 text-sm text-gray-500">
                If not provided, we'll use your first name.
              </p>
            </div>

            <div class="mt-6">
              <label for="bio" class="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                v-model="form.bio"
                rows="4"
                maxlength="500"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tell others about yourself..."
              />
              <p class="mt-1 text-sm text-gray-500">
                {{ form.bio?.length || 0 }} / 500 characters
              </p>
            </div>

            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="nationality" class="block text-sm font-medium text-gray-700">
                  Nationality
                </label>
                <input
                  id="nationality"
                  v-model="form.nationality"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Italian"
                />
              </div>

              <div>
                <label for="maritalStatus" class="block text-sm font-medium text-gray-700">
                  Marital Status
                </label>
                <select
                  id="maritalStatus"
                  v-model="form.maritalStatus"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select status</option>
                  <option v-for="status in maritalStatusOptions" :key="status.value" :value="status.value">
                    {{ status.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Section 2: Residence Information -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Residence (Italy)
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label for="town" class="block text-sm font-medium text-gray-700">
                  Town/City
                </label>
                <input
                  id="town"
                  v-model="form.town"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Rome"
                />
              </div>

              <div>
                <label for="province" class="block text-sm font-medium text-gray-700">
                  Province
                </label>
                <select
                  id="province"
                  v-model="form.province"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select province</option>
                  <option v-for="province in italianProvinces" :key="province.code" :value="province.code">
                    {{ province.name }} ({{ province.code }})
                  </option>
                </select>
              </div>

              <div>
                <label for="cap" class="block text-sm font-medium text-gray-700">
                  CAP (Postal Code)
                </label>
                <input
                  id="cap"
                  v-model="form.cap"
                  type="text"
                  pattern="[0-9]{5}"
                  maxlength="5"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="00100"
                />
                <p class="mt-1 text-sm text-gray-500">
                  5-digit postal code
                </p>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="md:col-span-2">
                <label for="street" class="block text-sm font-medium text-gray-700">
                  Street Name
                </label>
                <input
                  id="street"
                  v-model="form.street"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Via Roma"
                />
              </div>

              <div>
                <label for="streetNumber" class="block text-sm font-medium text-gray-700">
                  Number
                </label>
                <input
                  id="streetNumber"
                  v-model="form.streetNumber"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="123"
                />
              </div>
            </div>

            <div class="mt-6">
              <label for="googlePlaceId" class="block text-sm font-medium text-gray-700">
                Google Place ID (Optional)
              </label>
              <input
                id="googlePlaceId"
                v-model="form.googlePlaceId"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="ChIJ..."
              />
              <p class="mt-1 text-sm text-gray-500">
                For precise location mapping with Google Places API
              </p>
            </div>
          </div>

          <!-- Section 3: Social Media Links -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg class="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Social Media
            </h2>
            
            <div class="space-y-6">
              <div>
                <label for="facebookUrl" class="text-sm font-medium text-gray-700 flex items-center">
                  <svg class="h-5 w-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook Profile
                </label>
                <input
                  id="facebookUrl"
                  v-model="form.facebookUrl"
                  type="url"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://facebook.com/yourusername"
                />
              </div>

              <div>
                <label for="instagramUrl" class="text-sm font-medium text-gray-700 flex items-center">
                  <svg class="h-5 w-5 text-pink-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram Profile
                </label>
                <input
                  id="instagramUrl"
                  v-model="form.instagramUrl"
                  type="url"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://instagram.com/yourusername"
                />
              </div>

              <div>
                <label for="tiktokUrl" class="text-sm font-medium text-gray-700 flex items-center">
                  <svg class="h-5 w-5 text-black mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.40-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                  TikTok Profile
                </label>
                <input
                  id="tiktokUrl"
                  v-model="form.tiktokUrl"
                  type="url"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://tiktok.com/@yourusername"
                />
              </div>

              <div>
                <label for="phone" class="text-sm font-medium text-gray-700 flex items-center">
                  <svg class="h-5 w-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Phone Number
                </label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="+39 123 456 7890"
                />
                <p class="mt-1 text-xs text-gray-500">
                  Only visible to email verified users
                </p>
              </div>

              <div>
                <label for="whatsapp" class="text-sm font-medium text-gray-700 flex items-center">
                  <svg class="h-5 w-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp Number
                </label>
                <input
                  id="whatsapp"
                  v-model="form.whatsapp"
                  type="tel"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="+39 123 456 7890"
                />
                <p class="mt-1 text-xs text-gray-500">
                  Only visible to email verified users
                </p>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="resetForm"
              class="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
            <button
              type="submit"
              :disabled="updating"
              class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ updating ? 'Updating...' : 'Save Changes' }}
            </button>
          </div>

          <!-- Success/Error Messages -->
          <div v-if="updateError" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ updateError }}</p>
              </div>
            </div>
          </div>

          <div v-if="updateSuccess" class="bg-green-50 border border-green-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-green-800">Profile updated successfully!</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ITALIAN_PROVINCES, MARITAL_STATUS_OPTIONS } from '~/constants/italy'

// ✅ Always use definePageMeta for page configuration
definePageMeta({
  middleware: 'auth'
})

// Set page meta
useSeoMeta({
  title: 'Profile Settings - ItaloConnection',
  description: 'Manage your personal information, residence details, and social media links'
})

// Italian provinces and marital status options
const italianProvinces = ITALIAN_PROVINCES
const maritalStatusOptions = MARITAL_STATUS_OPTIONS

// ✅ Use useFetch for loading profile data
const { data: profile, pending: profilePending, error: profileError, refresh: refreshProfile } = await useFetch('/api/profile', {
  default: () => ({
    firstName: '',
    middleName: '',
    surname: '',
    displayName: '',
    bio: '',
    nationality: '',
    maritalStatus: '',
    street: '',
    streetNumber: '',
    town: '',
    province: '',
    cap: '',
    googlePlaceId: '',
    facebookUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
    avatarUrl: '',
    user: {
      email: '',
      phone: '',
      emailVerified: false,
      phoneVerified: false,
      role: 'user'
    }
  })
})

// Watch for 401 errors (session expired) and redirect to login
watch(profileError, (error) => {
  if (error && error.statusCode === 401) {
    console.log('Session expired, redirecting to login...')
    navigateTo('/auth/login')
  }
})

// Form state
const form = ref({
  firstName: '',
  middleName: '',
  surname: '',
  displayName: '',
  bio: '',
  nationality: '',
  maritalStatus: '',
  street: '',
  streetNumber: '',
  town: '',
  province: '',
  cap: '',
  googlePlaceId: '',
  facebookUrl: '',
  instagramUrl: '',
  tiktokUrl: '',
  phone: '',
  whatsapp: ''
})

// Update form state
const updating = ref(false)
const updateError = ref('')
const updateSuccess = ref(false)

// Initialize form with profile data
watch(profile, (newProfile) => {
  if (newProfile) {
    const p = newProfile as any
    form.value = {
      firstName: p.firstName || '',
      middleName: p.middleName || '',
      surname: p.surname || '',
      displayName: p.displayName || '',
      bio: p.bio || '',
      nationality: p.nationality || '',
      maritalStatus: p.maritalStatus || '',
      street: p.street || '',
      streetNumber: p.streetNumber || '',
      town: p.town || '',
      province: p.province || '',
      cap: p.cap || '',
      googlePlaceId: p.googlePlaceId || '',
      facebookUrl: p.facebookUrl || '',
      instagramUrl: p.instagramUrl || '',
      tiktokUrl: p.tiktokUrl || '',
      phone: p.phone || '',
      whatsapp: p.whatsapp || ''
    }
  }
}, { immediate: true })

// Reset form to original values
const resetForm = () => {
  if (profile.value) {
    const p = profile.value as any
    form.value = {
      firstName: p.firstName || '',
      middleName: p.middleName || '',
      surname: p.surname || '',
      displayName: p.displayName || '',
      bio: p.bio || '',
      nationality: p.nationality || '',
      maritalStatus: p.maritalStatus || '',
      street: p.street || '',
      streetNumber: p.streetNumber || '',
      town: p.town || '',
      province: p.province || '',
      cap: p.cap || '',
      googlePlaceId: p.googlePlaceId || '',
      facebookUrl: p.facebookUrl || '',
      instagramUrl: p.instagramUrl || '',
      tiktokUrl: p.tiktokUrl || '',
      phone: p.phone || '',
      whatsapp: p.whatsapp || ''
    }
  }
  updateError.value = ''
  updateSuccess.value = false
}

// ✅ Use $fetch for form submission
const updateProfile = async () => {
  updating.value = true
  updateError.value = ''
  updateSuccess.value = false
  
  try {
    await $fetch('/api/profile', {
      method: 'PUT',
      body: form.value
    })
    
    updateSuccess.value = true
    
    // Refresh the profile data to show updates
    await refreshProfile()
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      updateSuccess.value = false
    }, 5000)
    
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error: any) {
    updateError.value = error.data?.message || 'Failed to update profile'
    
    // Scroll to show error
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    updating.value = false
  }
}
</script>