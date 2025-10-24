<template>
  <div class="flex h-screen overflow-hidden bg-gray-100">
    <!-- Sidebar -->
    <aside
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0"
    >
      <!-- Logo -->
      <div class="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        <NuxtLink to="/admin" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">I</span>
          </div>
          <span class="text-white font-bold text-xl">ItaloAdmin</span>
        </NuxtLink>
        <button
          @click="sidebarOpen = false"
          class="lg:hidden text-gray-400 hover:text-white"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4">
        <div class="px-3 space-y-1">
          <!-- Dashboard -->
          <NuxtLink
            to="/admin"
            @click="sidebarOpen = false"
            class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
            :class="isActive('/admin') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </NuxtLink>

          <!-- Menu Group: Management -->
          <div class="pt-4">
            <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Management
            </h3>
            
            <!-- Users -->
            <NuxtLink
              to="/admin/users"
              @click="sidebarOpen = false"
              class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
              :class="isActive('/admin/users') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Users
            </NuxtLink>

            <!-- Listings -->
            <NuxtLink
              to="/admin/listings"
              @click="sidebarOpen = false"
              class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
              :class="isActive('/admin/listings') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Listings
              <span v-if="stats?.pendingListings > 0" class="ml-auto bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {{ stats.pendingListings }}
              </span>
            </NuxtLink>

            <!-- Services -->
            <NuxtLink
              to="/admin/services"
              @click="sidebarOpen = false"
              class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
              :class="isActive('/admin/services') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Services
            </NuxtLink>

            <!-- Service Types -->
            <NuxtLink
              to="/admin/service-types"
              @click="sidebarOpen = false"
              class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
              :class="isActive('/admin/service-types') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Service Types
            </NuxtLink>

            <!-- Verify Users -->
            <NuxtLink
              to="/admin/verify"
              @click="sidebarOpen = false"
              class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
              :class="isActive('/admin/verify') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Verification
            </NuxtLink>

            <!-- User Reports -->
            <NuxtLink
              to="/admin/reports"
              @click="sidebarOpen = false"
              class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
              :class="isActive('/admin/reports') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Reports
              <span v-if="stats?.pendingReports > 0" class="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {{ stats.pendingReports }}
              </span>
            </NuxtLink>
          </div>

          <!-- Menu Group: Content -->
          <div class="pt-4">
            <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Content
            </h3>

            <!-- Announcements -->
            <NuxtLink
              to="/admin/announcements"
              @click="sidebarOpen = false"
              class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
              :class="isActive('/admin/announcements') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Announcements
            </NuxtLink>

            <!-- Audit Logs -->
            <NuxtLink
              to="/admin/logs"
              @click="sidebarOpen = false"
              class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
              :class="isActive('/admin/logs') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Audit Logs
            </NuxtLink>
          </div>
        </div>
      </nav>

      <!-- User Profile in Sidebar -->
      <div class="border-t border-gray-800 p-4">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <span class="text-white font-semibold">{{ userInitials }}</span>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium text-white">{{ userDisplayName }}</p>
            <p class="text-xs text-gray-400">Administrator</p>
          </div>
          <button @click="handleLogout" class="text-gray-400 hover:text-white">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 lg:hidden"
    ></div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Header -->
      <header class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
        <!-- Mobile menu button -->
        <button
          @click="sidebarOpen = true"
          class="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Breadcrumb -->
        <div class="hidden lg:flex items-center space-x-2 text-sm">
          <NuxtLink to="/admin" class="text-gray-500 hover:text-gray-700">
            Admin
          </NuxtLink>
          <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <span class="text-gray-900 font-medium">{{ currentPageName }}</span>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button class="relative text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span v-if="notificationCount > 0" class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <!-- View Site -->
          <NuxtLink
            to="/"
            class="hidden md:flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg class="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Site
          </NuxtLink>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { user } = useUserSession()

const sidebarOpen = ref(false)
const notificationCount = ref(0)
const stats = ref<any>(null)

// Computed properties
const userDisplayName = computed(() => {
  if (!user.value) return 'Admin'
  return (user.value as any).email?.split('@')[0] || 'Admin'
})

const userInitials = computed(() => {
  if (!user.value) return 'A'
  const name = userDisplayName.value
  return name.charAt(0).toUpperCase()
})

const currentPageName = computed(() => {
  const path = route.path
  if (path === '/admin') return 'Dashboard'
  if (path.includes('/users')) return 'Users'
  if (path.includes('/listings')) return 'Listings'
  if (path.includes('/verify')) return 'Verification'
  if (path.includes('/reports')) return 'Reports'
  if (path.includes('/announcements')) return 'Announcements'
  if (path.includes('/logs')) return 'Audit Logs'
  return 'Admin'
})

// Functions
const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await navigateTo('/auth/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Fetch dashboard stats
const fetchStats = async () => {
  try {
    const response = await $fetch('/api/admin/stats')
    stats.value = response
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  }
}

// Fetch notifications count
const fetchNotifications = async () => {
  try {
    const response = await $fetch('/api/notifications/unread-count')
    notificationCount.value = (response as any).count || 0
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
  }
}

// Initialize
onMounted(() => {
  fetchStats()
  fetchNotifications()
})

// Close sidebar on route change (mobile)
watch(() => route.path, () => {
  sidebarOpen.value = false
})
</script>

<style scoped>
/* Custom scrollbar for sidebar */
aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: #1f2937;
}

aside::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
