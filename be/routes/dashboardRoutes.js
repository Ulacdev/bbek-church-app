const express = require('express');
const { getDashboardStats } = require('../dbHelpers/dashboardHelper');

const router = express.Router();

/**
 * GET DASHBOARD STATISTICS - Get all dashboard statistics in one call
 * GET /api/dashboard/stats
 */
router.get('/stats', async (req, res) => {
  try {
    const result = await getDashboardStats();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message || 'Failed to fetch dashboard statistics',
        error: result.message
      });
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch dashboard statistics'
    });
  }
});

module.exports = router;

