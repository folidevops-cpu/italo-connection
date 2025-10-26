<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
          <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Two-Factor Authentication
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Enter the 6-digit code sent to your email
      </p>
      <p class="mt-1 text-center text-xs text-gray-500">
        {{ maskedEmail }}
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Success Message -->
        <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div class="flex">
            <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <p class="ml-3 text-sm text-green-700">{{ successMessage }}</p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <p class="ml-3 text-sm text-red-700">{{ errorMessage }}</p>
          </div>
        </div>

        <form @submit.prevent="verifyCode" class="space-y-6">
          <!-- Code Input -->
          <div>
            <label for="code" class="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <div class="mt-1">
              <input
                v-model="code"
                id="code"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength="6"
                required
                placeholder="000000"
                :disabled="isVerifying"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest font-mono disabled:opacity-50"
                @input="formatCode"
              />
            </div>
            <p class="mt-2 text-xs text-gray-500 text-center">
              Enter the 6-digit code from your email
            </p>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="isVerifying || code.length !== 6"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isVerifying">Verify Code</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            </button>
          </div>
        </form>

        <!-- Resend Code -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Didn't receive the code?</span>
            </div>
          </div>

          <div class="mt-6 text-center">
            <button
              @click="resendCode"
              :disabled="isResending || resendCooldown > 0"
              class="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="resendCooldown > 0">
                Resend code in {{ resendCooldown }}s
              </span>
              <span v-else-if="!isResending">
                Resend code
              </span>
              <span v-else>
                Sending...
              </span>
            </button>
          </div>
        </div>

        <!-- Back to Login -->
        <div class="mt-6">
          <NuxtLink
            to="/login"
            class="w-full flex justify-center items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to login
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Two-Factor Authentication - ItaloConnection',
  description: 'Enter your verification code'
})

const route = useRoute()
const router = useRouter()

const code = ref('')
const isVerifying = ref(false)
const isResending = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const resendCooldown = ref(0)

// Get userId and email from query params
const userId = ref(route.query.userId as string || '')
const email = ref(route.query.email as string || '')

// Mask email for display
const maskedEmail = computed(() => {
  if (!email.value) return ''
  const [localPart, domain] = email.value.split('@')
  const maskedLocal = localPart.substring(0, 2) + '***'
  return `${maskedLocal}@${domain}`
})

// Redirect if no userId
onMounted(() => {
  if (!userId.value || !email.value) {
    router.push('/login')
  }
})

// Format code input (numbers only)
const formatCode = (event: Event) => {
  const input = event.target as HTMLInputElement
  code.value = input.value.replace(/[^0-9]/g, '')
}

// Verify code
const verifyCode = async () => {
  if (code.value.length !== 6) {
    errorMessage.value = 'Please enter a 6-digit code'
    return
  }

  isVerifying.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await $fetch('/api/auth/verify-2fa', {
      method: 'POST',
      body: {
        userId: userId.value,
        code: code.value
      }
    })

    successMessage.value = 'Verification successful! Redirecting...'
    
    // Redirect to dashboard after short delay
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || 'Invalid or expired code. Please try again.'
    code.value = '' // Clear the code
  } finally {
    isVerifying.value = false
  }
}

// Resend code
const resendCode = async () => {
  if (resendCooldown.value > 0) return

  isResending.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Call login endpoint again to resend code
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        // We need the password again, but we don't have it
        // So we'll create a separate resend endpoint
      }
    })

    successMessage.value = 'A new code has been sent to your email'
    
    // Start cooldown timer (60 seconds)
    resendCooldown.value = 60
    const interval = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0) {
        clearInterval(interval)
      }
    }, 1000)
  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || 'Failed to resend code. Please try logging in again.'
  } finally {
    isResending.value = false
  }
}
</script>
