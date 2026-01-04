const express = require('express');
const moment = require('moment');
const { registerMemberFromWaterBaptism, registerMemberFromBurialService } = require('../dbHelpers/memberRegistration');

const router = express.Router();


/**
 * PUBLIC REGISTRATION - Register member from Water Baptism landing page
 * POST /api/member-registration/register/water-baptism
 */
router.post('/register/water-baptism', async (req, res) => {
  try {
    console.log('Water baptism registration request received:', {
      body: req.body,
      timestamp: new Date().toISOString()
    });
    
    const result = await registerMemberFromWaterBaptism(req.body || {});

    if (result.success) {
      return res.status(201).json({
        success: true,
        message: result.message,
        data: result.data
      });
    }

    console.log('Water baptism registration failed:', {
      message: result.message,
      errors: result.errors
    });

    return res.status(400).json({
      success: false,
      message: result.message || 'Registration failed',
      errors: result.errors && result.errors.length > 0 ? result.errors : [result.message || 'Registration failed']
    });
  } catch (error) {
    console.error('Error registering member from water baptism form:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      errors: error.message ? [error.message] : ['An unexpected server error occurred']
    });
  }
});

/**
 * PUBLIC REGISTRATION - Register member from Burial Service landing page
 * POST /api/member-registration/register/burial-service
 */
router.post('/register/burial-service', async (req, res) => {
  try {
    console.log('Burial service registration request received:', {
      body: req.body,
      timestamp: new Date().toISOString()
    });
    
    const result = await registerMemberFromBurialService(req.body || {});

    if (result.success) {
      return res.status(201).json({
        success: true,
        message: result.message,
        data: result.data
      });
    }

    console.log('Burial service registration failed:', {
      message: result.message,
      errors: result.errors
    });

    return res.status(400).json({
      success: false,
      message: result.message || 'Registration failed',
      errors: result.errors && result.errors.length > 0 ? result.errors : [result.message || 'Registration failed']
    });
  } catch (error) {
    console.error('Error registering member from burial service form:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      errors: error.message ? [error.message] : ['An unexpected server error occurred']
    });
  }
});

module.exports = router;

