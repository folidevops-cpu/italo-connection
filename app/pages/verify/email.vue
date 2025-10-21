<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Verify Your Email</h1>
        <p class="mt-2 text-gray-600">
          Please check your email and enter the verification code we sent to:
        </p>
        <p class="mt-1 font-medium text-blue-600">{{ email }}</p>
      </div>

      <div class="bg-white py-8 px-6 shadow rounded-lg">
        <form @submit.prevent="verifyCode" class="space-y-6">
          <div>
            <label for="code" class="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              id="code"
              v-model="verificationCode"
              type="text"
              required
              maxlength="6"
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter 6-digit code"
            />
          </div>

          <div>
            <button
              type="submit"
              :disabled="submitting"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ submitting ? 'Verifying...' : 'Verify Email' }}
            </button>
          </div>

          <div v-if="error" class="text-sm text-red-600 text-center">
            {{ error }}
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Didn't receive the code?
            <button
              @click="resendCode"
              :disabled="resending || cooldown > 0"
              class="font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400"
            >
              {{ cooldown > 0 ? `Resend in ${cooldown}s` : resending ? 'Sending...' : 'Resend code' }}
            </button>
          </p>
        </div>

        <div class="mt-4 text-center">
          <NuxtLink 
            to="/profile" 
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Profile
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set page meta
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

useSeoMeta({
  title: 'Verify Email - ItaloConnection',
  description: 'Verify your email address to complete your account setup.'
})

// Get user session
const { data: user } = await getUserSession()
const email = computed(() => user.value?.user?.email || 'your email')

// Form state
const verificationCode = ref('')
const submitting = ref(false)
const error = ref('')

// Resend functionality
const resending = ref(false)
const cooldown = ref(0)

// Countdown timer
let countdownInterval: NodeJS.Timeout | null = null

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

// Verify code
const verifyCode = async () => {
  if (!verificationCode.value || verificationCode.value.length !== 6) {
    error.value = 'Please enter a valid 6-digit code'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    await $fetch('/api/verify/email', {
      method: 'POST',
      body: {
        code: verificationCode.value
      }
    })

    // Redirect to dashboard on success
    await navigateTo('/')
  } catch (err: any) {
    error.value = err.data?.message || 'Invalid verification code'
  } finally {
    submitting.value = false
  }
}

// Resend verification code
const resendCode = async () => {
  if (resending.value || cooldown.value > 0) return

  resending.value = true
  error.value = ''

  try {
    await $fetch('/api/verify/email/resend', {
      method: 'POST'
    })

    // Start cooldown
    cooldown.value = 60
    countdownInterval = setInterval(() => {
      cooldown.value--
      if (cooldown.value <= 0 && countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
    }, 1000)

  } catch (err: any) {
    error.value = err.data?.message || 'Failed to resend code'
  } finally {
    resending.value = false
  }
}

// Auto-focus on code input
onMounted(() => {
  const codeInput = document.getElementById('code')
  if (codeInput) {
    codeInput.focus()
  }
})
</script>