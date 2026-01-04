const express = require('express');
const {
  getAllArchives,
  getArchiveById,
  restoreArchive,
  getArchiveSummary
} = require('../dbHelpers/archiveRecords');

const router = express.Router();

/**
 * READ ALL - Get all archived records with pagination and filters
 * GET /api/archives/getAllArchives
 * Query params: search, limit, offset, page, pageSize, original_table, restored, date_from, date_to, sortBy
 */
router.get('/getAllArchives', async (req, res) => {
  try {
    const options = req.query;
    const result = await getAllArchives(options);
    
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
    console.error('Error fetching archives:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch archives'
    });
  }
});

/**
 * READ ONE - Get a single archive record by ID
 * GET /api/archives/getArchiveById/:id
 */
router.get('/getArchiveById/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getArchiveById(parseInt(id));
    
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
    console.error('Error fetching archive:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch archive'
    });
  }
});

/**
 * RESTORE - Restore an archived record back to its original table
 * POST /api/archives/restoreArchive/:id
 * Body: { restored_by?, restore_notes? }
 */
router.post('/restoreArchive/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { restored_by, restore_notes } = req.body;
    const userId = restored_by || req.user?.acc_id || null;

    const result = await restoreArchive(parseInt(id), userId, restore_notes);
    
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
    console.error('Error restoring archive:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to restore archive'
    });
  }
});

/**
 * GET SUMMARY - Get archive summary statistics
 * GET /api/archives/getArchiveSummary
 */
router.get('/getArchiveSummary', async (req, res) => {
  try {
    const result = await getArchiveSummary();
    
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
    console.error('Error fetching archive summary:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch archive summary'
    });
  }
});

module.exports = router;

