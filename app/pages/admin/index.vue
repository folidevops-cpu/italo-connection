<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p class="mt-2 text-gray-600">
        Manage users, listings, and platform operations
      </p>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Users -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats?.totalUsers || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Listings -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Listings</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats?.totalListings || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Listings -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Pending Review</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats?.pendingListings || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Unverified Users -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Unverified Users</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats?.unverifiedUsers || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white shadow rounded-lg p-6 mb-8">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink 
          to="/admin/users" 
          class="flex items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
        >
          <svg class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span class="text-sm font-medium text-blue-900">Manage Users</span>
        </NuxtLink>

        <NuxtLink 
          to="/admin/listings" 
          class="flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
        >
          <svg class="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm font-medium text-green-900">Review Listings</span>
        </NuxtLink>

        <NuxtLink 
          to="/admin/verify" 
          class="flex items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
        >
          <svg class="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span class="text-sm font-medium text-purple-900">Verify Users</span>
        </NuxtLink>

        <NuxtLink 
          to="/admin/logs" 
          class="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
        >
          <svg class="h-5 w-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-sm font-medium text-gray-900">Audit Logs</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
      <div v-if="pending" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-sm text-gray-500">Loading activity...</p>
      </div>
      <div v-else-if="error" class="text-center py-8 text-red-600">
        <p>Failed to load activity</p>
      </div>
      <div v-else-if="!recentActivity || recentActivity.length === 0" class="text-center py-8 text-gray-500">
        <p>No recent activity</p>
      </div>
      <div v-else class="space-y-4">
        <div 
          v-for="activity in recentActivity" 
          :key="activity.id"
          class="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg"
        >
          <div class="flex-shrink-0">
            <span 
              class="inline-flex items-center justify-center h-8 w-8 rounded-full"
              :class="{
                'bg-blue-100 text-blue-600': activity.action.includes('created'),
                'bg-green-100 text-green-600': activity.action.includes('approved'),
                'bg-red-100 text-red-600': activity.action.includes('rejected'),
                'bg-yellow-100 text-yellow-600': activity.action.includes('verified')
              }"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ activity.action }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(activity.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Enforce admin access
definePageMeta({
  middleware: 'admin'
})

// Set page meta
useSeoMeta({
  title: 'Admin Dashboard - ItaloConnection',
  description: 'Admin panel for managing users, listings, and platform operations'
})

// Fetch admin stats
const { data: stats, pending: statsPending, error: statsError } = await useFetch('/api/admin/stats', {
  default: () => ({
    totalUsers: 0,
    totalListings: 0,
    pendingListings: 0,
    unverifiedUsers: 0
  })
})

// Fetch recent activity
const { data: recentActivity, pending, error } = await useFetch('/api/admin/activity', {
  default: () => []
})

// Format date for display
const formatDate = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString()
}
</script>
