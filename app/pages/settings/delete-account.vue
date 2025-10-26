<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Delete Your Account</h1>
        <p class="text-gray-600">This action is serious and cannot be easily undone</p>
      </div>

      <!-- Warning Card -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-red-200">
        <div class="flex items-start space-x-3 mb-4">
          <svg class="w-6 h-6 text-red-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Before you delete your account:</h2>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-start">
                <span class="text-red-500 mr-2">•</span>
                <span>All your <strong>listings</strong> will be hidden and marked as deleted</span>
              </li>
              <li class="flex items-start">
                <span class="text-red-500 mr-2">•</span>
                <span>All your <strong>services</strong> will be hidden and marked as deleted</span>
              </li>
              <li class="flex items-start">
                <span class="text-red-500 mr-2">•</span>
                <span>Your <strong>profile</strong> will no longer be accessible to others</span>
              </li>
              <li class="flex items-start">
                <span class="text-red-500 mr-2">•</span>
                <span>You will be <strong>logged out</strong> immediately</span>
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2">•</span>
                <span>You can <strong>recover your account within 30 days</strong> by contacting support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="deleteSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <div>
            <p class="font-semibold text-green-900">Account Deleted Successfully</p>
            <p class="text-sm text-green-700">You will be redirected to the home page...</p>
          </div>
        </div>
      </div>

      <!-- Delete Form -->
      <div v-else class="bg-white rounded-lg shadow-lg p-6">
        <form @submit.prevent="handleDelete" class="space-y-6">
          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm Your Password <span class="text-red-500">*</span>
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter your password to confirm"
            />
          </div>

          <!-- Reason Selection -->
          <div>
            <label for="reason" class="block text-sm font-medium text-gray-700 mb-2">
              Why are you leaving? (Optional)
            </label>
            <select
              id="reason"
              v-model="form.reason"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select a reason...</option>
              <option value="Not using the service">Not using the service</option>
              <option value="Privacy concerns">Privacy concerns</option>
              <option value="Found a better alternative">Found a better alternative</option>
              <option value="Too many emails/notifications">Too many emails/notifications</option>
              <option value="Difficult to use">Difficult to use</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Custom Reason -->
          <div v-if="form.reason === 'Other'">
            <label for="customReason" class="block text-sm font-medium text-gray-700 mb-2">
              Please specify
            </label>
            <textarea
              id="customReason"
              v-model="form.customReason"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Tell us more..."
            ></textarea>
          </div>

          <!-- Confirmation Checkbox -->
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <label class="flex items-start cursor-pointer">
              <input
                v-model="form.confirmed"
                type="checkbox"
                class="mt-1 h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                required
              />
              <span class="ml-3 text-sm text-gray-700">
                I understand that deleting my account will hide all my content and I will be logged out immediately. I can recover my account within 30 days by contacting support.
              </span>
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <p class="text-sm text-red-700">{{ error }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col-reverse sm:flex-row gap-3">
            <NuxtLink
              to="/profile"
              class="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center"
            >
              Cancel
            </NuxtLink>
            <button
              type="submit"
              :disabled="loading || !form.confirmed"
              class="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ loading ? 'Deleting Account...' : 'Delete My Account' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Recovery Information -->
      <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start space-x-3">
          <svg class="w-6 h-6 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <div class="text-sm text-blue-900">
            <p class="font-semibold mb-1">Need to recover your account?</p>
            <p class="text-blue-700">Contact our support team within 30 days at <a href="mailto:support@italoconnection.com" class="underline">support@italoconnection.com</a></p>
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

const form = ref({
  password: '',
  reason: '',
  customReason: '',
  confirmed: false
})

const loading = ref(false)
const error = ref('')
const deleteSuccess = ref(false)

const handleDelete = async () => {
  if (!form.value.confirmed) {
    error.value = 'Please confirm that you understand the consequences'
    return
  }

  if (!form.value.password) {
    error.value = 'Password is required'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const reason = form.value.reason === 'Other' ? form.value.customReason : form.value.reason

    const response = await $fetch('/api/auth/delete-account', {
      method: 'POST',
      body: {
        password: form.value.password,
        reason: reason
      }
    })

    deleteSuccess.value = true

    // Redirect to home page after 2 seconds
    setTimeout(() => {
      navigateTo('/')
    }, 2000)

  } catch (err: any) {
    error.value = err.data?.statusMessage || 'Failed to delete account. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
