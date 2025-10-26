<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <NuxtLink to="/" class="flex justify-center">
        <h1 class="text-4xl font-bold text-blue-600">ItaloConnection</h1>
      </NuxtLink>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Set new password
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Enter your new password below.
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Loading State -->
        <div v-if="verifying" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Verifying reset token...</p>
        </div>

        <!-- Invalid Token -->
        <div v-else-if="tokenError" class="text-center py-8">
          <div class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ tokenError }}</p>
              </div>
            </div>
          </div>
          <NuxtLink to="/forgot-password" class="text-blue-600 hover:text-blue-500 font-medium">
            Request a new reset link
          </NuxtLink>
        </div>

        <!-- Success Message -->
        <div v-else-if="passwordReset" class="text-center py-8">
          <div class="text-green-500 text-5xl mb-4">✓</div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Password reset successful!</h3>
          <p class="text-gray-600 mb-6">You can now log in with your new password.</p>
          <NuxtLink 
            to="/login"
            class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to login
          </NuxtLink>
        </div>

        <!-- Reset Form -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                type="password"
                autocomplete="new-password"
                required
                minlength="8"
                placeholder="••••••••"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.password }"
              />
              <p v-if="errors.password" class="mt-2 text-sm text-red-600">
                {{ errors.password }}
              </p>
              <p class="mt-2 text-xs text-gray-500">
                Must be at least 8 characters long
              </p>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                minlength="8"
                placeholder="••••••••"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.confirmPassword }"
              />
              <p v-if="errors.confirmPassword" class="mt-2 text-sm text-red-600">
                {{ errors.confirmPassword }}
              </p>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errors.general" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ errors.general }}</p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="submitting"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="submitting" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting password...
              </span>
              <span v-else>Reset password</span>
            </button>
          </div>
        </form>

        <!-- Back to Login -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
                  Back to login
                </NuxtLink>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

useSeoMeta({
  title: 'Reset Password - ItaloConnection',
  description: 'Set your new ItaloConnection password'
})

const route = useRoute()
const token = route.query.token as string

const form = ref({
  password: '',
  confirmPassword: ''
})

const errors = ref<{
  password?: string
  confirmPassword?: string
  general?: string
}>({})

const verifying = ref(true)
const tokenError = ref('')
const submitting = ref(false)
const passwordReset = ref(false)

// Verify token on mount
onMounted(async () => {
  if (!token) {
    tokenError.value = 'No reset token provided. Please request a new password reset.'
    verifying.value = false
    return
  }

  try {
    await $fetch('/api/auth/verify-reset-token', {
      method: 'POST',
      body: { token }
    })
    verifying.value = false
  } catch (error: any) {
    console.error('Token verification error:', error)
    tokenError.value = error.data?.message || 'Invalid or expired reset token. Please request a new password reset.'
    verifying.value = false
  }
})

const handleSubmit = async () => {
  errors.value = {}
  
  // Validation
  if (!form.value.password) {
    errors.value.password = 'Password is required'
    return
  }

  if (form.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters long'
    return
  }

  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password'
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
    return
  }

  submitting.value = true

  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: {
        token,
        password: form.value.password
      }
    })

    passwordReset.value = true
  } catch (error: any) {
    console.error('Password reset error:', error)
    errors.value.general = error.data?.message || 'Failed to reset password. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
