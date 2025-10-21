<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Manage Announcements</h1>
      <button
        @click="showCreateModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <span>+ Create Announcement</span>
      </button>
    </div>

    <!-- Info Box -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <p class="text-sm text-blue-800">
        <strong>Note:</strong> Only one announcement can be active at a time. Activating a new announcement will automatically deactivate the current one.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Loading announcements...</p>
    </div>

    <!-- Announcements List -->
    <div v-else-if="announcements.length > 0" class="space-y-4">
      <div
        v-for="announcement in announcements"
        :key="announcement.id"
        class="bg-white rounded-lg shadow-md p-6 border-l-4"
        :class="{
          'border-blue-500': announcement.type === 'info',
          'border-yellow-500': announcement.type === 'warning',
          'border-green-500': announcement.type === 'success',
          'border-red-500': announcement.type === 'error'
        }"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span
                class="px-2 py-1 text-xs font-semibold rounded"
                :class="{
                  'bg-blue-100 text-blue-800': announcement.type === 'info',
                  'bg-yellow-100 text-yellow-800': announcement.type === 'warning',
                  'bg-green-100 text-green-800': announcement.type === 'success',
                  'bg-red-100 text-red-800': announcement.type === 'error'
                }"
              >
                {{ announcement.type.toUpperCase() }}
              </span>
              <span
                v-if="announcement.isActive"
                class="px-2 py-1 text-xs font-semibold rounded bg-green-500 text-white"
              >
                ACTIVE
              </span>
              <span
                v-else
                class="px-2 py-1 text-xs font-semibold rounded bg-gray-300 text-gray-700"
              >
                INACTIVE
              </span>
            </div>
            <h3 v-if="announcement.title" class="text-lg font-semibold text-gray-900 mb-2">
              {{ announcement.title }}
            </h3>
            <p class="text-gray-700 mb-3">{{ announcement.message }}</p>
            <p class="text-sm text-gray-500">
              Created: {{ new Date(announcement.createdAt).toLocaleString() }}
            </p>
          </div>
          <div class="flex gap-2 ml-4">
            <button
              @click="editAnnouncement(announcement)"
              class="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm border border-blue-600 rounded hover:bg-blue-50"
            >
              Edit
            </button>
            <button
              v-if="!announcement.isActive"
              @click="activateAnnouncement(announcement.id)"
              class="text-green-600 hover:text-green-800 px-3 py-1 text-sm border border-green-600 rounded hover:bg-green-50"
            >
              Activate
            </button>
            <button
              v-else
              @click="deactivateAnnouncement(announcement.id)"
              class="text-gray-600 hover:text-gray-800 px-3 py-1 text-sm border border-gray-600 rounded hover:bg-gray-50"
            >
              Deactivate
            </button>
            <button
              @click="deleteAnnouncement(announcement.id)"
              class="text-red-600 hover:text-red-800 px-3 py-1 text-sm border border-red-600 rounded hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 bg-white rounded-lg shadow">
      <p class="text-gray-500 text-lg">No announcements yet.</p>
      <button
        @click="showCreateModal = true"
        class="mt-4 text-blue-600 hover:text-blue-800 underline"
      >
        Create your first announcement
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || editingAnnouncement"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          {{ editingAnnouncement ? 'Edit Announcement' : 'Create Announcement' }}
        </h2>
        
        <form @submit.prevent="saveAnnouncement" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Title (Optional)
            </label>
            <input
              v-model="formData.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Announcement title"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Message <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="formData.message"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter announcement message"
              required
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              v-model="formData.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="info">Info (Blue)</option>
              <option value="warning">Warning (Yellow)</option>
              <option value="success">Success (Green)</option>
              <option value="error">Error (Red)</option>
            </select>
          </div>

          <div class="flex items-center">
            <input
              v-model="formData.isActive"
              type="checkbox"
              id="isActive"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="isActive" class="ml-2 block text-sm text-gray-700">
              Set as active (will deactivate other announcements)
            </label>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ saving ? 'Saving...' : editingAnnouncement ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const announcements = ref<any[]>([])
const loading = ref(true)
const saving = ref(false)
const showCreateModal = ref(false)
const editingAnnouncement = ref<any>(null)
const formData = ref({
  title: '',
  message: '',
  type: 'info',
  isActive: false
})

// Fetch announcements
const fetchAnnouncements = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/admin/announcements')
    if (response.success) {
      announcements.value = response.announcements
    }
  } catch (error: any) {
    console.error('Failed to fetch announcements:', error)
    alert('Failed to load announcements: ' + (error.data?.statusMessage || error.message))
  } finally {
    loading.value = false
  }
}

// Create or update announcement
const saveAnnouncement = async () => {
  if (!formData.value.message.trim()) {
    alert('Message is required')
    return
  }

  try {
    saving.value = true
    
    if (editingAnnouncement.value) {
      // Update existing
      await $fetch(`/api/admin/announcements/${editingAnnouncement.value.id}`, {
        method: 'PUT',
        body: formData.value
      })
      alert('Announcement updated successfully')
    } else {
      // Create new
      await $fetch('/api/admin/announcements', {
        method: 'POST',
        body: formData.value
      })
      alert('Announcement created successfully')
    }
    
    closeModal()
    await fetchAnnouncements()
  } catch (error: any) {
    console.error('Failed to save announcement:', error)
    alert('Failed to save announcement: ' + (error.data?.statusMessage || error.message))
  } finally {
    saving.value = false
  }
}

// Edit announcement
const editAnnouncement = (announcement: any) => {
  editingAnnouncement.value = announcement
  formData.value = {
    title: announcement.title || '',
    message: announcement.message,
    type: announcement.type,
    isActive: announcement.isActive
  }
}

// Activate announcement
const activateAnnouncement = async (id: string) => {
  if (!confirm('This will deactivate any other active announcement. Continue?')) {
    return
  }

  try {
    await $fetch(`/api/admin/announcements/${id}`, {
      method: 'PUT',
      body: { isActive: true }
    })
    alert('Announcement activated')
    await fetchAnnouncements()
  } catch (error: any) {
    console.error('Failed to activate announcement:', error)
    alert('Failed to activate announcement: ' + (error.data?.statusMessage || error.message))
  }
}

// Deactivate announcement
const deactivateAnnouncement = async (id: string) => {
  try {
    await $fetch(`/api/admin/announcements/${id}`, {
      method: 'PUT',
      body: { isActive: false }
    })
    alert('Announcement deactivated')
    await fetchAnnouncements()
  } catch (error: any) {
    console.error('Failed to deactivate announcement:', error)
    alert('Failed to deactivate announcement: ' + (error.data?.statusMessage || error.message))
  }
}

// Delete announcement
const deleteAnnouncement = async (id: string) => {
  if (!confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
    return
  }

  try {
    await $fetch(`/api/admin/announcements/${id}`, {
      method: 'DELETE'
    })
    alert('Announcement deleted')
    await fetchAnnouncements()
  } catch (error: any) {
    console.error('Failed to delete announcement:', error)
    alert('Failed to delete announcement: ' + (error.data?.statusMessage || error.message))
  }
}

// Close modal
const closeModal = () => {
  showCreateModal.value = false
  editingAnnouncement.value = null
  formData.value = {
    title: '',
    message: '',
    type: 'info',
    isActive: false
  }
}

// Load announcements on mount
onMounted(() => {
  fetchAnnouncements()
})
</script>
