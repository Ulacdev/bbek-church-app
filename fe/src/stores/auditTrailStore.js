import { defineStore } from 'pinia'
import axios from '@/api/axios'

export const useAuditTrailStore = defineStore('auditTrail', {
  state: () => ({
    auditLogs: [],
    loading: false,
    error: null,
    searchQuery: '',
    filters: {
      user_id: null,
      action_type: 'All Actions',
      entity_type: 'All Entities',
      status: 'All Statuses',
      date_from: null,
      date_to: null,
      sortBy: 'Date (Newest)'
    },
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    itemsPerPage: 10,
    pageSizeOptions: [10, 25, 50, 100],
    summaryStats: null
  }),

  getters: {
    filteredAuditLogs: (state) => {
      return state.auditLogs
    },

    paginatedAuditLogs: (state) => {
      return state.auditLogs
    }
  },

  actions: {
    async fetchAuditLogs() {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('token')
        const params = {
          page: this.currentPage,
          pageSize: this.itemsPerPage,
          search: this.searchQuery || undefined,
          user_id: this.filters.user_id || undefined,
          action_type: this.filters.action_type && this.filters.action_type !== 'All Actions' ? this.filters.action_type : undefined,
          entity_type: this.filters.entity_type && this.filters.entity_type !== 'All Entities' ? this.filters.entity_type : undefined,
          status: this.filters.status && this.filters.status !== 'All Statuses' ? this.filters.status : undefined,
          date_from: this.filters.date_from || undefined,
          date_to: this.filters.date_to || undefined,
          sortBy: this.filters.sortBy || 'Date (Newest)'
        }

        // Remove undefined values
        Object.keys(params).forEach(key => params[key] === undefined && delete params[key])

        const accessToken = localStorage.getItem('accessToken')
        const response = await axios.get('/audit-trail/getAllAuditLogs', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params
        })

        if (response.data.success) {
          this.auditLogs = response.data.data || []
          this.totalCount = response.data.totalCount || 0
          this.totalPages = response.data.pagination?.totalPages || 1
        } else {
          throw new Error(response.data.message || 'Failed to fetch audit logs')
        }
      } catch (error) {
        console.error('Error fetching audit logs:', error)
        this.error = error.response?.data?.error || error.message || 'Failed to fetch audit logs'
        this.auditLogs = []
      } finally {
        this.loading = false
      }
    },

    async fetchAuditLogById(id) {
      this.loading = true
      this.error = null

      try {
        const accessToken = localStorage.getItem('accessToken')
        const response = await axios.get(`/audit-trail/getAuditLogById/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        if (response.data.success) {
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Failed to fetch audit log')
        }
      } catch (error) {
        console.error('Error fetching audit log:', error)
        this.error = error.response?.data?.error || error.message || 'Failed to fetch audit log'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchSummaryStats() {
      try {
        const accessToken = localStorage.getItem('accessToken')
        const response = await axios.get('/audit-trail/getAuditTrailSummary', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        if (response.data.success) {
          this.summaryStats = response.data.data
        }
      } catch (error) {
        console.error('Error fetching summary stats:', error)
      }
    },

    setSearchQuery(query) {
      this.searchQuery = query
      this.currentPage = 1
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
      this.currentPage = 1
    },

    setCurrentPage(page) {
      this.currentPage = page
    },

    setPageSize(size) {
      this.itemsPerPage = size
      this.currentPage = 1
    },

    resetFilters() {
      this.searchQuery = ''
      this.filters = {
        user_id: null,
        action_type: 'All Actions',
        entity_type: 'All Entities',
        status: 'All Statuses',
        date_from: null,
        date_to: null,
        sortBy: 'Date (Newest)'
      }
      this.currentPage = 1
    }
  }
})

