const { query } = require('../../database/db');
const moment = require('moment');
const XLSX = require('xlsx');
const { archiveBeforeDelete } = require('../archiveHelper');

/**
 * Tithes Records CRUD Operations
 * Based on tbl_tithes schema:
 * - tithes_id (INT, PK, NN, AI) - auto-incrementing
 * - member_id (VARCHAR(45), NN, UQ)
 * - amount (DOUBLE, NN)
 * - type (VARCHAR(45), NN)
 * - payment_method (VARCHAR(45), NN)
 * - notes (VARCHAR(2000), nullable)
 * - status (VARCHAR(45), NN, default: 'pending')
 * - date_created (DATETIME, NN)
 */

/**
 * Check if a tithe with the same member_id already exists
 * @param {String} memberId - Member ID to check
 * @param {Number} excludeTithesId - Optional tithes_id to exclude from check (for updates)
 * @returns {Promise<Object>} Object with isDuplicate flag
 */
async function checkDuplicateTithe(memberId, excludeTithesId = null) {
  try {
    let sql = 'SELECT tithes_id, member_id FROM tbl_tithes WHERE member_id = ?';
    const params = [memberId];

    if (excludeTithesId) {
      sql += ' AND tithes_id != ?';
      params.push(excludeTithesId);
    }

    const [rows] = await query(sql, params);

    return {
      isDuplicate: rows.length > 0,
      tithe: rows.length > 0 ? rows[0] : null
    };
  } catch (error) {
    console.error('Error checking for duplicate tithe:', error);
    throw error;
  }
}

/**
 * CREATE - Insert a new tithe record
 * @param {Object} titheData - Tithe data object
 * @returns {Promise<Object>} Result object
 */
async function createTithe(titheData) {
  try {
    const {
      member_id,
      amount,
      type,
      payment_method,
      notes = null,
      status = 'pending',
      date_created = new Date()
    } = titheData;

    // Validate required fields
    if (!member_id) {
      throw new Error('Missing required field: member_id');
    }
    if (amount === undefined || amount === null) {
      throw new Error('Missing required field: amount');
    }
    if (!type) {
      throw new Error('Missing required field: type');
    }
    if (!payment_method) {
      throw new Error('Missing required field: payment_method');
    }

    // Validate amount is a number
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue < 0) {
      throw new Error('Amount must be a valid positive number');
    }

    // Check for duplicate member_id
    const duplicateCheck = await checkDuplicateTithe(member_id);
    if (duplicateCheck.isDuplicate) {
      return {
        success: false,
        message: 'A tithe record with this member ID already exists',
        error: 'Duplicate member_id'
      };
    }

    // Format date
    const formattedDateCreated = moment(date_created).format('YYYY-MM-DD HH:mm:ss');

    const sql = `
      INSERT INTO tbl_tithes 
        (member_id, amount, type, payment_method, notes, status, date_created)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      member_id.trim(),
      amountValue,
      type.trim(),
      payment_method.trim(),
      notes ? notes.trim() : null,
      status,
      formattedDateCreated
    ];

    const [result] = await query(sql, params);
    
    // Fetch the created tithe using the auto-generated ID
    const createdTithe = await getTitheById(result.insertId);

    return {
      success: true,
      message: 'Tithe created successfully',
      data: createdTithe.data
    };
  } catch (error) {
    console.error('Error creating tithe:', error);
    throw error;
  }
}

/**
 * READ ALL - Get all tithe records with pagination and filters
 * @param {Object} options - Optional query parameters (search, limit, offset, page, pageSize, type, status, sortBy)
 * @returns {Promise<Object>} Object with paginated tithe records and metadata
 */
async function getAllTithes(options = {}) {
  try {
    // Extract and normalize parameters from options
    const search = options.search || options.q || null;
    const limit = options.limit !== undefined ? parseInt(options.limit) : undefined;
    const offset = options.offset !== undefined ? parseInt(options.offset) : undefined;
    const page = options.page !== undefined ? parseInt(options.page) : undefined;
    const pageSize = options.pageSize !== undefined ? parseInt(options.pageSize) : undefined;
    const type = options.type || null;
    const status = options.status || null;
    const sortBy = options.sortBy || null;

    // Build base query for counting total records (with JOIN for accurate count)
    let countSql = 'SELECT COUNT(*) as total FROM tbl_tithes t INNER JOIN tbl_members m ON t.member_id = m.member_id';
    let countParams = [];

    // Build query for fetching records with member data
    let sql = `SELECT 
      t.tithes_id,
      t.member_id,
      t.amount,
      t.type,
      t.payment_method,
      t.notes,
      t.status,
      t.date_created,
      m.firstname,
      m.lastname,
      m.middle_name,
      CONCAT(
        m.firstname,
        IF(m.middle_name IS NOT NULL AND m.middle_name != '', CONCAT(' ', m.middle_name), ''),
        ' ',
        m.lastname
      ) as fullname
    FROM tbl_tithes t
    INNER JOIN tbl_members m ON t.member_id = m.member_id`;
    const params = [];

    // Build WHERE conditions array
    const whereConditions = [];
    let hasWhere = false;

    // Add search functionality (search by member_id, member name, type, or payment_method)
    const searchValue = search && search.trim() !== '' ? search.trim() : null;
    if (searchValue) {
      const searchCondition = `(t.member_id LIKE ? OR t.type LIKE ? OR t.payment_method LIKE ? OR m.firstname LIKE ? OR m.lastname LIKE ? OR m.middle_name LIKE ? OR CONCAT(m.firstname, ' ', IFNULL(m.middle_name, ''), ' ', m.lastname) LIKE ?)`;
      const searchPattern = `%${searchValue}%`;

      whereConditions.push(searchCondition);
      countParams.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
      hasWhere = true;
    }

    // Add type filter
    if (type && type !== 'All Types') {
      whereConditions.push('t.type = ?');
      countParams.push(type);
      params.push(type);
      hasWhere = true;
    }

    // Add status filter
    if (status && status !== 'All Statuses') {
      whereConditions.push('t.status = ?');
      countParams.push(status);
      params.push(status);
      hasWhere = true;
    }

    // Apply WHERE clause if any conditions exist
    if (hasWhere) {
      const whereClause = ' WHERE ' + whereConditions.join(' AND ');
      countSql += whereClause;
      sql += whereClause;
    }

    // Add sorting
    let orderByClause = ' ORDER BY ';
    const sortByValue = sortBy && sortBy.trim() !== '' ? sortBy.trim() : null;
    switch (sortByValue) {
      case 'Tithes ID (Low to High)':
        orderByClause += 't.tithes_id ASC';
        break;
      case 'Tithes ID (High to Low)':
        orderByClause += 't.tithes_id DESC';
        break;
      case 'Amount (Low to High)':
        orderByClause += 't.amount ASC';
        break;
      case 'Amount (High to Low)':
        orderByClause += 't.amount DESC';
        break;
      case 'Date Created (Newest)':
        orderByClause += 't.date_created DESC';
        break;
      case 'Date Created (Oldest)':
        orderByClause += 't.date_created ASC';
        break;
      case 'Type (A-Z)':
        orderByClause += 't.type ASC';
        break;
      case 'Status (A-Z)':
        orderByClause += 't.status ASC';
        break;
      case 'Name (A-Z)':
        orderByClause += 'fullname ASC';
        break;
      case 'Name (Z-A)':
        orderByClause += 'fullname DESC';
        break;
      default:
        orderByClause += 't.date_created DESC'; // Default sorting
    }
    sql += orderByClause;

    // Determine pagination values
    let finalLimit, finalOffset;

    if (page !== undefined && pageSize !== undefined) {
      const pageNum = parseInt(page) || 1;
      const size = parseInt(pageSize) || 10;
      finalLimit = size;
      finalOffset = (pageNum - 1) * size;
    } else if (limit !== undefined) {
      finalLimit = parseInt(limit) || 10;
      finalOffset = offset !== undefined ? parseInt(offset) : 0;
    } else {
      finalLimit = null;
      finalOffset = null;
    }

    // Get total count (before pagination)
    const [countResult] = await query(countSql, countParams);
    const totalCount = countResult[0]?.total || 0;

    // Get summary statistics from ALL records (ignoring filters for summary cards)
    // Only count completed donations for totals
    const [summaryStatsResult] = await query(`
      SELECT 
        COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as totalDonations,
        COALESCE(SUM(CASE WHEN type = 'tithe' AND status = 'completed' THEN amount ELSE 0 END), 0) as totalTithes,
        COALESCE(SUM(CASE WHEN type = 'offering' AND status = 'completed' THEN amount ELSE 0 END), 0) as totalOfferings,
        COALESCE(SUM(CASE WHEN type IN ('missions', 'love_gift', 'building_fund', 'donation', 'other') AND status = 'completed' THEN amount ELSE 0 END), 0) as totalSpecialOfferings
      FROM tbl_tithes
    `);
    
    const summaryStats = {
      totalDonations: parseFloat(summaryStatsResult[0]?.totalDonations || 0),
      totalTithes: parseFloat(summaryStatsResult[0]?.totalTithes || 0),
      totalOfferings: parseFloat(summaryStatsResult[0]?.totalOfferings || 0),
      totalSpecialOfferings: parseFloat(summaryStatsResult[0]?.totalSpecialOfferings || 0)
    };

    // Add pagination to main query
    if (finalLimit !== null) {
      const limitValue = Math.max(1, parseInt(finalLimit) || 10);
      const offsetValue = Math.max(0, parseInt(finalOffset) || 0);

      if (offsetValue > 0) {
        sql += ` LIMIT ${limitValue} OFFSET ${offsetValue}`;
      } else {
        sql += ` LIMIT ${limitValue}`;
      }
    }

    // Execute query to get paginated results
    const [rows] = await query(sql, params);

    // Calculate pagination metadata
    const currentPage = page !== undefined ? parseInt(page) : (finalOffset !== null ? Math.floor(finalOffset / finalLimit) + 1 : 1);
    const currentPageSize = finalLimit || rows.length;
    const totalPages = finalLimit ? Math.ceil(totalCount / finalLimit) : 1;

    return {
      success: true,
      message: 'Tithes retrieved successfully',
      data: rows,
      count: rows.length,
      totalCount: totalCount,
      summaryStats: summaryStats,
      pagination: {
        page: currentPage,
        pageSize: currentPageSize,
        totalPages: totalPages,
        totalCount: totalCount,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1
      }
    };
  } catch (error) {
    console.error('Error fetching tithes:', error);
    throw error;
  }
}

/**
 * READ ONE - Get a single tithe by ID
 * @param {Number} tithesId - Tithes ID
 * @returns {Promise<Object>} Tithe record
 */
async function getTitheById(tithesId) {
  try {
    if (!tithesId) {
      throw new Error('Tithes ID is required');
    }

    const sql = 'SELECT * FROM tbl_tithes WHERE tithes_id = ?';
    const [rows] = await query(sql, [tithesId]);

    if (rows.length === 0) {
      return {
        success: false,
        message: 'Tithe not found',
        data: null
      };
    }

    return {
      success: true,
      message: 'Tithe retrieved successfully',
      data: rows[0]
    };
  } catch (error) {
    console.error('Error fetching tithe:', error);
    throw error;
  }
}

/**
 * READ ONE - Get a single tithe by member_id
 * @param {String} memberId - Member ID
 * @returns {Promise<Object>} Tithe record
 */
async function getTitheByMemberId(memberId) {
  try {
    if (!memberId) {
      throw new Error('Member ID is required');
    }

    const sql = 'SELECT * FROM tbl_tithes WHERE member_id = ?';
    const [rows] = await query(sql, [memberId]);

    if (rows.length === 0) {
      return {
        success: false,
        message: 'Tithe not found',
        data: null
      };
    }

    return {
      success: true,
      message: 'Tithe retrieved successfully',
      data: rows[0]
    };
  } catch (error) {
    console.error('Error fetching tithe by member ID:', error);
    throw error;
  }
}

/**
 * UPDATE - Update an existing tithe record
 * @param {Number} tithesId - Tithes ID
 * @param {Object} titheData - Updated tithe data
 * @returns {Promise<Object>} Result object
 */
async function updateTithe(tithesId, titheData) {
  try {
    if (!tithesId) {
      throw new Error('Tithes ID is required');
    }

    // Check if tithe exists
    const titheCheck = await getTitheById(tithesId);
    if (!titheCheck.success) {
      return {
        success: false,
        message: 'Tithe not found',
        data: null
      };
    }

    const {
      member_id,
      amount,
      type,
      payment_method,
      notes,
      status,
      date_created
    } = titheData;

    // Build dynamic update query based on provided fields
    const fields = [];
    const params = [];

    if (member_id !== undefined) {
      // Check for duplicate member_id (excluding current tithe)
      const duplicateCheck = await checkDuplicateTithe(member_id.trim(), tithesId);
      if (duplicateCheck.isDuplicate) {
        return {
          success: false,
          message: 'A tithe record with this member ID already exists',
          error: 'Duplicate member_id'
        };
      }

      fields.push('member_id = ?');
      params.push(member_id.trim());
    }

    if (amount !== undefined) {
      // Validate amount is a number
      const amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue < 0) {
        return {
          success: false,
          message: 'Amount must be a valid positive number',
          error: 'Invalid amount'
        };
      }

      fields.push('amount = ?');
      params.push(amountValue);
    }

    if (type !== undefined) {
      fields.push('type = ?');
      params.push(type.trim());
    }

    if (payment_method !== undefined) {
      fields.push('payment_method = ?');
      params.push(payment_method.trim());
    }

    if (notes !== undefined) {
      fields.push('notes = ?');
      params.push(notes ? notes.trim() : null);
    }

    if (status !== undefined) {
      fields.push('status = ?');
      params.push(status);
    }

    if (date_created !== undefined) {
      const formattedDateCreated = moment(date_created).format('YYYY-MM-DD HH:mm:ss');
      fields.push('date_created = ?');
      params.push(formattedDateCreated);
    }

    if (fields.length === 0) {
      return {
        success: false,
        message: 'No fields to update',
        data: null
      };
    }

    params.push(tithesId);

    const sql = `
      UPDATE tbl_tithes
      SET ${fields.join(', ')}
      WHERE tithes_id = ?
    `;

    const [result] = await query(sql, params);

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: 'Tithe not found or no changes made',
        data: null
      };
    }

    // Fetch updated tithe
    const updatedTithe = await getTitheById(tithesId);

    return {
      success: true,
      message: 'Tithe updated successfully',
      data: updatedTithe.data
    };
  } catch (error) {
    console.error('Error updating tithe:', error);
    throw error;
  }
}

/**
 * DELETE - Delete a tithe record (archives it first)
 * @param {Number} tithesId - Tithes ID
 * @param {String} archivedBy - User ID who is deleting/archiving the record (optional)
 * @returns {Promise<Object>} Result object
 */
async function deleteTithe(tithesId, archivedBy = null) {
  try {
    if (!tithesId) {
      throw new Error('Tithes ID is required');
    }

    // Check if tithe exists
    const titheCheck = await getTitheById(tithesId);
    if (!titheCheck.success) {
      return {
        success: false,
        message: 'Tithe not found',
        data: null
      };
    }

    // Archive the record before deleting
    await archiveBeforeDelete(
      'tbl_tithes',
      String(tithesId),
      titheCheck.data,
      archivedBy
    );

    // Delete from original table
    const sql = 'DELETE FROM tbl_tithes WHERE tithes_id = ?';
    const [result] = await query(sql, [tithesId]);

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: 'Tithe not found',
        data: null
      };
    }

    return {
      success: true,
      message: 'Tithe archived and deleted successfully',
      data: { tithes_id: tithesId }
    };
  } catch (error) {
    console.error('Error deleting tithe:', error);
    throw error;
  }
}

/**
 * EXPORT - Export tithe records to Excel
 * @param {Object} options - Optional query parameters (same as getAllTithes: search, type, status, sortBy)
 * @returns {Promise<Buffer>} Excel file buffer
 */
async function exportTithesToExcel(options = {}) {
  try {
    // Get all tithes matching the filters (without pagination for export)
    const exportOptions = { ...options };
    // Remove pagination to get all records
    delete exportOptions.limit;
    delete exportOptions.offset;
    delete exportOptions.page;
    delete exportOptions.pageSize;

    const result = await getAllTithes(exportOptions);
    
    if (!result.success || !result.data || result.data.length === 0) {
      throw new Error('No tithes found to export');
    }

    const tithes = result.data;

    // Prepare data for Excel export
    const excelData = tithes.map((tithe, index) => {
      return {
        'No.': index + 1,
        'Tithes ID': tithe.tithes_id || '',
        'Member ID': tithe.member_id || '',
        'Full Name': tithe.fullname || '',
        'First Name': tithe.firstname || '',
        'Last Name': tithe.lastname || '',
        'Middle Name': tithe.middle_name || '',
        'Amount': tithe.amount || 0,
        'Type': tithe.type || '',
        'Payment Method': tithe.payment_method || '',
        'Status': tithe.status || '',
        'Notes': tithe.notes || '',
        'Date Created': tithe.date_created ? moment(tithe.date_created).format('YYYY-MM-DD HH:mm:ss') : '',
        'Created Date': tithe.date_created ? moment(tithe.date_created).format('YYYY-MM-DD') : ''
      };
    });

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 5 },   // No.
      { wch: 12 },  // Tithes ID
      { wch: 15 },  // Member ID
      { wch: 25 },  // Full Name
      { wch: 20 },  // First Name
      { wch: 20 },  // Last Name
      { wch: 15 },  // Middle Name
      { wch: 15 },  // Amount
      { wch: 15 },  // Type
      { wch: 18 },  // Payment Method
      { wch: 12 },  // Status
      { wch: 30 },  // Notes
      { wch: 20 },  // Date Created
      { wch: 15 }   // Created Date
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tithes & Offerings');

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
      compression: true
    });

    return excelBuffer;
  } catch (error) {
    console.error('Error exporting tithes to Excel:', error);
    throw error;
  }
}

module.exports = {
  createTithe,
  getAllTithes,
  getTitheById,
  getTitheByMemberId,
  updateTithe,
  deleteTithe,
  checkDuplicateTithe,
  exportTithesToExcel
};

