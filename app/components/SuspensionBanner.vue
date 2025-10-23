<template>
  <div v-if="isSuspended" class="bg-red-600 text-white">
    <div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between flex-wrap">
        <div class="w-0 flex-1 flex items-center">
          <span class="flex p-2 rounded-lg bg-red-800">
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </span>
          <p class="ml-3 font-medium truncate">
            <span class="md:hidden">Your account is suspended</span>
            <span class="hidden md:inline">
              Your account has been suspended. {{ suspensionReason || 'Contact support for more information.' }}
            </span>
          </p>
        </div>
        <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
          <NuxtLink
            to="/contact"
            class="-mr-1 flex p-2 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
          >
            <span class="sr-only">Contact Support</span>
            <span class="text-sm font-medium">Contact Support</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useUserSession()

const isSuspended = computed(() => {
  const userData = user.value as any
  return userData?.suspended === true
})

const suspensionReason = computed(() => {
  const userData = user.value as any
  return userData?.suspensionReason
})
</script>
