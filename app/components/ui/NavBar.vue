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
          
          <NuxtLink 
            to="/services" 
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Services
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
              to="/services/create" 
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Offer Service
            </NuxtLink>
            <!-- <NuxtLink 
              to="/profile" 
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Profile
            </NuxtLink> -->
            
            <!-- Admin link (only for admin users) -->
            <NuxtLink 
              v-if="isAdmin"
              to="/admin" 
              class="text-purple-600 hover:text-purple-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Admin
            </NuxtLink>
            
            <!-- Notification Bell Component -->
            <NotificationBell />
            
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
                <NuxtLink 
                  to="/services/my" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Services
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
          
          <NuxtLink 
            to="/services" 
            class="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
          >
            Services
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
              to="/services/create" 
              class="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
            >
              Offer Service
            </NuxtLink>
            <NuxtLink 
              to="/listings/my" 
              class="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
            >
              Your Listings
            </NuxtLink>
            <NuxtLink 
              to="/services/my" 
              class="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
            >
              My Services
            </NuxtLink>
            <NuxtLink 
              to="/profile" 
              class="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
            >
              Profile
            </NuxtLink>
            <NuxtLink 
              to="/notifications" 
              class="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
            >
              Notifications
            </NuxtLink>
            <NuxtLink 
              v-if="isAdmin"
              to="/admin" 
              class="block text-purple-600 hover:text-purple-900 px-3 py-2 rounded-md text-base font-medium"
            >
              Admin
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
const showUserMenu = ref(false)
const showMobileMenu = ref(false)

// Computed user avatar
const userAvatar = computed(() => {
  if (!user.value) return null
  const userData = user.value as any
  return userData.avatarUrl || null
})

// Check if user is admin
const isAdmin = computed(() => {
  if (!user.value) return false
  const userData = user.value as any
  return userData.role === 'ADMIN'
})

// UI toggle functions
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  showUserMenu.value = false
}

// Logout handler using standard nuxt-auth-utils
const handleLogout = async () => {
  showUserMenu.value = false
  showMobileMenu.value = false
  
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    

    // Clear dismissed announcement from session storage
    sessionStorage.removeItem('dismissedAnnouncementId')
    
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
      showUserMenu.value = false
    }
  })
})
</script>