<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <!-- Error Icon -->
      <div class="flex justify-center mb-6">
        <div class="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center">
          <svg 
            class="h-12 w-12 text-red-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              v-if="is404"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
            <path 
              v-else
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
      </div>

      <!-- Error Code -->
      <h1 class="text-6xl font-bold text-gray-900 mb-4">
        {{ statusCode }}
      </h1>

      <!-- Error Message -->
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">
        {{ errorTitle }}
      </h2>

      <p class="text-gray-600 mb-8">
        {{ errorMessage }}
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="handleBack"
          class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>

        <NuxtLink
          to="/"
          class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Go Home
        </NuxtLink>
      </div>

      <!-- Additional Help for 404 -->
      <div v-if="is404" class="mt-8 pt-8 border-t border-gray-200">
        <p class="text-sm text-gray-500 mb-4">Looking for something specific?</p>
        <div class="flex flex-col sm:flex-row gap-2 justify-center text-sm">
          <NuxtLink to="/listings" class="text-blue-600 hover:text-blue-800 hover:underline">
            Browse Listings
          </NuxtLink>
          <span class="hidden sm:inline text-gray-400">•</span>
          <NuxtLink to="/services" class="text-blue-600 hover:text-blue-800 hover:underline">
            View Services
          </NuxtLink>
          <span class="hidden sm:inline text-gray-400">•</span>
          <NuxtLink to="/dashboard" class="text-blue-600 hover:text-blue-800 hover:underline">
            Dashboard
          </NuxtLink>
        </div>
      </div>

      <!-- Development Info -->
      <div v-if="isDevelopment && error?.stack" class="mt-8 pt-8 border-t border-gray-200">
        <details class="text-left">
          <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 mb-2">
            🔧 Development Details
          </summary>
          <div class="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs">
            <p class="font-semibold mb-2">{{ error.message }}</p>
            <pre class="whitespace-pre-wrap">{{ error.stack }}</pre>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ErrorProps {
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
    stack?: string
    url?: string
  }
}

const props = defineProps<ErrorProps>()

// Computed properties
const statusCode = computed(() => props.error?.statusCode || 500)
const is404 = computed(() => statusCode.value === 404)
const isDevelopment = computed(() => process.dev)

const errorTitle = computed(() => {
  switch (statusCode.value) {
    case 404:
      return 'Page Not Found'
    case 401:
      return 'Unauthorized'
    case 403:
      return 'Forbidden'
    case 500:
      return 'Internal Server Error'
    case 503:
      return 'Service Unavailable'
    default:
      return 'An Error Occurred'
  }
})

const errorMessage = computed(() => {
  if (props.error?.statusMessage) {
    return props.error.statusMessage
  }

  switch (statusCode.value) {
    case 404:
      return "Sorry, the page you're looking for doesn't exist or has been moved."
    case 401:
      return 'You need to be logged in to access this page.'
    case 403:
      return "You don't have permission to access this resource."
    case 500:
      return 'Something went wrong on our end. Please try again later.'
    case 503:
      return 'The service is temporarily unavailable. Please try again in a few moments.'
    default:
      return props.error?.message || 'An unexpected error occurred. Please try again.'
  }
})

// SEO Meta
useSeoMeta({
  title: `${statusCode.value} - ${errorTitle.value}`,
  description: errorMessage.value
})

// Methods
const handleBack = () => {
  // Try to go back in history, or go home if no history
  if (window.history.length > 1) {
    window.history.back()
  } else {
    navigateTo('/')
  }
}

// Clear error and navigate home
const handleError = () => clearError({ redirect: '/' })
</script>
