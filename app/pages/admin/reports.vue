<template>
  <div class="p-4 md:p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">User Reports</h1>
      <p class="text-gray-600 mt-1">Review and manage user reports</p>
    </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div class="flex flex-wrap gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                v-model="filterStatus" 
                @change="fetchReports"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="RESOLVED">Resolved</option>
                <option value="DISMISSED">Dismissed</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading reports...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {{ error }}
        </div>

        <!-- No Reports -->
        <div v-else-if="!reports || reports.length === 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-4 text-gray-500">No reports found</p>
        </div>

        <!-- Reports Table -->
        <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reported User
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="report in reports" :key="report.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img v-if="report.reportedUser.profile?.avatarUrl" 
                             :src="report.reportedUser.profile.avatarUrl" 
                             :alt="report.reportedUser.profile.displayName"
                             class="h-10 w-10 rounded-full object-cover"
                        />
                        <div v-else class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span class="text-gray-500 font-semibold">
                            {{ report.reportedUser.profile?.displayName?.charAt(0).toUpperCase() || '?' }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ report.reportedUser.profile?.displayName || 'Unknown' }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ report.reportedUser.email }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {{ report.reporter?.profile?.displayName || 'Anonymous' }}
                    </div>
                    <div v-if="report.reporter" class="text-sm text-gray-500">
                      {{ report.reporter.email }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 font-medium">{{ report.reason }}</div>
                    <div class="text-sm text-gray-500 max-w-xs truncate">{{ report.description }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(report.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ report.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(report.createdAt) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      @click="viewReport(report)"
                      class="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Report Details Modal -->
        <Teleport to="body">
          <div v-if="selectedReport" @click="selectedReport = null" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div @click.stop class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <!-- Modal Header -->
              <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 class="text-xl font-bold text-gray-900">Report Details</h3>
                <button @click="selectedReport = null" class="text-gray-400 hover:text-gray-600">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Modal Body -->
              <div class="px-6 py-4 space-y-6">
                <!-- Status -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select 
                    v-model="selectedReport.status"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="REVIEWED">Reviewed</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="DISMISSED">Dismissed</option>
                  </select>
                </div>

                <!-- Reported User -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-gray-700 mb-3">Reported User</h4>
                  <div class="flex items-center space-x-4">
                    <img v-if="selectedReport.reportedUser.profile?.avatarUrl" 
                         :src="selectedReport.reportedUser.profile.avatarUrl" 
                         class="h-16 w-16 rounded-full object-cover"
                    />
                    <div v-else class="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <span class="text-gray-500 font-bold text-xl">
                        {{ selectedReport.reportedUser.profile?.displayName?.charAt(0).toUpperCase() || '?' }}
                      </span>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900">
                        {{ selectedReport.reportedUser.profile?.displayName || 'Unknown' }}
                      </div>
                      <div class="text-sm text-gray-600">{{ selectedReport.reportedUser.email }}</div>
                      <NuxtLink 
                        :to="`/users/${selectedReport.reportedUser.profile?.displayName}`"
                        class="text-sm text-blue-600 hover:underline"
                      >
                        View Profile
                      </NuxtLink>
                    </div>
                  </div>
                </div>

                <!-- Reporter -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-gray-700 mb-3">Reporter</h4>
                  <div v-if="selectedReport.reporter">
                    <div class="flex items-center space-x-4">
                      <img v-if="selectedReport.reporter.profile?.avatarUrl" 
                           :src="selectedReport.reporter.profile.avatarUrl" 
                           class="h-12 w-12 rounded-full object-cover"
                      />
                      <div v-else class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span class="text-gray-500 font-semibold">
                          {{ selectedReport.reporter.profile?.displayName?.charAt(0).toUpperCase() || '?' }}
                        </span>
                      </div>
                      <div>
                        <div class="font-semibold text-gray-900">
                          {{ selectedReport.reporter.profile?.displayName || 'Unknown' }}
                        </div>
                        <div class="text-sm text-gray-600">{{ selectedReport.reporter.email }}</div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-gray-500 italic">Anonymous report</div>
                </div>

                <!-- Report Details -->
                <div>
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Reason</h4>
                  <p class="text-gray-900 font-medium">{{ selectedReport.reason }}</p>
                </div>

                <div>
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p class="text-gray-700 whitespace-pre-wrap">{{ selectedReport.description }}</p>
                </div>

                <div>
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Submitted</h4>
                  <p class="text-gray-700">{{ formatDate(selectedReport.createdAt, true) }}</p>
                </div>

                <!-- Admin Note -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                  <textarea 
                    v-model="selectedReport.adminNote"
                    rows="3"
                    placeholder="Add notes about this report..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                <div v-if="updateError" class="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  {{ updateError }}
                </div>

                <div v-if="updateSuccess" class="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm">
                  Report updated successfully
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
                <button 
                  @click="selectedReport = null"
                  class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  :disabled="updating"
                >
                  Cancel
                </button>
                <button 
                  @click="updateReport"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  :disabled="updating"
                >
                  {{ updating ? 'Updating...' : 'Update Report' }}
                </button>
              </div>
            </div>
          </div>
        </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const reports = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const filterStatus = ref('')

const selectedReport = ref<any>(null)
const updating = ref(false)
const updateError = ref('')
const updateSuccess = ref('')

// Fetch reports
const fetchReports = async () => {
  loading.value = true
  error.value = ''

  try {
    const query = filterStatus.value ? `?status=${filterStatus.value}` : ''
    const response = await $fetch(`/api/admin/reports${query}`)
    reports.value = response as any[]
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to load reports'
  } finally {
    loading.value = false
  }
}

// View report
const viewReport = (report: any) => {
  selectedReport.value = { ...report, adminNote: report.adminNote || '' }
  updateError.value = ''
  updateSuccess.value = ''
}

// Update report
const updateReport = async () => {
  if (!selectedReport.value) return

  updating.value = true
  updateError.value = ''
  updateSuccess.value = ''

  try {
    await $fetch(`/api/admin/reports/${selectedReport.value.id}`, {
      method: 'PATCH',
      body: {
        status: selectedReport.value.status,
        adminNote: selectedReport.value.adminNote
      }
    })

    updateSuccess.value = 'Report updated successfully'
    
    // Update the report in the list
    const index = reports.value.findIndex(r => r.id === selectedReport.value.id)
    if (index !== -1) {
      reports.value[index] = { ...selectedReport.value }
    }

    setTimeout(() => {
      selectedReport.value = null
      updateSuccess.value = ''
    }, 1500)
  } catch (err: any) {
    updateError.value = err.data?.message || 'Failed to update report'
  } finally {
    updating.value = false
  }
}

// Get status class
const getStatusClass = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'REVIEWED':
      return 'bg-blue-100 text-blue-800'
    case 'RESOLVED':
      return 'bg-green-100 text-green-800'
    case 'DISMISSED':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Format date
const formatDate = (date: string, full = false) => {
  const options: Intl.DateTimeFormatOptions = full
    ? { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { year: 'numeric', month: 'short', day: 'numeric' }
  
  return new Date(date).toLocaleDateString('en-US', options)
}

// Fetch reports on mount
onMounted(() => {
  fetchReports()
})

// Set page title
useHead({
  title: 'User Reports - Admin'
})
</script>
