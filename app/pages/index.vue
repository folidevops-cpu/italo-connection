<template>
  <div>
    <!-- Hero section -->
    <section class="bg-blue-600 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          Welcome to ItaloConnection
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-blue-100">
          Your marketplace for buying, selling, and finding rooms to rent
        </p>
        <div class="space-x-4">
          <NuxtLink 
            to="/listings" 
            class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse Listings
          </NuxtLink>
          <NuxtLink 
            to="/register" 
            class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Get Started
          </NuxtLink>
        </div>
      </div>
    </section>
    
    <!-- Features section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            What You Can Do
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            ItaloConnection makes it easy to buy, sell, and find accommodation in your area.
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Sell Items -->
          <div class="text-center p-6">
            <div class="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Sell Items</h3>
            <p class="text-gray-600">
              List your items for sale with photos and detailed descriptions. Reach buyers in your area easily.
            </p>
          </div>
          
          <!-- Find Rooms -->
          <div class="text-center p-6">
            <div class="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Find Rooms</h3>
            <p class="text-gray-600">
              Discover single rooms or shared accommodation. Perfect for students and professionals.
            </p>
          </div>
          
          <!-- Safe & Verified -->
          <div class="text-center p-6">
            <div class="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Safe & Verified</h3>
            <p class="text-gray-600">
              All users verify their email and phone. Listings are moderated for your safety and security.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA section -->
    <section class="bg-gray-100 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          Ready to Get Started?
        </h2>
        <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our community of buyers, sellers, and renters. Create your account today and start exploring.
        </p>
        <NuxtLink 
          to="/register" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Create Account
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Homepage - uses default layout with navbar
definePageMeta({
  layout: 'default'
})

// SEO meta tags
useSeoMeta({
  title: 'ItaloConnection - Marketplace for Items and Rooms',
  ogDescription: 'Buy, sell items and find rooms to rent in your area. Safe, verified marketplace platform.',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image'
})
</script>