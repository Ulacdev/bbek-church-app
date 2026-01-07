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
const { getMemberById, createMember } = require('../../dbHelpers/church_records/memberRecords');
const { getAccountByEmail, createAccount } = require('../../dbHelpers/church_records/accountRecords');
const { sendAccountDetails } = require('../../dbHelpers/emailHelperSendGrid');
const { query } = require('../../database/db');

const router = express.Router();

/**
 * CREATE - Insert a new water baptism record
 * POST /api/services/water-baptisms/createWaterBaptism
 * Body: {
 *   baptism_id?,
 *   member_id?,           // Required for members
 *   is_member?,           // true = member, false = non-member (default: true)
 *   firstname?,           // Required for non-members
 *   lastname?,            // Required for non-members
 *   middle_name?,
 *   email?,               // Required for non-members
 *   phone_number?,
 *   birthdate?,
 *   age?,
 *   gender?,
 *   address?,
 *   civil_status?,
 *   baptism_date?,
 *   location?,
 *   pastor_name?,
 *   status?,
 *   guardian_name?,
 *   guardian_contact?,
 *   guardian_relationship?,
 *   date_created?
 * }
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
 * When status is changed to "completed", sends account setup email to the member
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

    // Get current baptism record to check if status is changing to "completed"
    const currentBaptism = await getWaterBaptismById(id);
    const isStatusChangingToCompleted = 
      req.body.status && 
      req.body.status === 'completed' && 
      currentBaptism.success && 
      currentBaptism.data && 
      currentBaptism.data.status !== 'completed';

    const result = await updateWaterBaptism(id, req.body);
    
    if (result.success) {
      // If status changed to "completed" and this is a non-member, create member record
      if (isStatusChangingToCompleted) {
        const baptism = currentBaptism.data;
        
        if (baptism.is_member === 0 || baptism.member_id === null) {
          // This is a non-member - create member record
          try {
            console.log(`Creating member record for non-member baptism: ${id}`);
            
            // Format birthdate to YYYY-MM-DD
            let formattedBirthdate = null;
            if (baptism.birthdate) {
              try {
                formattedBirthdate = moment(baptism.birthdate).format('YYYY-MM-DD');
              } catch (e) {
                console.error('Error formatting birthdate:', e);
                formattedBirthdate = null;
              }
            }
            
            // Truncate address if too long (VARCHAR(45))
            let formattedAddress = baptism.address || '';
            if (formattedAddress.length > 44) {
              formattedAddress = formattedAddress.substring(0, 44);
            }
            
            // Create member from baptism data
            const memberData = {
              firstname: baptism.firstname || '',
              lastname: baptism.lastname || '',
              middle_name: baptism.middle_name || null,
              birthdate: formattedBirthdate,
              age: baptism.age || '',
              gender: baptism.gender || '',
              address: formattedAddress,
              email: baptism.email || '',
              phone_number: baptism.phone_number || '',
              civil_status: baptism.civil_status || null,
              guardian_name: baptism.guardian_name || null,
              guardian_contact: baptism.guardian_contact || null,
              guardian_relationship: baptism.guardian_relationship || null,
              position: 'Member'
            };
            
            console.log('Creating member with data:', JSON.stringify(memberData, null, 2));
            
            const memberResult = await createMember(memberData);
            
            if (memberResult.success && memberResult.data) {
              const newMemberId = memberResult.data.member_id;
              console.log(`Member created with ID: ${newMemberId}`);
              
              // Update water baptism record with new member_id
              await updateWaterBaptism(id, { member_id: newMemberId, is_member: true });
              
              // Create account for the new member
              const tempPassword = Math.random().toString(36).slice(-12);
              const accountData = {
                email: baptism.email,
                password: tempPassword,
                position: 'Member',
                acc_name: `${baptism.firstname} ${baptism.lastname}`
              };
              
              const accountResult = await createAccount(accountData);
              
              if (accountResult.success && accountResult.data) {
                const account = accountResult.data;
                
                // Send welcome email with account details
                const name = `${baptism.firstname} ${baptism.middle_name ? baptism.middle_name + ' ' : ''}${baptism.lastname}`.trim();
                await sendAccountDetails({
                  acc_id: account.acc_id,
                  email: baptism.email,
                  name: name,
                  type: 'new_account',
                  temporaryPassword: tempPassword
                });
                
                console.log(`Account created and welcome email sent to ${baptism.email}`);
              }
            }
          } catch (memberErr) {
            console.error('Error creating member from completed baptism:', memberErr);
            // Don't fail the update, but log the error
          }
        } else {
          // Existing member - just send account setup email
          try {
            const memberResult = await getMemberById(result.data.member_id);
            if (memberResult.success && memberResult.data) {
              const member = memberResult.data;
              
              const accountResult = await getAccountByEmail(member.email);
              if (accountResult.success && accountResult.data) {
                const account = accountResult.data;
                
                const name = `${member.firstname} ${member.middle_name ? member.middle_name + ' ' : ''}${member.lastname}`.trim();
                await sendAccountDetails({
                  acc_id: account.acc_id,
                  email: member.email,
                  name: name,
                  type: 'new_account',
                  temporaryPassword: 'TestPassword123!'
                });
                
                console.log(`Account setup email sent to ${member.email} for completed baptism ID: ${id}`);
              }
            }
          } catch (emailErr) {
            console.error('Error sending account setup email for completed baptism:', emailErr);
          }
        }
      }

      res.status(200).json({
        success: true,
        message: result.message + (isStatusChangingToCompleted ? ' Member record created and welcome email sent.' : ''),
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

/**
 * CREATE - Non-member water baptism registration
 * POST /api/services/water-baptisms/register-non-member
 * Body: {
 *   firstname, lastname, middle_name, email, phone_number,
 *   birthdate, age, gender, address, civil_status,
 *   guardian_name, guardian_contact, guardian_relationship,
 *   baptism_date?, location?, pastor_name?
 * }
 * This creates a water baptism record WITHOUT creating a member record
 */
router.post('/register-non-member', async (req, res) => {
  try {
    // Validate required fields for non-member
    const { firstname, lastname, email } = req.body;
    
    if (!firstname || !lastname || !email) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and email are required for non-member registration'
      });
    }
    
    // Create water baptism record with is_member = 0
    const baptismData = {
      ...req.body,
      is_member: false,
      member_id: null,
      status: 'pending'
    };
    
    const result = await createWaterBaptism(baptismData);
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Water baptism registration submitted successfully! You will receive an email with further instructions.',
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
    console.error('Error registering non-member for water baptism:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to register for water baptism'
    });
  }
});

/**
 * CHECK EMAIL EXISTS - Check if an email already exists in accounts table
 * GET /api/services/water-baptisms/check-email-exists?email=xxx
 * This prevents creating duplicate accounts
 */
router.get('/check-email-exists', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Direct query to avoid circular dependency
    const sql = 'SELECT acc_id, email FROM tbl_accounts WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))';
    const [rows] = await query(sql, [email]);
    
    if (rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
        data: { exists: true, account: rows[0] }
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Email is available',
      data: { exists: false }
    });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to check email'
    });
  }
});

module.exports = router;

