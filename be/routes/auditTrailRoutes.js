const express = require('express');
const {
  getAllAuditLogs,
  getAuditLogById,
  getAuditTrailSummary
} = require('../dbHelpers/auditTrailRecords');

const router = express.Router();

/**
 * READ ALL - Get all audit trail records with pagination and filters
 * GET /api/audit-trail/getAllAuditLogs
 * Query params: search, limit, offset, page, pageSize, user_id, action_type, entity_type, status, date_from, date_to, sortBy
 */
router.get('/getAllAuditLogs', async (req, res) => {
  try {
    const options = req.query;
    
    // Ensure pagination is always provided to prevent "Out of sort memory" errors
    // If no pagination is specified, default to page 1 with 50 records
    if (!options.page && !options.pageSize && !options.limit) {
      options.page = options.page || '1';
      options.pageSize = options.pageSize || '50';
    }
    
    // Note: Date range defaults to last 30 days (1 month) if not specified
    // This prevents sorting the entire audit trail table
    
    const result = await getAllAuditLogs(options);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        count: result.count,
        totalCount: result.totalCount,
        pagination: result.pagination
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.message
      });
    }
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    
    // Handle specific MySQL sort memory error
    if (error.code === 'ER_OUT_OF_SORTMEMORY') {
      res.status(500).json({
        success: false,
        error: 'Query too large. Please use pagination (page and pageSize parameters) to fetch results in smaller chunks.',
        message: 'Please specify pagination parameters (page and pageSize) to reduce the query size.'
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch audit logs'
      });
    }
  }
});

/**
 * READ ONE - Get a single audit log by ID
 * GET /api/audit-trail/getAuditLogById/:id
 */
router.get('/getAuditLogById/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getAuditLogById(parseInt(id));
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.message,
        data: null
      });
    }
  } catch (error) {
    console.error('Error fetching audit log:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch audit log'
    });
  }
});

/**
 * GET SUMMARY - Get audit trail summary statistics
 * GET /api/audit-trail/getAuditTrailSummary
 */
router.get('/getAuditTrailSummary', async (req, res) => {
  try {
    const result = await getAuditTrailSummary();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.message
      });
    }
  } catch (error) {
    console.error('Error fetching audit trail summary:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch audit trail summary'
    });
  }
});

module.exports = router;

