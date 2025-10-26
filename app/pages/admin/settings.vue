<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
          Admin Settings
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Manage your admin account settings
        </p>
      </div>

      <!-- 2FA Info Card -->
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="sm:flex sm:items-start sm:justify-between">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Two-Factor Authentication
              </h3>
              <div class="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  As an admin user, you are required to verify your identity with a code sent to your email each time you log in.
                </p>
              </div>
              <div class="mt-4">
                <div class="flex items-center">
                  <svg class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="ml-2 text-sm font-medium text-green-700">
                    Two-Factor Authentication is enabled for all admin accounts
                  </span>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
              <span class="inline-flex items-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50">
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Active
              </span>
            </div>
          </div>
          
          <div class="mt-6 border-t border-gray-200 pt-6">
            <h4 class="text-sm font-medium text-gray-900 mb-3">How it works:</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-start">
                <span class="font-semibold mr-2">1.</span>
                Enter your email and password on the login page
              </li>
              <li class="flex items-start">
                <span class="font-semibold mr-2">2.</span>
                A 6-digit verification code will be sent to your email
              </li>
              <li class="flex items-start">
                <span class="font-semibold mr-2">3.</span>
                Enter the code on the verification page (code expires in 10 minutes)
              </li>
              <li class="flex items-start">
                <span class="font-semibold mr-2">4.</span>
                Access your admin dashboard after successful verification
              </li>
            </ul>
          </div>

          <div class="mt-6 border-t border-gray-200 pt-6">
            <div class="rounded-md bg-blue-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3 flex-1">
                  <p class="text-sm text-blue-700">
                    <strong>Security Tip:</strong> Never share your verification codes with anyone. ItaloConnection staff will never ask for your verification code.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

useSeoMeta({
  title: 'Admin Settings - ItaloConnection'
})
</script>
