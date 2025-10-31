<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <NuxtLink to="/" class="flex justify-center">
          <h2 class="text-3xl font-extrabold text-gray-900">ItaloConnection</h2>
        </NuxtLink>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            sign in to existing account
          </NuxtLink>
        </p>
      </div>
      
      <form @submit.prevent="handleRegister" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="displayName" class="block text-sm font-medium text-gray-700">
              Display Name
            </label>
            <input
              id="displayName"
              v-model="form.displayName"
              name="displayName"
              type="text"
              autocomplete="name"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter your display name (optional)"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address *
            </label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password *
            </label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.acceptTerms"
            name="terms"
            type="checkbox"
            required
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            I agree to the 
            <NuxtLink to="/terms" class="text-blue-600 hover:text-blue-500">Terms of Service</NuxtLink>
            and 
            <NuxtLink to="/privacy" class="text-blue-600 hover:text-blue-500">Privacy Policy</NuxtLink>
          </label>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>
        </div>

        <div v-if="error" class="mt-3 text-center text-sm text-red-600">
          {{ error }}
        </div>

        <div v-if="success" class="mt-3 text-center text-sm text-green-600">
          {{ success }}
        </div>
      </form>

      <!-- Divider -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
      </div>

      <!-- Google OAuth Button -->
      <div class="mt-6">
        <a
          href="/api/auth/google"
          class="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Use auth layout (no navbar)
definePageMeta({
  layout: 'auth'
})

// Set page meta
useSeoMeta({
  title: 'Sign Up - ItaloConnection',
  description: 'Create your ItaloConnection account to start buying, selling, and finding rooms'
})

const form = ref({
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const loading = ref(false)
const error = ref('')
const success = ref('')

// Check if already logged in
const { loggedIn } = useUserSession()
if (loggedIn.value) {
  await navigateTo('/')
}

// Form validation
const isFormValid = computed(() => {
  return form.value.email && 
         form.value.password && 
         form.value.confirmPassword && 
         form.value.password === form.value.confirmPassword &&
         form.value.acceptTerms
})

// ✅ Use $fetch for signup action
const handleRegister = async () => {
  if (!isFormValid.value) {
    error.value = 'Please fill in all required fields and accept the terms'
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    // Create the account
    await $fetch('/api/auth/signup', {
      method: 'POST',
      body: {
        email: form.value.email,
        password: form.value.password,
        displayName: form.value.displayName
      }
    })
    
    // Automatically log in after registration
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: form.value.email,
        password: form.value.password
      }
    })
    
    // Refresh the user session after successful login
    const { fetch } = useUserSession()
    await fetch()
    
    success.value = 'Account created successfully! Redirecting...'
    
    // Navigate after delay
    setTimeout(async () => {
      await navigateTo('/')
    }, 1500)
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to create account'
  } finally {
    loading.value = false
  }
}
</script>