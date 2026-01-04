<template>
  <div class="church-leaders">
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold">Church Leaders</h1>
      <v-btn 
        color="success" 
        prepend-icon="mdi-account-plus" 
        size="small" 
        :disabled="loading"
        :loading="loading"
        @click="openChurchLeaderDialog"
      >
        Add New Leader
      </v-btn>
    </div>

    <!-- Filtering and Sorting Section -->
    <v-card class="mb-4" elevation="2">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search by member ID or name..."
              variant="outlined"
              density="compact"
              :disabled="loading"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.sortBy"
              :items="sortByOptions"
              label="Sort By"
              variant="outlined"
              density="compact"
              :disabled="loading"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="2" class="d-flex align-center gap-2">
            <v-tooltip text="Print" location="top">
              <template v-slot:activator="{ props }">
                <v-btn 
                  icon="mdi-printer"
                  variant="outlined"
                  v-bind="props"
                  :disabled="loading"
                  @click="handlePrint"
                ></v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Export Excel" location="top">
              <template v-slot:activator="{ props }">
                <v-btn 
                  icon="mdi-download"
                  variant="outlined"
                  v-bind="props"
                  :loading="loading"
                  :disabled="loading"
                  @click="handleExportExcel"
                ></v-btn>
              </template>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Table -->
    <v-card elevation="2" class="position-relative">
      <!-- Loading Overlay -->
      <v-overlay :model-value="loading" class="align-center justify-center" contained>
        <div class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
            width="6"
          ></v-progress-circular>
          <div class="mt-4 text-body-1">Loading church leaders...</div>
        </div>
      </v-overlay>

      <v-table>
        <thead>
          <tr>
            <th class="text-left font-weight-bold">Leader ID</th>
            <th class="text-left font-weight-bold">Member ID</th>
            <th class="text-left font-weight-bold">Full Name</th>
            <th class="text-left font-weight-bold">Joined Date</th>
            <th class="text-left font-weight-bold">Date Created</th>
            <th class="text-left font-weight-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!loading && leaders.length === 0">
            <td colspan="6" class="text-center py-12">
              <div class="text-h6 font-weight-bold">No Record Found</div>
            </td>
          </tr>
          <tr v-if="loading">
            <td colspan="6" class="text-center py-12">
              <v-progress-circular
                indeterminate
                color="primary"
                size="48"
              ></v-progress-circular>
            </td>
          </tr>
          <tr v-for="leader in leaders" :key="leader.leader_id" v-show="!loading">
            <td>{{ leader.leader_id }}</td>
            <td>{{ leader.member_id }}</td>
            <td>{{ leader.fullname || 'N/A' }}</td>
            <td>{{ leader.joined_date }}</td>
            <td>{{ leader.date_created }}</td>
            <td>
              <v-tooltip text="Edit Leader" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn 
                    icon="mdi-pencil" 
                    variant="text" 
                    size="small" 
                    class="mr-2" 
                    :disabled="loading"
                    v-bind="props"
                    @click="editLeader(leader)"
                  ></v-btn>
                </template>
              </v-tooltip>
              <v-tooltip text="Delete Leader" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn 
                    icon="mdi-delete" 
                    variant="text" 
                    size="small" 
                    color="error" 
                    :disabled="loading"
                    v-bind="props"
                    @click="deleteLeader(leader)"
                  ></v-btn>
                </template>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- Pagination -->
      <div class="d-flex justify-space-between align-center pa-4">
        <div class="d-flex align-center">
          <span class="text-body-2 mr-2">Items per page:</span>
          <v-select
            v-model="itemsPerPage"
            :items="pageSizeOptions"
            density="compact"
            variant="outlined"
            hide-details
            :disabled="loading"
            style="width: 80px;"
            @update:model-value="handlePageSizeChange"
          ></v-select>
          <span class="ml-4 text-body-2">
            Showing {{ getStartIndex() }} - {{ getEndIndex() }} of {{ totalCount }}
          </span>
        </div>
        <div class="d-flex align-center">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            :disabled="loading"
            density="compact"
          ></v-pagination>
        </div>
      </div>
    </v-card>
    <ChurchLeaderDialog 
      v-model="churchLeaderDialog" 
      :leaderData="churchLeaderData" 
      :memberOptions="memberOptions"
      @update:model-value="churchLeaderDialog = $event" 
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ChurchLeaderDialog from '../../Dialogs/ChurchLeaderDialog.vue'
import { useChurchLeadersStore } from '@/stores/ChurchRecords/churchLeadersStore'

const churchLeadersStore = useChurchLeadersStore()

const churchLeaderDialog = ref(false)
const churchLeaderData = ref(null)

// Computed properties from store
const leaders = computed(() => churchLeadersStore.paginatedLeaders)
const loading = computed(() => churchLeadersStore.loading)
const searchQuery = computed({
  get: () => churchLeadersStore.searchQuery,
  set: (value) => churchLeadersStore.setSearchQuery(value)
})
const filters = computed(() => churchLeadersStore.filters)
const currentPage = computed({
  get: () => churchLeadersStore.currentPage,
  set: (value) => churchLeadersStore.setCurrentPage(value)
})
const totalPages = computed(() => churchLeadersStore.totalPages)
const totalCount = computed(() => churchLeadersStore.totalCount)
const itemsPerPage = computed({
  get: () => churchLeadersStore.itemsPerPage,
  set: (value) => churchLeadersStore.setPageSize(value)
})
const pageSizeOptions = computed(() => churchLeadersStore.pageSizeOptions)
const memberOptions = computed(() => churchLeadersStore.memberOptions)

const sortByOptions = [
  'Leader ID (Low to High)',
  'Leader ID (High to Low)',
  'Member ID (A-Z)',
  'Member ID (Z-A)',
  'Joined Date (Newest)',
  'Joined Date (Oldest)',
  'Date Created (Newest)',
  'Date Created (Oldest)'
]

// Watch for filter changes
watch(() => filters.value.sortBy, (newSortBy) => {
  churchLeadersStore.setFilters({ sortBy: newSortBy })
})

const openChurchLeaderDialog = () => {
  churchLeaderData.value = null
  churchLeaderDialog.value = true
}

const editLeader = (leader) => {
  churchLeaderData.value = leader
  churchLeaderDialog.value = true
}

const deleteLeader = async (leader) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete this church leader?`,
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )

    const result = await churchLeadersStore.deleteLeader(leader.leader_id)
    if (result.success) {
      ElMessage.success('Church leader deleted successfully')
    } else {
      ElMessage.error(result.error || 'Failed to delete church leader')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error deleting church leader:', error)
      ElMessage.error('Failed to delete church leader')
    }
  }
}

const handleSubmit = async (data) => {
  try {
    let result
    if (churchLeaderData.value) {
      // Update existing leader
      const leaderId = churchLeaderData.value.leader_id
      result = await churchLeadersStore.updateLeader(leaderId, data)
    } else {
      // Create new leader
      result = await churchLeadersStore.createLeader(data)
    }

    if (result.success) {
      ElMessage.success(
        churchLeaderData.value 
          ? 'Church leader updated successfully' 
          : 'Church leader created successfully'
      )
      churchLeaderDialog.value = false
      churchLeaderData.value = null
    } else {
      ElMessage.error(result.error || 'Failed to save church leader')
    }
  } catch (error) {
    console.error('Error submitting church leader:', error)
    ElMessage.error('Failed to save church leader')
  }
}

const handleExportExcel = async () => {
  try {
    const result = await churchLeadersStore.exportChurchLeadersToExcel()
    if (result.success) {
      ElMessage.success('Church leaders exported successfully')
    } else {
      ElMessage.error(result.error || 'Failed to export church leaders')
    }
  } catch (error) {
    console.error('Error exporting church leaders:', error)
    ElMessage.error('Failed to export church leaders')
  }
}

const handlePageSizeChange = (pageSize) => {
  churchLeadersStore.setPageSize(pageSize)
}

const getStartIndex = () => {
  if (leaders.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage.value + 1
}

const getEndIndex = () => {
  const end = currentPage.value * itemsPerPage.value
  return Math.min(end, totalCount.value)
}

const handlePrint = () => {
  const printWindow = window.open('', '_blank')
  const tableHeaders = ['Leader ID', 'Member ID', 'Full Name', 'Joined Date', 'Date Created']
  
  let tableRows = ''
  leaders.value.forEach((leader) => {
    tableRows += `
      <tr>
        <td>${leader.leader_id || 'N/A'}</td>
        <td>${leader.member_id || 'N/A'}</td>
        <td>${leader.fullname || 'N/A'}</td>
        <td>${leader.joined_date || 'N/A'}</td>
        <td>${leader.date_created || 'N/A'}</td>
      </tr>
    `
  })
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Church Leaders - Print</title>
        <style>
          @media print {
            @page { margin: 1cm; }
          }
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          h1 {
            text-align: center;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .print-date {
            text-align: right;
            margin-bottom: 10px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <h1>Church Leaders</h1>
        <div class="print-date">Printed on: ${new Date().toLocaleString()}</div>
        <table>
          <thead>
            <tr>
              ${tableHeaders.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${tableRows || '<tr><td colspan="' + tableHeaders.length + '" style="text-align: center;">No records found</td></tr>'}
          </tbody>
        </table>
      </body>
    </html>
  `)
  
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}

// Initialize on mount
onMounted(async () => {
  await churchLeadersStore.fetchLeaders()
  await churchLeadersStore.fetchMemberOptions()
})
</script>

<style scoped>
.church-leaders {
  padding: 24px;
}
</style>

