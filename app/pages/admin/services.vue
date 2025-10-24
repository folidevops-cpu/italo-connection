<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Services Management
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Review and approve services submitted by users
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white shadow rounded-lg p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              v-model="filters.status"
              @change="refresh"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
            <select
              v-model="filters.serviceType"
              @change="refresh"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Types</option>
              <option v-for="type in serviceTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="text-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading services...</p>
      </div>

      <!-- Services Grid -->
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="service in services" 
            :key="service.id"
            class="bg-white rounded-lg shadow overflow-hidden"
          >
            <!-- Image -->
            <div class="aspect-video bg-gray-200">
              <img
                v-if="service.media && service.media[0]"
                :src="service.media[0].url"
                :alt="service.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <!-- Content -->
            <div class="p-4">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-lg font-semibold text-gray-900 truncate">{{ service.name }}</h3>
                <span 
                  class="ml-2 px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap"
                  :class="{
                    'bg-yellow-100 text-yellow-800': service.status === 'PENDING',
                    'bg-green-100 text-green-800': service.status === 'APPROVED',
                    'bg-red-100 text-red-800': service.status === 'REJECTED'
                  }"
                >
                  {{ service.status }}
                </span>
              </div>

              <p class="text-sm text-gray-600 mb-2">{{ service.serviceType.name }}</p>
              <p class="text-sm text-gray-500 mb-2 line-clamp-2">{{ service.description }}</p>
              
              <div class="flex items-center text-sm text-gray-500 mb-2">
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ service.location }}
              </div>

              <div class="text-lg font-bold text-gray-900 mb-3">
                €{{ service.price }}
              </div>

              <div class="text-xs text-gray-500 mb-3">
                By {{ service.owner.profile?.displayName || service.owner.email }}
              </div>

              <!-- Actions -->
              <div v-if="service.status === 'PENDING'" class="flex gap-2">
                <button
                  @click="approveService(service.id)"
                  class="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded"
                >
                  Approve
                </button>
                <button
                  @click="rejectService(service.id)"
                  class="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!services || services.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
          <p class="text-gray-500">No services found</p>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.pages > 1" class="mt-6 flex justify-center">
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              v-for="page in pagination.pages"
              :key="page"
              @click="goToPage(page)"
              class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              :class="page === pagination.page 
                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
            >
              {{ page }}
            </button>
          </nav>
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
  title: 'Services Management - Admin - ItaloConnection'
})

const filters = ref({
  status: 'all',
  serviceType: 'all',
  page: 1
})

// Fetch service types for filter
const { data: typesData } = await useFetch('/api/service-types')
const serviceTypes = computed(() => typesData.value?.serviceTypes || [])

// Fetch services
const { data, pending, refresh } = await useFetch('/api/admin/services', {
  query: filters
})

const services = computed(() => data.value?.services || [])
const pagination = computed(() => data.value?.pagination)

const goToPage = (page: number) => {
  filters.value.page = page
  refresh()
}

const approveService = async (serviceId: string) => {
  if (!confirm('Approve this service?')) return

  try {
    await $fetch(`/api/admin/services/${serviceId}/approve`, {
      method: 'POST'
    })

    await refresh()
  } catch (error: any) {
    alert(error.data?.statusMessage || 'Failed to approve service')
  }
}

const rejectService = async (serviceId: string) => {
  const reason = prompt('Reason for rejection (optional):')
  if (reason === null) return

  try {
    await $fetch(`/api/admin/services/${serviceId}/reject`, {
      method: 'POST',
      body: { reason }
    })

    await refresh()
  } catch (error: any) {
    alert(error.data?.statusMessage || 'Failed to reject service')
  }
}
</script>
