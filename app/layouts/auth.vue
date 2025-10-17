<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Brand logo/title -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">
          ItaloConnection
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Your marketplace for items and rooms
        </p>
      </div>
      
      <!-- Auth form content -->
      <slot />
      
      <!-- Back to home link -->
      <div class="text-center">
        <NuxtLink 
          to="/" 
          class="text-sm text-blue-600 hover:text-blue-500"
        >
          ← Back to home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Auth layout - clean layout for login/register pages without navbar
// This provides a focused experience for authentication flows
</script>