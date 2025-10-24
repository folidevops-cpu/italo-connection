<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between mb-6">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Service Types
          </h2>
          <p class="mt-1 text-sm text-gray-500">
            Manage service categories available on the platform
          </p>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Service Type
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="text-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading service types...</p>
      </div>

      <!-- Service Types Table -->
      <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Services
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="type in serviceTypes" :key="type.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ type.name }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-500">{{ type.description || 'No description' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ type._count?.services || 0 }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="type.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ type.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editServiceType(type)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                <button
                  @click="deleteServiceType(type)"
                  class="text-red-600 hover:text-red-900"
                  :disabled="type._count?.services > 0"
                  :class="{ 'opacity-50 cursor-not-allowed': type._count?.services > 0 }"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="!serviceTypes || serviceTypes.length === 0" class="text-center py-12">
          <p class="text-gray-500">No service types found</p>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showCreateModal || editingType" class="fixed z-50 inset-0 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>
          
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form @submit.prevent="submitForm">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {{ editingType ? 'Edit Service Type' : 'Create Service Type' }}
                </h3>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Name *</label>
                    <input
                      v-model="form.name"
                      type="text"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      v-model="form.description"
                      rows="3"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>

                  <div class="flex items-center">
                    <input
                      v-model="form.isActive"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label class="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  :disabled="submitting"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {{ submitting ? 'Saving...' : 'Save' }}
                </button>
                <button
                  type="button"
                  @click="closeModal"
                  :disabled="submitting"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

useSeoMeta({
  title: 'Service Types - Admin - ItaloConnection'
})

const showCreateModal = ref(false)
const editingType = ref<any>(null)
const submitting = ref(false)

const form = ref({
  name: '',
  description: '',
  isActive: true
})

// Fetch service types
const { data, pending, refresh } = await useFetch('/api/admin/service-types')
const serviceTypes = computed(() => data.value?.serviceTypes || [])

const editServiceType = (type: any) => {
  editingType.value = type
  form.value = {
    name: type.name,
    description: type.description || '',
    isActive: type.isActive
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingType.value = null
  form.value = {
    name: '',
    description: '',
    isActive: true
  }
}

const submitForm = async () => {
  submitting.value = true

  try {
    if (editingType.value) {
      // Update existing
      await $fetch(`/api/admin/service-types/${editingType.value.id}`, {
        method: 'PUT',
        body: form.value
      })
    } else {
      // Create new
      await $fetch('/api/admin/service-types', {
        method: 'POST',
        body: form.value
      })
    }

    await refresh()
    closeModal()
  } catch (error: any) {
    alert(error.data?.statusMessage || 'Failed to save service type')
  } finally {
    submitting.value = false
  }
}

const deleteServiceType = async (type: any) => {
  if (type._count?.services > 0) {
    alert(`Cannot delete this service type. ${type._count.services} service(s) are using it.`)
    return
  }

  if (!confirm(`Are you sure you want to delete "${type.name}"?`)) {
    return
  }

  try {
    await $fetch(`/api/admin/service-types/${type.id}`, {
      method: 'DELETE'
    })

    await refresh()
  } catch (error: any) {
    alert(error.data?.statusMessage || 'Failed to delete service type')
  }
}
</script>
