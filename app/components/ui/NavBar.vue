<template>
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and brand -->
        <div class="flex items-center">
          <NuxtLink to="/" class="text-xl font-bold text-gray-900">
            ItaloConnection
          </NuxtLink>
        </div>
        
        <!-- Navigation menu -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink 
            to="/listings" 
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Browse Listings
          </NuxtLink>
          
          <template v-if="loggedIn">
            <!-- Authenticated user menu -->
            <NuxtLink 
              to="/dashboard" 
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink 
              to="/listings/create" 
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Create Listing
            </NuxtLink>
            <NuxtLink 
              to="/profile" 
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Profile
            </NuxtLink>
            
            <!-- Notifications bell -->
            <div class="relative">
              <button 
                @click="toggleNotifications"
                class="text-gray-700 hover:text-gray-900 p-2 rounded-full"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span 
                  v-if="unreadCount > 0" 
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {{ unreadCount }}
                </span>
              </button>
              
              <!-- Notifications dropdown -->
              <div 
                v-if="showNotifications" 
                class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border"
              >
                <div class="px-4 py-2 text-sm text-gray-700 border-b">
                  <strong>Notifications</strong>
                </div>
                <!-- Notification items will be handled by a separate component -->
                <div class="px-4 py-2 text-sm text-gray-500">
                  No new notifications
                </div>
              </div>
            </div>
            
            <!-- User menu -->
            <div class="relative">
              <button 
                @click="toggleUserMenu"
                class="flex items-center text-sm rounded-full text-gray-700 hover:text-gray-900"
              >
                <!-- User avatar if available -->
                <img 
                  v-if="userAvatar" 
                  :src="userAvatar" 
                  :alt="userName"
                  class="w-8 h-8 rounded-full mr-2"
                />
                <div 
                  v-else 
                  class="w-8 h-8 rounded-full mr-2 bg-blue-600 flex items-center justify-center"
                >
                  <span class="text-white text-sm font-medium">
                    {{ userName.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <span class="mr-2">{{ userName }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- User dropdown -->
              <div 
                v-if="showUserMenu" 
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border"
              >
                <NuxtLink 
                  to="/profile" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </NuxtLink>
                <NuxtLink 
                  to="/listings/my" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Listings
                </NuxtLink>
                <button 
                  @click="handleLogout" 
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </template>
          
          <!-- Guest user menu -->
          <template v-else>
            <NuxtLink 
              to="/login" 
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </NuxtLink>
            <NuxtLink 
              to="/register" 
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Sign Up
            </NuxtLink>
          </template>
        </div>
        
        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button 
            @click="toggleMobileMenu"
            class="text-gray-700 hover:text-gray-900 p-2"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                v-if="!showMobileMenu"
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16" 
              />
              <path 
                v-else
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="showMobileMenu" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
          <NuxtLink 
            to="/listings" 
            class="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
          >
            Browse Listings
          </NuxtLink>
          
          <template v-if="loggedIn">
            <NuxtLink 
              to="/dashboard" 
              class="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink 
              to="/listings/create" 
              class="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
            >
              Create Listing
            </NuxtLink>
            <NuxtLink 
              to="/profile" 
              class="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
            >
              Profile
            </NuxtLink>
            <button 
              @click="handleLogout" 
              class="block w-full text-left text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
            >
              Sign out
            </button>
          </template>
          
          <template v-else>
            <NuxtLink 
              to="/login" 
              class="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
            >
              Login
            </NuxtLink>
            <NuxtLink 
              to="/register" 
              class="block bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium"
            >
              Sign Up
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// Use the global auth state composable
const { user, loggedIn, refreshUser, userName } = useAuthState()

// Force refresh on component mount to ensure latest session state
onMounted(async () => {
  await refreshUser()
})

// Reactive state for UI
const showNotifications = ref(false)
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const unreadCount = ref(0) // Will be populated from notifications API later

// Computed user avatar
const userAvatar = computed(() => {
  if (!user.value) return null
  const userData = user.value as any
  return userData.avatarUrl || null
})

// UI toggle functions
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  showUserMenu.value = false
  showNotifications.value = false
}

// Logout handler using standard nuxt-auth-utils
const handleLogout = async () => {
  showUserMenu.value = false
  showMobileMenu.value = false
  
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    
    // Clear the user session
    const { clear } = useUserSession()
    await clear()
    
    // Navigate to home page
    await navigateTo('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Close dropdowns when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      showNotifications.value = false
      showUserMenu.value = false
    }
  })
})
</script>