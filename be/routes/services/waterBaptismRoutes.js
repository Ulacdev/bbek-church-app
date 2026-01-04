const express = require('express');
const moment = require('moment');
const {
  createWaterBaptism,
  getAllWaterBaptisms,
  getWaterBaptismById,
  getWaterBaptismByMemberId,
  updateWaterBaptism,
  deleteWaterBaptism,
  exportWaterBaptismsToExcel
} = require('../../dbHelpers/services/waterBaptismRecords');

const router = express.Router();

/**
 * CREATE - Insert a new water baptism record
 * POST /api/services/water-baptisms/createWaterBaptism
 * Body: { baptism_id?, member_id, baptism_date, status?, date_created? }
 */
router.post('/createWaterBaptism', async (req, res) => {
  try {
    const result = await createWaterBaptism(req.body);
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error || result.message
      });
    }
  } catch (error) {
    console.error('Error creating water baptism:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create water baptism'
    });
  }
});

/**
 * READ ALL - Get all water baptism records with pagination and filters
 * GET /api/services/water-baptisms/getAllWaterBaptisms (query params)
 * POST /api/services/water-baptisms/getAllWaterBaptisms (body payload)
 * Parameters: search, limit, offset, page, pageSize, status, sortBy
 */
router.get('/getAllWaterBaptisms', async (req, res) => {
  try {
    // Get parameters from query string
    const options = req.query;
    const result = await getAllWaterBaptisms(options);
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        count: result.count, // Number of records in current page
        totalCount: result.totalCount, // Total number of records
        summaryStats: result.summaryStats, // Summary statistics from all records
        thisYearCount: result.thisYearCount, // Count of baptisms this year
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
    console.error('Error fetching water baptisms:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch water baptisms'
    });
  }
});

router.post('/getAllWaterBaptisms', async (req, res) => {
  try {
    // Get parameters from request body (payload)
    const options = req.body;
    const result = await getAllWaterBaptisms(options);
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        count: result.count, // Number of records in current page
        totalCount: result.totalCount, // Total number of records
        summaryStats: result.summaryStats, // Summary statistics from all records
        thisYearCount: result.thisYearCount, // Count of baptisms this year
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
    console.error('Error fetching water baptisms:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch water baptisms'
    });
  }
});

/**
 * READ ONE - Get a single water baptism by ID
 * GET /api/services/water-baptisms/getWaterBaptismById/:id
 */
router.get('/getWaterBaptismById/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Baptism ID is required'
      });
    }

    const result = await getWaterBaptismById(id);
    
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
        error: result.message
      });
    }
  } catch (error) {
    console.error('Error fetching water baptism:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch water baptism'
    });
  }
});

/**
 * READ ONE - Get a single water baptism by member_id
 * GET /api/services/water-baptisms/getWaterBaptismByMemberId/:memberId
 */
router.get('/getWaterBaptismByMemberId/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        error: 'Member ID is required'
      });
    }

    const result = await getWaterBaptismByMemberId(memberId);
    
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
        error: result.message
      });
    }
  } catch (error) {
    console.error('Error fetching water baptism by member ID:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch water baptism'
    });
  }
});

/**
 * UPDATE - Update an existing water baptism record
 * PUT /api/services/water-baptisms/updateWaterBaptism/:id
 * Body: { member_id?, baptism_date?, status?, date_created? }
 */
router.put('/updateWaterBaptism/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Baptism ID is required'
      });
    }

    const result = await updateWaterBaptism(id, req.body);
    
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
        error: result.error || result.message
      });
    }
  } catch (error) {
    console.error('Error updating water baptism:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update water baptism'
    });
  }
});

/**
 * DELETE - Delete a water baptism record
 * DELETE /api/services/water-baptisms/deleteWaterBaptism/:id
 */
router.delete('/deleteWaterBaptism/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Baptism ID is required'
      });
    }

    const archivedBy = req.user?.acc_id || null;
    const result = await deleteWaterBaptism(id, archivedBy);
    
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
        error: result.message
      });
    }
  } catch (error) {
    console.error('Error deleting water baptism:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete water baptism'
    });
  }
});

/**
 * EXPORT - Export water baptism records to Excel
 * GET /api/services/water-baptisms/exportExcel (query params)
 * POST /api/services/water-baptisms/exportExcel (body payload)
 */
router.get('/exportExcel', async (req, res) => {
  try {
    const options = req.query;
    const excelBuffer = await exportWaterBaptismsToExcel(options);
    
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const filename = `water_baptisms_export_${timestamp}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', excelBuffer.length);
    
    res.send(excelBuffer);
  } catch (error) {
    console.error('Error exporting water baptisms to Excel:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to export water baptisms to Excel'
    });
  }
});

router.post('/exportExcel', async (req, res) => {
  try {
    const options = req.body;
    const excelBuffer = await exportWaterBaptismsToExcel(options);
    
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const filename = `water_baptisms_export_${timestamp}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', excelBuffer.length);
    
    res.send(excelBuffer);
  } catch (error) {
    console.error('Error exporting water baptisms to Excel:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to export water baptisms to Excel'
    });
  }
});

module.exports = router;

