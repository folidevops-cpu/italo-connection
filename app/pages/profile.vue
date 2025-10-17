<template>
  <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <div class="space-y-8">
      <!-- Page Header -->
      <div class="border-b border-gray-200 pb-5">
        <h1 class="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p class="mt-2 text-gray-600">
          Manage your personal information and account settings.
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
        <!-- Account Information -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <div class="mt-1 flex rounded-md shadow-sm">
                <input
                  type="email"
                  :value="profile.user.email"
                  disabled
                  class="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                />
                <span v-if="profile.user.emailVerified" class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verified
                </span>
                <span v-else class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Not Verified
                </span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Phone</label>
              <div class="mt-1 flex rounded-md shadow-sm">
                <input
                  type="tel"
                  :value="profile.user.phone"
                  disabled
                  class="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                />
                <span v-if="profile.user.phoneVerified" class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verified
                </span>
                <span v-else class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Not Verified
                </span>
              </div>
            </div>
          </div>

          <!-- Verification Actions -->
          <div v-if="!profile.user.emailVerified || !profile.user.phoneVerified" class="mt-6 p-4 bg-yellow-50 rounded-md">
            <h3 class="text-sm font-medium text-yellow-800">Verification Required</h3>
            <p class="mt-1 text-sm text-yellow-700">
              You must verify your email and phone to create listings.
            </p>
            <div class="mt-3 space-x-4">
              <NuxtLink v-if="!profile.user.emailVerified" to="/verify/email" class="text-sm font-medium text-yellow-800 underline">
                Verify Email
              </NuxtLink>
              <NuxtLink v-if="!profile.user.phoneVerified" to="/verify/phone" class="text-sm font-medium text-yellow-800 underline">
                Verify Phone
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Profile Information -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
          
          <form @submit.prevent="updateProfile" class="space-y-6">
            <div>
              <label for="displayName" class="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <input
                id="displayName"
                v-model="form.displayName"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your display name"
              />
            </div>

            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                v-model="form.bio"
                rows="4"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tell others about yourself..."
              />
              <p class="mt-2 text-sm text-gray-500">
                Brief description for your profile. This will be visible to other users.
              </p>
            </div>

            <div>
              <label for="location" class="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                id="location"
                v-model="form.location"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="City, Country"
              />
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="resetForm"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <button
                type="submit"
                :disabled="updating"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ updating ? 'Updating...' : 'Update Profile' }}
              </button>
            </div>

            <div v-if="updateError" class="text-sm text-red-600">
              {{ updateError }}
            </div>

            <div v-if="updateSuccess" class="text-sm text-green-600">
              Profile updated successfully!
            </div>
          </form>
        </div>
      </div>
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
  title: 'Profile Settings - ItaloConnection',
  description: 'Manage your profile information and account settings'
})

// ✅ Use useFetch for loading profile data
const { data: profile, pending: profilePending, error: profileError, refresh: refreshProfile } = await useFetch('/api/profile', {
  default: () => ({
    displayName: '',
    bio: '',
    location: '',
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

// Form state
const form = ref({
  displayName: '',
  bio: '',
  location: ''
})

// Update form state
const updating = ref(false)
const updateError = ref('')
const updateSuccess = ref(false)

// Initialize form with profile data
watch(profile, (newProfile) => {
  if (newProfile) {
    form.value = {
      displayName: newProfile.displayName || '',
      bio: newProfile.bio || '',
      location: newProfile.location || ''
    }
  }
}, { immediate: true })

// Reset form to original values
const resetForm = () => {
  if (profile.value) {
    form.value = {
      displayName: profile.value.displayName || '',
      bio: profile.value.bio || '',
      location: profile.value.location || ''
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
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      updateSuccess.value = false
    }, 3000)
  } catch (error: any) {
    updateError.value = error.data?.message || 'Failed to update profile'
  } finally {
    updating.value = false
  }
}
</script>