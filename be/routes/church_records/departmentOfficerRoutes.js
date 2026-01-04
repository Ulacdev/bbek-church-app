const express = require('express');
const moment = require('moment');
const {
  createDepartmentOfficer,
  getAllDepartmentOfficers,
  getDepartmentOfficerById,
  getDepartmentOfficerByMemberId,
  updateDepartmentOfficer,
  deleteDepartmentOfficer,
  exportDepartmentOfficersToExcel
} = require('../../dbHelpers/church_records/departmentOfficerRecords');

const router = express.Router();

/**
 * CREATE - Insert a new department officer record
 * POST /api/church-records/department-officers/createDepartmentOfficer
 */
router.post('/createDepartmentOfficer', async (req, res) => {
  try {
    const result = await createDepartmentOfficer(req.body);
    
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
    console.error('Error creating department officer:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create department officer'
    });
  }
});

/**
 * READ ALL - Get all department officer records with pagination and filters
 * GET /api/church-records/department-officers/getAllDepartmentOfficers (query params)
 * POST /api/church-records/department-officers/getAllDepartmentOfficers (body payload)
 * Parameters: search, limit, offset, page, pageSize, sortBy
 */
router.get('/getAllDepartmentOfficers', async (req, res) => {
  try {
    // Get parameters from query string
    const options = req.query;
    const result = await getAllDepartmentOfficers(options);
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        count: result.count, // Number of records in current page
        totalCount: result.totalCount, // Total number of records
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
    console.error('Error fetching department officers:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch department officers'
    });
  }
});

router.post('/getAllDepartmentOfficers', async (req, res) => {
  try {
    // Get parameters from request body (payload)
    const options = req.body;
    const result = await getAllDepartmentOfficers(options);
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        count: result.count, // Number of records in current page
        totalCount: result.totalCount, // Total number of records
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
    console.error('Error fetching department officers:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch department officers'
    });
  }
});

/**
 * READ ONE - Get a single department officer by ID
 * GET /api/church-records/department-officers/getDepartmentOfficerById/:id
 */
router.get('/getDepartmentOfficerById/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const officerId = parseInt(id);

    if (isNaN(officerId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid officer ID'
      });
    }

    const result = await getDepartmentOfficerById(officerId);
    
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
    console.error('Error fetching department officer:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch department officer'
    });
  }
});

/**
 * READ ONE - Get a single department officer by member_id
 * GET /api/church-records/department-officers/getDepartmentOfficerByMemberId/:memberId
 */
router.get('/getDepartmentOfficerByMemberId/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        error: 'Member ID is required'
      });
    }

    const result = await getDepartmentOfficerByMemberId(memberId);
    
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
    console.error('Error fetching department officer by member ID:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch department officer'
    });
  }
});

/**
 * UPDATE - Update an existing department officer record
 * PUT /api/church-records/department-officers/updateDepartmentOfficer/:id
 */
router.put('/updateDepartmentOfficer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const officerId = parseInt(id);

    if (isNaN(officerId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid officer ID'
      });
    }

    const result = await updateDepartmentOfficer(officerId, req.body);
    
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
    console.error('Error updating department officer:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update department officer'
    });
  }
});

/**
 * DELETE - Delete a department officer record
 * DELETE /api/church-records/department-officers/deleteDepartmentOfficer/:id
 */
router.delete('/deleteDepartmentOfficer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const officerId = parseInt(id);

    if (isNaN(officerId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid officer ID'
      });
    }

    const archivedBy = req.user?.acc_id || null;
    const result = await deleteDepartmentOfficer(officerId, archivedBy);
    
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
    console.error('Error deleting department officer:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete department officer'
    });
  }
});

/**
 * EXPORT - Export department officer records to Excel
 * GET /api/church-records/department-officers/exportExcel (query params)
 * POST /api/church-records/department-officers/exportExcel (body payload)
 */
router.get('/exportExcel', async (req, res) => {
  try {
    // Get parameters from query string
    const options = req.query;
    const excelBuffer = await exportDepartmentOfficersToExcel(options);
    
    // Generate filename with timestamp
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const filename = `department_officers_export_${timestamp}.xlsx`;
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', excelBuffer.length);
    
    // Send the Excel file
    res.send(excelBuffer);
  } catch (error) {
    console.error('Error exporting department officers to Excel:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to export department officers to Excel'
    });
  }
});

router.post('/exportExcel', async (req, res) => {
  try {
    // Get parameters from request body (payload)
    const options = req.body;
    const excelBuffer = await exportDepartmentOfficersToExcel(options);
    
    // Generate filename with timestamp
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const filename = `department_officers_export_${timestamp}.xlsx`;
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', excelBuffer.length);
    
    // Send the Excel file
    res.send(excelBuffer);
  } catch (error) {
    console.error('Error exporting department officers to Excel:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to export department officers to Excel'
    });
  }
});

module.exports = router;

