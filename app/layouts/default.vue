<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <UiNavBar />
    
    <!-- Main content area -->
    <main>
      <slot />
    </main>
    
    <!-- Footer (optional) -->
    <footer class="bg-white border-t mt-auto">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="text-center text-gray-500 text-sm">
          <p>&copy; 2025 ItaloConnection. All rights reserved.</p>
          <div class="mt-2 space-x-4">
            <NuxtLink to="/privacy" class="hover:text-gray-700">Privacy Policy</NuxtLink>
            <NuxtLink to="/terms" class="hover:text-gray-700">Terms of Service</NuxtLink>
            <NuxtLink to="/contact" class="hover:text-gray-700">Contact</NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Default layout - includes navbar for all pages using this layout
// Pages can override this by specifying a different layout in definePageMeta
</script>