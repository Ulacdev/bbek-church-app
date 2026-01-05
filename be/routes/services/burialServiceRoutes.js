const express = require('express');
const moment = require('moment');
const {
  createBurialService,
  getAllBurialServices,
  getBurialServiceById,
  getBurialServicesByMemberId,
  updateBurialService,
  deleteBurialService,
  exportBurialServicesToExcel,
  searchBurialServicesFulltext
} = require('../../dbHelpers/services/burialServiceRecords');

const router = express.Router();

/**
 * CREATE - Insert a new burial service record
 * POST /api/church-records/burial-services/createBurialService
 * Body: { burial_id?, member_id, requestor, relationship, location, pastor_id, service_date, status?, date_created? }
 */
router.post('/createBurialService', async (req, res) => {
  try {
    const result = await createBurialService(req.body);
    
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
    console.error('Error creating burial service:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create burial service'
    });
  }
});

/**
 * READ ALL - Get all burial service records with pagination and filters
 * GET /api/church-records/burial-services/getAllBurialServices (query params)
 * POST /api/church-records/burial-services/getAllBurialServices (body payload)
 * Parameters: search, limit, offset, page, pageSize, status, sortBy
 */
router.get('/getAllBurialServices', async (req, res) => {
  try {
    // Get parameters from query string
    const options = req.query;
    const result = await getAllBurialServices(options);
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        count: result.count, // Number of records in current page
        totalCount: result.totalCount, // Total number of records
        summaryStats: result.summaryStats, // Summary statistics from all records
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
    console.error('Error fetching burial services:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch burial services'
    });
  }
});

router.post('/getAllBurialServices', async (req, res) => {
  try {
    // Get parameters from request body (payload)
    const options = req.body;
    const result = await getAllBurialServices(options);
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        count: result.count, // Number of records in current page
        totalCount: result.totalCount, // Total number of records
        summaryStats: result.summaryStats, // Summary statistics from all records
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
    console.error('Error fetching burial services:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch burial services'
    });
  }
});

/**
 * READ - Get burial services by member_id
 * GET /api/church-records/burial-services/getBurialServicesByMemberId/:memberId
 */
router.get('/getBurialServicesByMemberId/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        error: 'Member ID is required'
      });
    }

    const result = await getBurialServicesByMemberId(memberId);
    
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
    console.error('Error fetching burial services by member ID:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch burial services'
    });
  }
});

/**
 * READ ONE - Get a single burial service by ID
 * GET /api/church-records/burial-services/getBurialServiceById/:id
 */
router.get('/getBurialServiceById/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Burial ID is required'
      });
    }

    const result = await getBurialServiceById(id);
    
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
    console.error('Error fetching burial service:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch burial service'
    });
  }
});

/**
 * UPDATE - Update an existing burial service record
 * PUT /api/church-records/burial-services/updateBurialService/:id
 * Body: { member_id?, requestor?, relationship?, location?, pastor_id?, service_date?, status?, date_created? }
 */
router.put('/updateBurialService/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Burial ID is required'
      });
    }

    const result = await updateBurialService(id, req.body);
    
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
    console.error('Error updating burial service:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update burial service'
    });
  }
});

/**
 * DELETE - Delete a burial service record
 * DELETE /api/church-records/burial-services/deleteBurialService/:id
 */
router.delete('/deleteBurialService/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Burial ID is required'
      });
    }

    const archivedBy = req.user?.acc_id || null;
    const result = await deleteBurialService(id, archivedBy);
    
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
    console.error('Error deleting burial service:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete burial service'
    });
  }
});

/**
 * EXPORT - Export burial service records to Excel
 * GET /api/church-records/burial-services/exportExcel (query params)
 * POST /api/church-records/burial-services/exportExcel (body payload)
 */
router.get('/exportExcel', async (req, res) => {
  try {
    const options = req.query;
    const excelBuffer = await exportBurialServicesToExcel(options);
    
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const filename = `burial_services_export_${timestamp}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', excelBuffer.length);
    
    res.send(excelBuffer);
  } catch (error) {
    console.error('Error exporting burial services to Excel:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to export burial services to Excel'
    });
  }
});

router.post('/exportExcel', async (req, res) => {
  try {
    const options = req.body;
    const excelBuffer = await exportBurialServicesToExcel(options);
    
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const filename = `burial_services_export_${timestamp}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', excelBuffer.length);
    
    res.send(excelBuffer);
  } catch (error) {
    console.error('Error exporting burial services to Excel:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to export burial services to Excel'
    });
  }
});

/**
 * FULLTEXT SEARCH - Advanced search using FULLTEXT indexes
 * GET /api/church-records/burial-services/searchFulltext
 * POST /api/church-records/burial-services/searchFulltext
 * Parameters: search (required), limit, offset, minRelevance
 */
router.get('/searchFulltext', async (req, res) => {
  try {
    const options = { ...req.query, useFulltext: true };
    const result = await searchBurialServicesFulltext(options);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        count: result.count,
        totalCount: result.totalCount,
        searchTerm: result.searchTerm,
        relevanceThreshold: result.relevanceThreshold
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.message
      });
    }
  } catch (error) {
    console.error('Error in FULLTEXT search:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to perform FULLTEXT search'
    });
  }
});

router.post('/searchFulltext', async (req, res) => {
  try {
    const options = { ...req.body, useFulltext: true };
    const result = await searchBurialServicesFulltext(options);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        count: result.count,
        totalCount: result.totalCount,
        searchTerm: result.searchTerm,
        relevanceThreshold: result.relevanceThreshold
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.message
      });
    }
  } catch (error) {
    console.error('Error in FULLTEXT search:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to perform FULLTEXT search'
    });
  }
});

module.exports = router;

