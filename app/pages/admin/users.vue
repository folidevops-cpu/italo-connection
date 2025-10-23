<template>
  <div class="p-4 md:p-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
      <p class="mt-1 text-gray-600">
        View and manage all registered users
      </p>
    </div>

    <!-- Filters -->
    <div class="bg-white p-6 rounded-lg shadow mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input 
            v-model="filters.search" 
            type="text" 
            placeholder="Email or name..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="debouncedSearch"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select 
            v-model="filters.role" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          >
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select 
            v-model="filters.status" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          >
            <option value="">All Users</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
        <div class="flex items-end">
          <button 
            @click="resetFilters"
            class="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div v-if="pending" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading users...</p>
      </div>

      <div v-else-if="error" class="text-center py-12 text-red-600">
        <p>Failed to load users</p>
        <button @click="refresh" class="mt-4 text-blue-600 hover:text-blue-700">
          Try again
        </button>
      </div>

      <div v-else-if="!users || users.length === 0" class="text-center py-12 text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <p class="mt-2">No users found</p>
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Joined
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {{ user.profile?.displayName?.charAt(0) || user.email.charAt(0).toUpperCase() }}
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ user.profile?.displayName || 'No name' }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ user.id.slice(0, 8) }}...
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ user.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-purple-100 text-purple-800': user.role === 'ADMIN',
                  'bg-gray-100 text-gray-800': user.role === 'USER'
                }"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center space-x-2">
                <span 
                  v-if="user.suspended"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                  :title="user.suspensionReason"
                >
                  🚫 Suspended
                </span>
                <span 
                  v-else
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': user.emailVerified,
                    'bg-yellow-100 text-yellow-800': !user.emailVerified
                  }"
                >
                  {{ user.emailVerified ? '✓ Verified' : '⚠ Unverified' }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(user.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button
                v-if="!user.emailVerified && !user.suspended"
                @click="verifyUser(user.id)"
                class="text-green-600 hover:text-green-900"
                :disabled="verifying === user.id"
              >
                {{ verifying === user.id ? 'Verifying...' : 'Verify' }}
              </button>
              <button
                v-if="!user.suspended && user.id !== currentUserId && user.role !== 'ADMIN'"
                @click="suspendUser(user.id)"
                class="text-orange-600 hover:text-orange-900"
                :disabled="suspending === user.id"
              >
                {{ suspending === user.id ? 'Suspending...' : 'Suspend' }}
              </button>
              <button
                v-if="user.suspended"
                @click="unsuspendUser(user.id)"
                class="text-blue-600 hover:text-blue-900"
                :disabled="unsuspending === user.id"
              >
                {{ unsuspending === user.id ? 'Restoring...' : 'Restore' }}
              </button>
              <button
                v-if="user.role === 'USER' && !user.suspended"
                @click="makeAdmin(user.id)"
                class="text-purple-600 hover:text-purple-900"
                :disabled="updating === user.id"
              >
                {{ updating === user.id ? 'Updating...' : 'Make Admin' }}
              </button>
              <button
                v-if="user.role === 'ADMIN' && user.id !== currentUserId"
                @click="removeAdmin(user.id)"
                class="text-yellow-600 hover:text-yellow-900"
                :disabled="updating === user.id"
              >
                {{ updating === user.id ? 'Updating...' : 'Remove Admin' }}
              </button>
              <button
                v-if="user.id !== currentUserId"
                @click="showDeleteModal(user)"
                class="text-red-600 hover:text-red-900"
                :disabled="deleting === user.id"
              >
                {{ deleting === user.id ? 'Deleting...' : 'Delete' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="!hasMore"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing page <span class="font-medium">{{ currentPage }}</span>
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="!hasMore"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mx-auto">
            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mt-4">
            Delete User Account
          </h3>
          <div class="mt-4">
            <p class="text-sm text-gray-500 mb-4">
              Are you sure you want to permanently delete <strong>{{ userToDelete?.email }}</strong>?
            </p>
            <p class="text-sm text-red-600 font-medium mb-4">
              This will delete:
            </p>
            <ul class="text-sm text-gray-600 list-disc list-inside mb-4 space-y-1">
              <li>User profile and account data</li>
              <li>All listings created by this user</li>
              <li>All images uploaded by this user</li>
              <li>All notifications</li>
            </ul>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Reason for deletion (required):
              </label>
              <textarea
                v-model="deleteReason"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter reason for deleting this account..."
              ></textarea>
            </div>
          </div>
          <div class="mt-6 flex gap-3">
            <button
              @click="closeDeleteModal"
              :disabled="deleting !== null"
              class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              @click="deleteUser"
              :disabled="deleting !== null || !deleteReason.trim()"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium disabled:opacity-50"
            >
              {{ deleting ? 'Deleting...' : 'Delete Permanently' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Enforce admin access
definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

// Set page meta
useSeoMeta({
  title: 'User Management - Admin Dashboard',
  description: 'Manage all registered users'
})

// Get current user ID to prevent self-demotion
const { user } = useUserSession()
const currentUserId = computed(() => (user.value as any)?.id)

// Filters
const filters = ref({
  search: '',
  role: '',
  status: ''
})

// Pagination
const currentPage = ref(1)
const pageSize = ref(20)
const hasMore = ref(true)

// Loading states
const verifying = ref<string | null>(null)
const updating = ref<string | null>(null)
const suspending = ref<string | null>(null)
const unsuspending = ref<string | null>(null)
const deleting = ref<string | null>(null)

// Delete modal state
const deleteModalOpen = ref(false)
const userToDelete = ref<any>(null)
const deleteReason = ref('')

// Build query params
const queryParams = computed(() => {
  const params: any = {
    page: currentPage.value,
    limit: pageSize.value
  }
  if (filters.value.search) params.search = filters.value.search
  if (filters.value.role) params.role = filters.value.role
  if (filters.value.status) params.status = filters.value.status
  return params
})

// Fetch users
const { data: users, pending, error, refresh } = await useFetch('/api/admin/users', {
  query: queryParams,
  default: () => [],
  watch: [queryParams]
})

// Debounced search
let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    refresh()
  }, 500)
}

// Apply filters
const applyFilters = () => {
  currentPage.value = 1
  refresh()
}

// Reset filters
const resetFilters = () => {
  filters.value = {
    search: '',
    role: '',
    status: ''
  }
  currentPage.value = 1
  refresh()
}

// Pagination
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (hasMore.value) {
    currentPage.value++
  }
}

// Watch users data to update hasMore
watch(users, (newUsers) => {
  hasMore.value = newUsers && newUsers.length === pageSize.value
})

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Verify user
const verifyUser = async (userId: string) => {
  if (!confirm('Are you sure you want to manually verify this user?')) return
  
  verifying.value = userId
  try {
    await $fetch(`/api/admin/users/${userId}/verify`, {
      method: 'POST'
    })
    await refresh()
  } catch (error: any) {
    alert('Failed to verify user: ' + error.message)
  } finally {
    verifying.value = null
  }
}

// Make user admin
const makeAdmin = async (userId: string) => {
  if (!confirm('Are you sure you want to make this user an admin?')) return
  
  updating.value = userId
  try {
    await $fetch(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      body: { role: 'ADMIN' }
    })
    await refresh()
  } catch (error: any) {
    alert('Failed to update user role: ' + error.message)
  } finally {
    updating.value = null
  }
}

// Remove admin role
const removeAdmin = async (userId: string) => {
  if (!confirm('Are you sure you want to remove admin role from this user?')) return
  
  updating.value = userId
  try {
    await $fetch(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      body: { role: 'USER' }
    })
    await refresh()
  } catch (error: any) {
    alert('Failed to update user role: ' + error.message)
  } finally {
    updating.value = null
  }
}

// Suspend user
const suspendUser = async (userId: string) => {
  const reason = prompt('Please provide a reason for suspending this account:')
  if (!reason) return
  
  suspending.value = userId
  try {
    await $fetch(`/api/admin/users/${userId}/suspend`, {
      method: 'POST',
      body: { reason }
    })
    alert('User account has been suspended successfully')
    await refresh()
  } catch (error: any) {
    alert('Failed to suspend user: ' + error.message)
  } finally {
    suspending.value = null
  }
}

// Unsuspend user (restore account)
const unsuspendUser = async (userId: string) => {
  if (!confirm('Are you sure you want to restore this user account?')) return
  
  unsuspending.value = userId
  try {
    await $fetch(`/api/admin/users/${userId}/unsuspend`, {
      method: 'POST'
    })
    alert('User account has been restored successfully')
    await refresh()
  } catch (error: any) {
    alert('Failed to restore user: ' + error.message)
  } finally {
    unsuspending.value = null
  }
}

// Show delete modal
const showDeleteModal = (user: any) => {
  userToDelete.value = user
  deleteReason.value = ''
  deleteModalOpen.value = true
}

// Close delete modal
const closeDeleteModal = () => {
  deleteModalOpen.value = false
  userToDelete.value = null
  deleteReason.value = ''
}

// Delete user permanently
const deleteUser = async () => {
  if (!deleteReason.value.trim()) {
    alert('Please provide a reason for deletion')
    return
  }

  if (!userToDelete.value) return

  const userId = userToDelete.value.id
  deleting.value = userId
  
  try {
    const result: any = await $fetch(`/api/admin/users/${userId}/delete`, {
      method: 'POST',
      body: { reason: deleteReason.value }
    })
    
    alert(`User deleted successfully.\n\nListings deleted: ${result.details.listingsDeleted}\nImages deleted: ${result.details.imagesDeleted}`)
    closeDeleteModal()
    await refresh()
  } catch (error: any) {
    alert('Failed to delete user: ' + error.message)
  } finally {
    deleting.value = null
  }
}
</script>
