<template>
  <div class="tithes-offerings">
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold">Tithes & Offerings</h1>
      <v-btn 
        color="success" 
        prepend-icon="mdi-cash-plus" 
        size="small" 
        :disabled="loading"
        :loading="loading"
        @click="handleTithesOfferingsDialog"
      >
        Record New Donation
      </v-btn>
    </div>

    <!-- Summary Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption grey--text mb-1">Total Donations</div>
              <div class="text-h5 font-weight-bold">P{{ totalDonations.toLocaleString() }}</div>
            </div>
            <v-avatar size="56" color="green lighten-5" class="d-flex align-center justify-center">
              <span style="color: white !important;" class="mdi mdi-gift icon-custom" aria-hidden="true"></span>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption grey--text mb-1">Tithes</div>
              <div class="text-h5 font-weight-bold">P{{ totalTithes.toLocaleString() }}</div>
            </div>
            <v-avatar size="56" color="blue lighten-5" class="d-flex align-center justify-center">
              <span style="color:white !important;" class="mdi mdi-gift icon-custom" aria-hidden="true"></span>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption grey--text mb-1">Offerings</div>
              <div class="text-h5 font-weight-bold">P{{ totalOfferings.toLocaleString() }}</div>
            </div>
            <v-avatar size="56" color="purple lighten-5" class="d-flex align-center justify-center">
              <span style="color: white !important;" class="mdi mdi-gift icon-custom" aria-hidden="true"></span>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption grey--text mb-1">Special Offerings</div>
              <div class="text-h5 font-weight-bold">P{{ totalSpecialOfferings.toLocaleString() }}</div>
            </div>
            <v-avatar size="56" color="yellow lighten-5" class="d-flex align-center justify-center">
              <span style="color: green !important;" class="mdi mdi-gift icon-custom" aria-hidden="true"></span>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filtering and Sorting Section -->
    <v-card class="mb-4" elevation="2">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
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
          <v-col cols="12" md="2">
            <v-select
              v-model="filters.type"
              :items="typeOptions"
              label="Type"
              variant="outlined"
              density="compact"
              :disabled="loading"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filters.status"
              :items="statusOptions"
              label="Status"
              variant="outlined"
              density="compact"
              :disabled="loading"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="2">
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
          <v-col cols="12" md="3" class="d-flex align-center gap-2">
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
          <div class="mt-4 text-body-1">Loading donations...</div>
        </div>
      </v-overlay>

      <v-table>
        <thead>
          <tr>
            <th class="text-left font-weight-bold">Member Name</th>
            <th class="text-left font-weight-bold">Amount</th>
            <th class="text-left font-weight-bold">Date Created</th>
            <th class="text-left font-weight-bold">Type</th>
            <th class="text-left font-weight-bold">Payment Method</th>
            <th class="text-left font-weight-bold">Status</th>
            <th class="text-left font-weight-bold">Notes</th>
            <th class="text-left font-weight-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!loading && donations.length === 0">
            <td colspan="8" class="text-center py-12">
              <div class="text-h6 font-weight-bold">No Record Found</div>
            </td>
          </tr>
          <tr v-if="loading">
            <td colspan="8" class="text-center py-12">
              <v-progress-circular
                indeterminate
                color="primary"
                size="48"
              ></v-progress-circular>
            </td>
          </tr>
          <tr v-for="donation in donations" :key="donation.tithes_id" v-show="!loading">
            <td>{{ donation.fullname || 'N/A' }}</td>
            <td class="font-weight-bold">P{{ parseFloat(donation.amount || 0).toLocaleString() }}</td>
            <td>{{ donation.date_created }}</td>
            <td>
              <v-chip :color="getTypeColor(donation.type)" size="small" variant="flat">
                {{ formatType(donation.type) }}
              </v-chip>
            </td>
            <td>{{ donation.payment_method }}</td>
            <td>
              <v-chip 
                :color="donation.status === 'completed' ? 'success' : donation.status === 'pending' ? 'warning' : 'error'" 
                size="small" 
                variant="flat"
              >
                {{ donation.status }}
              </v-chip>
            </td>
            <td>{{ donation.notes || '-' }}</td>
            <td>
              <v-tooltip text="Edit Donation" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn 
                    icon="mdi-pencil" 
                    variant="text" 
                    size="small" 
                    class="mr-2" 
                    :disabled="loading"
                    v-bind="props"
                    @click="editDonation(donation)"
                  ></v-btn>
                </template>
              </v-tooltip>
              <v-tooltip text="Delete Donation" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn 
                    icon="mdi-delete" 
                    variant="text" 
                    size="small" 
                    color="error" 
                    :disabled="loading"
                    v-bind="props"
                    @click="deleteDonation(donation)"
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
    <TithesOfferingsDialog
      v-model="tithesOfferingsDialog"
      :tithesData="tithesOfferingsData"
      :memberOptions="memberOptions"
      @update:model-value="tithesOfferingsDialog = $event"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import TithesOfferingsDialog from '@/components/Dialogs/TithesOfferingsDialog.vue'
import { useTithesOfferingsStore } from '@/stores/ChurchRecords/tithesOfferingsStore'

const tithesOfferingsStore = useTithesOfferingsStore()

const tithesOfferingsDialog = ref(false)
const tithesOfferingsData = ref(null)

// Computed properties from store
const donations = computed(() => tithesOfferingsStore.paginatedDonations)
const loading = computed(() => tithesOfferingsStore.loading)
const searchQuery = computed({
  get: () => tithesOfferingsStore.searchQuery,
  set: (value) => tithesOfferingsStore.setSearchQuery(value)
})
const filters = computed(() => tithesOfferingsStore.filters)
const currentPage = computed({
  get: () => tithesOfferingsStore.currentPage,
  set: (value) => tithesOfferingsStore.setCurrentPage(value)
})
const totalPages = computed(() => tithesOfferingsStore.totalPages)
const totalCount = computed(() => tithesOfferingsStore.totalCount)
const itemsPerPage = computed({
  get: () => tithesOfferingsStore.itemsPerPage,
  set: (value) => tithesOfferingsStore.setPageSize(value)
})
const pageSizeOptions = computed(() => tithesOfferingsStore.pageSizeOptions)
const memberOptions = computed(() => tithesOfferingsStore.memberOptions)

// Summary totals from store
const totalDonations = computed(() => tithesOfferingsStore.totalDonations)
const totalTithes = computed(() => tithesOfferingsStore.totalTithes)
const totalOfferings = computed(() => tithesOfferingsStore.totalOfferings)
const totalSpecialOfferings = computed(() => tithesOfferingsStore.totalSpecialOfferings)

const sortByOptions = [
  'Tithes ID (Low to High)',
  'Tithes ID (High to Low)',
  'Amount (Low to High)',
  'Amount (High to Low)',
  'Date Created (Newest)',
  'Date Created (Oldest)',
  'Type (A-Z)',
  'Status (A-Z)',
  'Name (A-Z)',
  'Name (Z-A)'
]
const typeOptions = ['All Types', 'tithe', 'offering', 'missions', 'love_gift', 'building_fund', 'donation', 'other']
const statusOptions = ['All Statuses', 'pending', 'completed', 'cancelled']

// Watch for filter changes
watch(() => filters.value.sortBy, (newSortBy) => {
  tithesOfferingsStore.setFilters({ sortBy: newSortBy })
})

watch(() => filters.value.type, (newType) => {
  tithesOfferingsStore.setFilters({ type: newType })
})

watch(() => filters.value.status, (newStatus) => {
  tithesOfferingsStore.setFilters({ status: newStatus })
})

const handleTithesOfferingsDialog = () => {
  tithesOfferingsData.value = null
  tithesOfferingsDialog.value = true
}

const editDonation = (donation) => {
  tithesOfferingsData.value = donation
  tithesOfferingsDialog.value = true
}

const deleteDonation = async (donation) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete this donation record?`,
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )

    const result = await tithesOfferingsStore.deleteDonation(donation.tithes_id)
    if (result.success) {
      ElMessage.success('Donation deleted successfully')
    } else {
      ElMessage.error(result.error || 'Failed to delete donation')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error deleting donation:', error)
      ElMessage.error('Failed to delete donation')
    }
  }
}

const handleSubmit = async (data) => {
  try {
    let result
    if (tithesOfferingsData.value) {
      // Update existing donation
      const tithesId = tithesOfferingsData.value.tithes_id
      result = await tithesOfferingsStore.updateDonation(tithesId, data)
    } else {
      // Create new donation
      result = await tithesOfferingsStore.createDonation(data)
    }

    if (result.success) {
      ElMessage.success(
        tithesOfferingsData.value 
          ? 'Donation updated successfully' 
          : 'Donation created successfully'
      )
      tithesOfferingsDialog.value = false
      tithesOfferingsData.value = null
    } else {
      ElMessage.error(result.error || 'Failed to save donation')
    }
  } catch (error) {
    console.error('Error submitting donation:', error)
    ElMessage.error('Failed to save donation')
  }
}

const handlePageSizeChange = (pageSize) => {
  tithesOfferingsStore.setPageSize(pageSize)
}

const getStartIndex = () => {
  if (donations.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage.value + 1
}

const getEndIndex = () => {
  const end = currentPage.value * itemsPerPage.value
  return Math.min(end, totalCount.value)
}

const getTypeColor = (type) => {
  const colors = {
    'tithe': 'primary',
    'offering': 'success',
    'missions': 'warning',
    'love_gift': 'info',
    'building_fund': 'purple',
    'donation': 'orange',
    'other': 'grey'
  }
  return colors[type] || 'default'
}

const formatType = (type) => {
  const typeMap = {
    'tithe': 'Tithe',
    'offering': 'Offering',
    'missions': 'Missions',
    'love_gift': 'Love Gift',
    'building_fund': 'Building Fund',
    'donation': 'Donation',
    'other': 'Other'
  }
  return typeMap[type] || type
}

// Handle Excel export
const handleExportExcel = async () => {
  try {
    const result = await tithesOfferingsStore.exportTithesToExcel()
    if (result.success) {
      ElMessage.success(result.message || 'Excel file downloaded successfully')
    } else {
      ElMessage.error(result.error || 'Failed to export Excel file')
    }
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    ElMessage.error('An error occurred while exporting to Excel')
  }
}

const handlePrint = () => {
  const printWindow = window.open('', '_blank')
  const tableHeaders = ['Member Name', 'Amount', 'Date Created', 'Type', 'Payment Method', 'Status', 'Notes']
  
  let tableRows = ''
  donations.value.forEach((donation) => {
    tableRows += `
      <tr>
        <td>${donation.fullname || 'N/A'}</td>
        <td>P${parseFloat(donation.amount || 0).toLocaleString()}</td>
        <td>${donation.date_created || 'N/A'}</td>
        <td>${formatType(donation.type)}</td>
        <td>${donation.payment_method || 'N/A'}</td>
        <td>${donation.status || 'N/A'}</td>
        <td>${donation.notes || '-'}</td>
      </tr>
    `
  })
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Tithes & Offerings - Print</title>
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
        <h1>Tithes & Offerings</h1>
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
  await tithesOfferingsStore.fetchDonations()
  await tithesOfferingsStore.fetchMemberOptions()
})
</script>

<style scoped>
.tithes-offerings {
  padding: 24px;
}

.icon-custom {
  font-size: 32px !important;
  line-height: 1 !important;
  display: inline-block !important;
  font-family: "Material Design Icons" !important;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
}
</style>

