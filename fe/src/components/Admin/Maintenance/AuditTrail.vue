<template>
  <div class="audit-trail-page">
    <div class="page-header">
      <h1>Audit Trail</h1>
      <p class="page-subtitle">Track all user actions and system activities</p>
    </div>

    <!-- Summary Cards -->
    <el-row :gutter="20" class="summary-cards">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="summary-card">
          <div class="card-content">
            <el-icon :size="40" color="#409EFF" class="card-icon">
              <Document />
            </el-icon>
            <div class="card-info">
              <div class="card-label">Total Actions</div>
              <div class="card-value">{{ summaryStats?.total_count || 0 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="summary-card">
          <div class="card-content">
            <el-icon :size="40" color="#67C23A" class="card-icon">
              <Clock />
            </el-icon>
            <div class="card-info">
              <div class="card-label">Last 24 Hours</div>
              <div class="card-value">{{ summaryStats?.recent_activity_24h || 0 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="summary-card">
          <div class="card-content">
            <el-icon :size="40" color="#409EFF" class="card-icon">
              <CircleCheck />
            </el-icon>
            <div class="card-info">
              <div class="card-label">Successful</div>
              <div class="card-value">{{ getStatusCount('success') }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="summary-card">
          <div class="card-content">
            <el-icon :size="40" color="#F56C6C" class="card-icon">
              <Warning />
            </el-icon>
            <div class="card-info">
              <div class="card-label">Failed/Errors</div>
              <div class="card-value">{{ getStatusCount('failed') + getStatusCount('error') }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Filters -->
    <el-card class="filter-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>Filters</span>
          <el-button type="primary" text @click="resetFilters" :disabled="loading">
            Reset Filters
          </el-button>
        </div>
      </template>
      <el-form :model="filters" :inline="true" class="filter-form">
        <el-form-item label="Search">
          <el-input
            v-model="searchQuery"
            placeholder="Search by user, route, entity..."
            clearable
            @input="handleSearch"
            @clear="handleSearch"
            :disabled="loading"
            style="width: 300px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="User ID">
          <el-input
            v-model="filters.user_id"
            placeholder="Enter user ID"
            clearable
            @change="handleFilterChange"
            :disabled="loading"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="Action Type">
          <el-select
            v-model="filters.action_type"
            placeholder="Select action"
            @change="handleFilterChange"
            :disabled="loading"
            clearable
            style="width: 180px"
          >
            <el-option label="All Actions" value="All Actions" />
            <el-option label="CREATE" value="CREATE" />
            <el-option label="UPDATE" value="UPDATE" />
            <el-option label="DELETE" value="DELETE" />
            <el-option label="VIEW" value="VIEW" />
            <el-option label="VIEW_LIST" value="VIEW_LIST" />
            <el-option label="LOGIN" value="LOGIN" />
            <el-option label="LOGOUT" value="LOGOUT" />
            <el-option label="EXPORT" value="EXPORT" />
            <el-option label="VIEW_CERTIFICATE" value="VIEW_CERTIFICATE" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="Entity Type">
          <el-select
            v-model="filters.entity_type"
            placeholder="Select entity"
            @change="handleFilterChange"
            :disabled="loading"
            clearable
            style="width: 180px"
          >
            <el-option label="All Entities" value="All Entities" />
            <el-option label="member" value="member" />
            <el-option label="account" value="account" />
            <el-option label="department" value="department" />
            <el-option label="ministry" value="ministry" />
            <el-option label="event" value="event" />
            <el-option label="approval" value="approval" />
            <el-option label="tithe" value="tithe" />
            <el-option label="church_leader" value="church_leader" />
            <el-option label="department_officer" value="department_officer" />
            <el-option label="marriage_service" value="marriage_service" />
            <el-option label="water_baptism" value="water_baptism" />
            <el-option label="burial_service" value="burial_service" />
            <el-option label="child_dedication" value="child_dedication" />
            <el-option label="transaction" value="transaction" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="Status">
          <el-select
            v-model="filters.status"
            placeholder="Select status"
            @change="handleFilterChange"
            :disabled="loading"
            clearable
            style="width: 150px"
          >
            <el-option label="All Statuses" value="All Statuses" />
            <el-option label="success" value="success" />
            <el-option label="failed" value="failed" />
            <el-option label="error" value="error" />
          </el-select>
        </el-form-item>
        <el-form-item label="Date Range">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            @change="handleDateRangeChange"
            :disabled="loading"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="Sort By">
          <el-select
            v-model="sortBy"
            placeholder="Select sort"
            @change="handleFilterChange"
            :disabled="loading"
            style="width: 180px"
          >
            <el-option label="Date (Newest)" value="Date (Newest)" />
            <el-option label="Date (Oldest)" value="Date (Oldest)" />
            <el-option label="User Name (A-Z)" value="User Name (A-Z)" />
            <el-option label="Action Type (A-Z)" value="Action Type (A-Z)" />
            <!-- <el-option label="Entity Type (A-Z)" value="Entity Type (A-Z)" /> -->
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Audit Logs Table -->
    <el-card class="table-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>Audit Logs</span>
          <div class="header-actions">
            <el-select
              v-model="itemsPerPage"
              @change="handlePageSizeChange"
              :disabled="loading"
              style="width: 120px; margin-right: 10px"
            >
              <el-option
                v-for="size in pageSizeOptions"
                :key="size"
                :label="`${size} / page`"
                :value="size"
              />
            </el-select>
            <el-button
              :icon="Refresh"
              circle
              @click="fetchAuditLogs"
              :loading="loading"
              :disabled="loading"
            />
          </div>
        </div>
      </template>

      <!-- Table -->
      <el-table
        v-loading="loading"
        :data="auditLogs"
        stripe
        style="width: 100%"
        empty-text="No audit logs found"
      >
        <el-table-column prop="date_created" label="Date & Time" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.date_created) }}
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="User" width="200">
          <template #default="{ row }">
            <div class="user-cell">
              <div class="user-name">{{ row.user_name || row.user_email || 'N/A' }}</div>
              <div class="user-position" v-if="row.user_position">
                {{ row.user_position }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="action_type" label="Action" width="140">
          <template #default="{ row }">
            <el-tag :type="getActionTypeColor(row.action_type)" size="small">
              {{ row.action_type }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="entity_type" label="Entity Type" width="150">
          <template #default="{ row }">
            <el-tag type="info" size="small">
              {{ formatEntityType(row.entity_type) }}
            </el-tag>
          </template>
        </el-table-column> -->
        <el-table-column prop="entity_id" label="Entity ID" width="120">
          <template #default="{ row }">
            {{ row.entity_id || 'N/A' }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="Route" min-width="300" show-overflow-tooltip>
          <template #default="{ row }">
            <code class="route-code">{{ row.description || 'N/A' }}</code>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" size="small">
              {{ row.status.toUpperCase() }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="80" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              :icon="View"
              circle
              size="small"
              @click="viewDetails(row)"
              type="primary"
              text
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-container" v-if="totalPages > 1">
        <div class="pagination-info">
          Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to
          {{ Math.min(currentPage * itemsPerPage, totalCount) }} of {{ totalCount }} entries
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="itemsPerPage"
          :total="totalCount"
          :page-sizes="pageSizeOptions"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handlePageSizeChange"
          :disabled="loading"
        />
      </div>
    </el-card>

    <!-- Details Dialog -->
    <el-dialog
      v-model="detailsDialog"
      title="Audit Log Details"
      width="800px"
      :close-on-click-modal="false"
    >
      <div v-if="selectedLog" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="User">
            <div>
              <div>{{ selectedLog.user_name || selectedLog.user_email || 'N/A' }}</div>
              <div class="text-caption" v-if="selectedLog.user_position">
                {{ selectedLog.user_position }}
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="Date & Time">
            {{ formatDateTime(selectedLog.date_created) }}
          </el-descriptions-item>
          <el-descriptions-item label="Action Type">
            <el-tag :type="getActionTypeColor(selectedLog.action_type)" size="small">
              {{ selectedLog.action_type }}
            </el-tag>
          </el-descriptions-item>
          <!-- <el-descriptions-item label="Entity Type">
            {{ formatEntityType(selectedLog.entity_type) }}
          </el-descriptions-item> -->
          <el-descriptions-item label="Entity ID" v-if="selectedLog.entity_id">
            {{ selectedLog.entity_id }}
          </el-descriptions-item>
          <el-descriptions-item label="Status">
            <el-tag :type="getStatusColor(selectedLog.status)" size="small">
              {{ selectedLog.status.toUpperCase() }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Route Accessed" :span="2">
            <code>{{ selectedLog.description || 'N/A' }}</code>
          </el-descriptions-item>
          <el-descriptions-item label="IP Address" v-if="selectedLog.ip_address">
            {{ selectedLog.ip_address }}
          </el-descriptions-item>
          <el-descriptions-item label="User Agent" v-if="selectedLog.user_agent">
            {{ selectedLog.user_agent }}
          </el-descriptions-item>
          <el-descriptions-item label="Error Message" :span="2" v-if="selectedLog.error_message">
            <span class="error-text">{{ selectedLog.error_message }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="Old Values" :span="2" v-if="selectedLog.old_values">
            <pre class="json-preview">{{ JSON.stringify(selectedLog.old_values, null, 2) }}</pre>
          </el-descriptions-item>
          <el-descriptions-item label="New Values" :span="2" v-if="selectedLog.new_values">
            <pre class="json-preview">{{ JSON.stringify(selectedLog.new_values, null, 2) }}</pre>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailsDialog = false">Close</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuditTrailStore } from '@/stores/auditTrailStore'
import {
  Document,
  Clock,
  CircleCheck,
  Warning,
  Search,
  View,
  Refresh,
  RefreshRight
} from '@element-plus/icons-vue'

const auditTrailStore = useAuditTrailStore()

// Computed properties
const auditLogs = computed(() => auditTrailStore.auditLogs)
const loading = computed(() => auditTrailStore.loading)
const searchQuery = computed({
  get: () => auditTrailStore.searchQuery,
  set: (value) => auditTrailStore.setSearchQuery(value)
})
const filters = computed(() => auditTrailStore.filters)
const currentPage = computed({
  get: () => auditTrailStore.currentPage,
  set: (value) => auditTrailStore.setCurrentPage(value)
})
const totalPages = computed(() => auditTrailStore.totalPages)
const totalCount = computed(() => auditTrailStore.totalCount)
const itemsPerPage = computed({
  get: () => auditTrailStore.itemsPerPage,
  set: (value) => auditTrailStore.setPageSize(value)
})
const pageSizeOptions = computed(() => auditTrailStore.pageSizeOptions)
const summaryStats = computed(() => auditTrailStore.summaryStats)

// Local state
const detailsDialog = ref(false)
const selectedLog = ref(null)
const dateRange = ref([])
const sortBy = computed({
  get: () => auditTrailStore.filters.sortBy || 'Date (Newest)',
  set: (value) => auditTrailStore.setFilters({ sortBy: value })
})

// Methods
const fetchAuditLogs = async () => {
  await auditTrailStore.fetchAuditLogs()
}

const fetchSummaryStats = async () => {
  await auditTrailStore.fetchSummaryStats()
}

const handleSearch = () => {
  fetchAuditLogs()
}

const handleFilterChange = () => {
  fetchAuditLogs()
}

const handleDateRangeChange = () => {
  if (dateRange.value && dateRange.value.length === 2) {
    auditTrailStore.setFilters({
      date_from: dateRange.value[0],
      date_to: dateRange.value[1]
    })
  } else {
    auditTrailStore.setFilters({
      date_from: null,
      date_to: null
    })
  }
  fetchAuditLogs()
}

const handlePageChange = (page) => {
  auditTrailStore.setCurrentPage(page)
  fetchAuditLogs()
}

const handlePageSizeChange = () => {
  fetchAuditLogs()
}

const resetFilters = () => {
  auditTrailStore.resetFilters()
  // Reset to default date range (last 30 days / 1 month)
  initializeDefaultDateRange()
  fetchAuditLogs()
}

const viewDetails = (item) => {
  selectedLog.value = item
  detailsDialog.value = true
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatEntityType = (entityType) => {
  return entityType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const getActionTypeColor = (actionType) => {
  const colorMap = {
    CREATE: 'success',
    UPDATE: 'info',
    DELETE: 'danger',
    VIEW: 'primary',
    VIEW_LIST: 'primary',
    LOGIN: 'success',
    LOGOUT: 'warning',
    EXPORT: 'info',
    VIEW_CERTIFICATE: ''
  }
  return colorMap[actionType] || 'info'
}

const getStatusColor = (status) => {
  const colorMap = {
    success: 'success',
    failed: 'warning',
    error: 'danger'
  }
  return colorMap[status] || 'info'
}

const getStatusCount = (status) => {
  if (!summaryStats.value?.by_status) return 0
  const statusItem = summaryStats.value.by_status.find(item => item.status === status)
  return statusItem?.count || 0
}

// Initialize default date range (last 30 days / 1 month)
const initializeDefaultDateRange = () => {
  const today = new Date()
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(today.getMonth() - 1)
  
  dateRange.value = [oneMonthAgo, today]
  
  // Set filters with default date range
  auditTrailStore.setFilters({
    date_from: oneMonthAgo.toISOString().split('T')[0],
    date_to: today.toISOString().split('T')[0]
  })
}

// Lifecycle
onMounted(async () => {
  // Initialize default date range before fetching
  initializeDefaultDateRange()
  
  await Promise.all([
    fetchAuditLogs(),
    fetchSummaryStats()
  ])
})
</script>

<style scoped>
.audit-trail-page {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #303133;
}

.page-subtitle {
  color: #909399;
  font-size: 14px;
  margin: 0;
}

.summary-cards {
  margin-bottom: 24px;
}

.summary-card {
  height: 100%;
}

.card-content {
  display: flex;
  align-items: center;
}

.card-icon {
  margin-right: 16px;
}

.card-info {
  flex: 1;
}

.card-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.card-value {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.filter-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
}

.filter-form {
  margin-top: 0;
}

.table-card {
  margin-bottom: 24px;
}

.user-cell {
  min-width: 150px;
}

.user-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.user-position {
  font-size: 12px;
  color: #909399;
}

.route-code {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #409EFF;
  background-color: #F5F7FA;
  padding: 2px 6px;
  border-radius: 3px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #EBEEF5;
  flex-wrap: wrap;
  gap: 16px;
}

.pagination-info {
  font-size: 14px;
  color: #909399;
}

.detail-content {
  padding: 0;
}

.json-preview {
  background: #F5F7FA;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  max-height: 400px;
  overflow: auto;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.text-caption {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.error-text {
  color: #F56C6C;
}

@media (max-width: 768px) {
  .pagination-container {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-form {
    display: flex;
    flex-direction: column;
  }

  .filter-form :deep(.el-form-item) {
    margin-right: 0;
    margin-bottom: 16px;
  }
}
</style>
