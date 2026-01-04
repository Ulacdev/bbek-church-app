const express = require('express');
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getCertificateDataByTransactionId,
  getCertificateDataByServiceId,
  getTotalsByServiceType,
  getTransactionsByMemberId
} = require('../dbHelpers/transactionRecords');

const router = express.Router();

/**
 * CREATE - Insert a new transaction record
 * POST /api/transactions/createTransaction
 * Body: { type_of_service, service_id, total, date_created? }
 */
router.post('/createTransaction', async (req, res) => {
  try {
    const result = await createTransaction(req.body);
    
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
    console.error('Error creating transaction:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create transaction'
    });
  }
});

/**
 * READ ALL - Get all transaction records with pagination and filters
 * GET /api/transactions/getAllTransactions
 * Query params: search, limit, offset, page, pageSize, type_of_service, sortBy
 */
router.get('/getAllTransactions', async (req, res) => {
  try {
    const options = req.query;
    const result = await getAllTransactions(options);
    
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
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch transactions'
    });
  }
});

/**
 * READ ONE - Get a single transaction by ID
 * GET /api/transactions/getTransactionById/:id
 */
router.get('/getTransactionById/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getTransactionById(id);
    
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
    console.error('Error fetching transaction:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch transaction'
    });
  }
});

/**
 * UPDATE - Update an existing transaction record
 * PUT /api/transactions/updateTransaction/:id
 * Body: { type_of_service?, service_id?, total?, date_created? }
 */
router.put('/updateTransaction/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateTransaction(id, req.body);
    
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
    console.error('Error updating transaction:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update transaction'
    });
  }
});

/**
 * DELETE - Delete a transaction record
 * DELETE /api/transactions/deleteTransaction/:id
 */
router.delete('/deleteTransaction/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const archivedBy = req.user?.acc_id || null;
    const result = await deleteTransaction(id, archivedBy);
    
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
    console.error('Error deleting transaction:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete transaction'
    });
  }
});

/**
 * GET CERTIFICATE DATA - Get service data for certificate based on transaction
 * GET /api/transactions/getCertificateData/:id
 */
router.get('/getCertificateData/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getCertificateDataByTransactionId(id);
    
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
    console.error('Error fetching certificate data:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch certificate data'
    });
  }
});

/**
 * GET CERTIFICATE DATA BY SERVICE - Get service data for certificate based on service ID and type
 * GET /api/transactions/getCertificateDataByService/:serviceId/:typeOfService
 */
router.get('/getCertificateDataByService/:serviceId/:typeOfService', async (req, res) => {
  try {
    const { serviceId, typeOfService } = req.params;
    const result = await getCertificateDataByServiceId(serviceId, typeOfService);
    
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
    console.error('Error fetching certificate data by service:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch certificate data'
    });
  }
});

/**
 * GET TOTALS BY SERVICE TYPE - Get total amount per service type
 * GET /api/transactions/getTotalsByServiceType
 */
router.get('/getTotalsByServiceType', async (req, res) => {
  try {
    const result = await getTotalsByServiceType();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        summary: result.summary
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.message
      });
    }
  } catch (error) {
    console.error('Error fetching totals by service type:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch totals by service type'
    });
  }
});

/**
 * GET TRANSACTIONS BY MEMBER ID - Get all transactions for a specific member
 * GET /api/transactions/getTransactionsByMemberId/:memberId
 * Query params: search, limit, offset, page, pageSize, type_of_service, sortBy
 */
router.get('/getTransactionsByMemberId/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    const options = req.query;
    const result = await getTransactionsByMemberId(memberId, options);
    
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
    console.error('Error fetching transactions by member ID:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch member transactions'
    });
  }
});

module.exports = router;

