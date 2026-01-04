const { query } = require('../../database/db');
const moment = require('moment');
const XLSX = require('xlsx');
const csv = require('csv-parser');
const fs = require('fs');
const { archiveRecord } = require('../archiveRecords');
const { parseCSVFile, processBatches, sanitizeRow } = require('../../utils/csvParser');
/**
 * Member Records CRUD Operations
 * Based on tbl_members schema:
 * - member_id (INT, PK, NN)
 * - firstname (VARCHAR(45), NN)
 * - lastname (VARCHAR(45), NN)
 * - middle_name (VARCHAR(45), nullable)
 * - birthdate (DATE, NN)
 * - age (VARCHAR(45), NN)
 * - gender (VARCHAR(1), NN)
 * - address (VARCHAR(45), NN)
 * - email (VARCHAR(45), NN)
 * - phone_number (VARCHAR(45), NN)
 * - position (VARCHAR(45), NN, default: 'member')
 * - date_created (DATETIME, NN)
 */

/**
 * Check if a member with the same data already exists
 * @param {Object} memberData - Member data to check
 * @param {String|Number} excludeMemberId - Optional member_id to exclude from check (for updates)
 * @returns {Promise<Object>} Object with isDuplicate flag and details about what fields match
 */
async function checkDuplicateMember(memberData, excludeMemberId = null) {
  try {
    const { email, phone_number, firstname, lastname, birthdate } = memberData;
    const duplicateFields = [];
    const duplicateDetails = [];

    // Build WHERE conditions
    const conditions = [];
    const params = [];

    // Check for duplicate email (case-insensitive)
    if (email) {
      conditions.push('LOWER(TRIM(email)) = LOWER(TRIM(?))');
      params.push(email);
    }

    // Check for duplicate phone number (normalize by handling +63 prefix)
    if (phone_number) {
      const normalizedPhone = phone_number.trim();
      // Check both formats: with +63 and without (database may store either format)
      conditions.push('(REPLACE(phone_number, "+63", "") = REPLACE(?, "+63", "") OR phone_number = ?)');
      params.push(normalizedPhone, normalizedPhone);
    }

    // Check for duplicate name + birthdate combination (case-insensitive, trimmed)
    if (firstname && lastname && birthdate) {
      conditions.push('(LOWER(TRIM(firstname)) = LOWER(TRIM(?)) AND LOWER(TRIM(lastname)) = LOWER(TRIM(?)) AND birthdate = ?)');
      params.push(firstname, lastname, moment(birthdate).format('YYYY-MM-DD'));
    }

    if (conditions.length === 0) {
      return {
        isDuplicate: false,
        duplicateFields: [],
        duplicateDetails: []
      };
    }

    // Build SQL query
    let sql = 'SELECT member_id, firstname, lastname, email, phone_number, birthdate FROM tbl_members WHERE (';
    sql += conditions.join(' OR ') + ')';

    // Exclude current member if updating
    if (excludeMemberId) {
      sql += ' AND member_id != ?';
      params.push(excludeMemberId);
    }

    const [rows] = await query(sql, params);

    if (rows.length === 0) {
      return {
        isDuplicate: false,
        duplicateFields: [],
        duplicateDetails: []
      };
    }

    // Analyze which fields match
    rows.forEach(member => {
      const matches = [];
      
      if (email && member.email && member.email.toLowerCase().trim() === email.toLowerCase().trim()) {
        matches.push('email');
        duplicateFields.push('email');
      }
      
      // Normalize phone numbers for comparison (remove +63 prefix)
      if (phone_number && member.phone_number) {
        const normalizedInput = phone_number.trim().replace(/^\+63/, '');
        const normalizedMember = member.phone_number.trim().replace(/^\+63/, '');
        if (normalizedInput === normalizedMember) {
          matches.push('phone_number');
          duplicateFields.push('phone_number');
        }
      }
      
      // Check name and birthdate combination (case-insensitive)
      if (firstname && lastname && birthdate) {
        const memberBirthdate = moment(member.birthdate).format('YYYY-MM-DD');
        const inputBirthdate = moment(birthdate).format('YYYY-MM-DD');
        
        if (member.firstname && member.lastname && 
            member.firstname.trim().toLowerCase() === firstname.trim().toLowerCase() && 
            member.lastname.trim().toLowerCase() === lastname.trim().toLowerCase() && 
            memberBirthdate === inputBirthdate) {
          matches.push('name and birthdate');
          duplicateFields.push('name_birthdate');
        }
      }

      if (matches.length > 0) {
        duplicateDetails.push({
          member_id: member.member_id,
          name: `${member.firstname} ${member.lastname}`,
          email: member.email,
          phone_number: member.phone_number,
          matchingFields: matches
        });
      }
    });

    // Remove duplicates from duplicateFields array
    const uniqueDuplicateFields = [...new Set(duplicateFields)];

    return {
      isDuplicate: rows.length > 0,
      duplicateFields: uniqueDuplicateFields,
      duplicateDetails: duplicateDetails
    };
  } catch (error) {
    console.error('Error checking for duplicate member:', error);
    throw error;
  }
}

/**
 * CREATE - Insert a new member record
 * @param {Object} memberData - Member data object
 * @returns {Promise<Object>} Result object with insertId
 */
async function createMember(memberData) {
  try {
    // Get next member_id if not provided
    const new_member_id = await getNextMemberId();
    console.log('New member ID:', new_member_id);
    const {
      member_id = new_member_id,
      firstname,
      lastname,
      middle_name = null,
      birthdate,
      age,
      gender,
      address,
      email,
      phone_number,
      position = 'member',
      date_created = new Date()
    } = memberData;

    // Validate required fields (member_id is auto-generated, so don't validate it)
    if (!firstname || !lastname || !birthdate || !age || !gender || !address || !email || !phone_number) {
      throw new Error('Missing required fields: firstname, lastname, birthdate, age, gender, address, email, phone_number');
    }

    // Check for duplicate member before creating
    const duplicateCheck = await checkDuplicateMember(memberData);
    if (duplicateCheck.isDuplicate) {
      const duplicateMessages = [];
      
      if (duplicateCheck.duplicateFields.includes('email')) {
        duplicateMessages.push('Email address already exists');
      }
      if (duplicateCheck.duplicateFields.includes('phone_number')) {
        duplicateMessages.push('Phone number already exists');
      }
      if (duplicateCheck.duplicateFields.includes('name_birthdate')) {
        duplicateMessages.push('A member with the same name and birthdate already exists');
      }

      return {
        success: false,
        message: `Duplicate member detected: ${duplicateMessages.join(', ')}`,
        error: duplicateMessages.join(', '),
        duplicateDetails: duplicateCheck.duplicateDetails
      };
    }

    // Ensure member_id is set
    const final_member_id = member_id || new_member_id;

    const sql = `
      INSERT INTO tbl_members
        (member_id, firstname, lastname, middle_name, birthdate, age, gender, address, email, phone_number, civil_status, position, guardian_name, guardian_contact, guardian_relationship, date_created)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      final_member_id,
      firstname,
      lastname,
      middle_name,
      birthdate,
      age,
      gender,
      address,
      email,
      phone_number,
      memberData.civil_status || null,
      position,
      memberData.guardian_name || null,
      memberData.guardian_contact || null,
      memberData.guardian_relationship || null,
      date_created
    ];

    const [result] = await query(sql, params);
    console.log('Result:', result);
    
    return {
      success: true,
      message: 'Member created successfully',
      data: {
        member_id: final_member_id,
        firstname,
        lastname,
        middle_name,
        birthdate,
        age,
        gender,
        address,
        email,
        phone_number,
        position,
        date_created
      }
    };
  } catch (error) {
    console.error('Error creating member:', error);
    throw error;
  }
}

/**
 * UPDATE - Update an existing member record
 * @param {Number} memberId - Member ID
 * @param {Object} memberData - Updated member data
 * @returns {Promise<Object>} Result object
 */
async function updateMember(memberId, memberData) {
  try {
    if (!memberId) {
      throw new Error('Member ID is required');
    }

    // Check if member exists
    const memberCheck = await getMemberById(memberId);
    if (!memberCheck.success) {
      return {
        success: false,
        message: 'Member not found',
        data: null
      };
    }

    const {
      firstname,
      lastname,
      middle_name,
      birthdate,
      age,
      gender,
      address,
      email,
      phone_number,
      civil_status,
      position,
      guardian_name,
      guardian_contact,
      guardian_relationship
    } = memberData;

    // Check for duplicate member before updating (exclude current member)
    const duplicateCheck = await checkDuplicateMember(memberData, memberId);
    if (duplicateCheck.isDuplicate) {
      const duplicateMessages = [];
      
      if (duplicateCheck.duplicateFields.includes('email')) {
        duplicateMessages.push('Email address already exists');
      }
      if (duplicateCheck.duplicateFields.includes('phone_number')) {
        duplicateMessages.push('Phone number already exists');
      }
      if (duplicateCheck.duplicateFields.includes('name_birthdate')) {
        duplicateMessages.push('A member with the same name and birthdate already exists');
      }

      return {
        success: false,
        message: `Duplicate member detected: ${duplicateMessages.join(', ')}`,
        error: duplicateMessages.join(', '),
        duplicateDetails: duplicateCheck.duplicateDetails
      };
    }

    // Build dynamic update query based on provided fields
    const fields = [];
    const params = [];

    if (firstname !== undefined) {
      fields.push('firstname = ?');
      params.push(firstname);
    }
    if (lastname !== undefined) {
      fields.push('lastname = ?');
      params.push(lastname);
    }
    if (middle_name !== undefined) {
      fields.push('middle_name = ?');
      params.push(middle_name);
    }
    if (birthdate !== undefined) {
      fields.push('birthdate = ?');
      params.push(moment(birthdate).format('YYYY-MM-DD'));
    }
    if (age !== undefined) {
      fields.push('age = ?');
      params.push(age);
    }
    if (gender !== undefined) {
      fields.push('gender = ?');
      params.push(gender);
    }
    if (address !== undefined) {
      fields.push('address = ?');
      params.push(address);
    }
    if (email !== undefined) {
      fields.push('email = ?');
      params.push(email);
    }
    if (phone_number !== undefined) {
      fields.push('phone_number = ?');
      params.push(phone_number);
    }
    if (civil_status !== undefined) {
      fields.push('civil_status = ?');
      params.push(civil_status);
    }
    if (position !== undefined) {
      fields.push('position = ?');
      params.push(position);
    }
    if (guardian_name !== undefined) {
      fields.push('guardian_name = ?');
      params.push(guardian_name);
    }
    if (guardian_contact !== undefined) {
      fields.push('guardian_contact = ?');
      params.push(guardian_contact);
    }
    if (guardian_relationship !== undefined) {
      fields.push('guardian_relationship = ?');
      params.push(guardian_relationship);
    }

    if (fields.length === 0) {
      return {
        success: false,
        message: 'No fields to update',
        data: null
      };
    }

    params.push(memberId);

    const sql = `
      UPDATE tbl_members
      SET ${fields.join(', ')}
      WHERE member_id = ?
    `;

    const [result] = await query(sql, params);

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: 'Member not found or no changes made',
        data: null
      };
    }

    // Fetch updated member
    const updatedMember = await getMemberById(memberId);

    return {
      success: true,
      message: 'Member updated successfully',
      data: updatedMember.data
    };
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
}
/**
 * DELETE - Delete a member record (archives it first)
 * @param {Number} memberId - Member ID
 * @param {String} archivedBy - User ID who is deleting/archiving the record (optional)
 * @returns {Promise<Object>} Result object
 */
async function deleteMember(memberId, archivedBy = null) {
  try {
    if (!memberId) {
      throw new Error('Member ID is required');
    }

    // Check if member exists
    const memberCheck = await getMemberById(memberId);
    if (!memberCheck.success) {
      return {
        success: false,
        message: 'Member not found',
        data: null
      };
    }

    // Archive the record before deleting
    try {
      await archiveRecord(
        'tbl_members',
        String(memberId),
        memberCheck.data,
        archivedBy
      );
    } catch (archiveError) {
      console.error('Error archiving member before deletion:', archiveError);
      // Continue with deletion even if archiving fails (non-blocking)
    }

    // Delete from original table
    const sql = 'DELETE FROM tbl_members WHERE member_id = ?';
    const [result] = await query(sql, [memberId]);

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: 'Member not found',
        data: null
      };
    }

    return {
      success: true,
      message: 'Member archived and deleted successfully',
      data: { member_id: memberId }
    };
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
}
/**
 * READ ALL - Get all member records with pagination and filters
 * @param {Object} options - Optional query parameters (search, limit, offset, page, pageSize, ageRange, joinMonth, sortBy)
 * @returns {Promise<Object>} Object with paginated member records and metadata
 */
async function getAllMembers(options = {}) {
    try {
      // Extract and normalize parameters from options
      // Handle both query params (strings) and body payload (may be strings or numbers)
      const search = options.search || options.q || null;
      const limit = options.limit !== undefined ? parseInt(options.limit) : undefined;
      const offset = options.offset !== undefined ? parseInt(options.offset) : undefined;
      const page = options.page !== undefined ? parseInt(options.page) : undefined;
      const pageSize = options.pageSize !== undefined ? parseInt(options.pageSize) : undefined;
      const ageRange = options.ageRange || null;
      const joinMonth = options.joinMonth || null;
      const sortBy = options.sortBy || null;
      
      // Build base query for counting total records
      let countSql = 'SELECT COUNT(*) as total FROM tbl_members';
      let countParams = [];
      
      // Build query for fetching records
      let sql = 'SELECT * FROM tbl_members';
      const params = [];
  
      // Build WHERE conditions array
      const whereConditions = [];
      let hasWhere = false;
  
      // Add search functionality
      // Handle both 'search' and 'q' parameter names, and filter out empty strings
      const searchValue = search && search.trim() !== '' ? search.trim() : null;
      if (searchValue) {
        const searchCondition = `(firstname LIKE ? OR lastname LIKE ? OR email LIKE ? OR phone_number LIKE ?)`;
        const searchPattern = `%${searchValue}%`;
        
        whereConditions.push(searchCondition);
        countParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
        hasWhere = true;
      }
  
      // Add age range filter
      // Handle ageRange parameter (e.g., "0-18", "19-30", "31-50", "51+", "All Ages")
      if (ageRange && ageRange !== 'All Ages' && ageRange.trim() !== '') {
        const ageRangeValue = ageRange.trim();
        if (ageRangeValue === '51+') {
          // Cast age to number for comparison (age is stored as VARCHAR)
          whereConditions.push('CAST(age AS UNSIGNED) >= ?');
          countParams.push(51);
          params.push(51);
        } else if (ageRangeValue.includes('-')) {
          const [min, max] = ageRangeValue.split('-').map(Number);
          if (!isNaN(min) && !isNaN(max)) {
            // Cast age to number for comparison (age is stored as VARCHAR)
            whereConditions.push('CAST(age AS UNSIGNED) >= ? AND CAST(age AS UNSIGNED) <= ?');
            countParams.push(min, max);
            params.push(min, max);
          }
        }
        hasWhere = true;
      }
  
      // Add join month filter
      // Handle joinMonth parameter (e.g., "January", "February", etc., or "All Months")
      if (joinMonth && joinMonth !== 'All Months' && joinMonth.trim() !== '') {
        // Get month number (1-12) from month name
        const monthMap = {
          'January': 1, 'February': 2, 'March': 3, 'April': 4,
          'May': 5, 'June': 6, 'July': 7, 'August': 8,
          'September': 9, 'October': 10, 'November': 11, 'December': 12
        };
        const monthName = joinMonth.trim();
        const monthNum = monthMap[monthName];
        
        if (monthNum) {
          whereConditions.push('MONTH(date_created) = ?');
          countParams.push(monthNum);
          params.push(monthNum);
          hasWhere = true;
        }
      }
  
      // Apply WHERE clause if any conditions exist
      if (hasWhere) {
        const whereClause = ' WHERE ' + whereConditions.join(' AND ');
        countSql += whereClause;
        sql += whereClause;
      }
  
      // Add sorting
      // Handle sortBy parameter (e.g., "Name (A-Z)", "Name (Z-A)", "Join Date (Newest)", etc.)
      let orderByClause = ' ORDER BY ';
      const sortByValue = sortBy && sortBy.trim() !== '' ? sortBy.trim() : null;
      switch (sortByValue) {
        case 'Name (A-Z)':
          orderByClause += 'firstname ASC, lastname ASC';
          break;
        case 'Name (Z-A)':
          orderByClause += 'firstname DESC, lastname DESC';
          break;
        case 'Join Date (Newest)':
          orderByClause += 'date_created DESC';
          break;
        case 'Join Date (Oldest)':
          orderByClause += 'date_created ASC';
          break;
        case 'Age (Low to High)':
          // Cast age to number for proper numeric sorting (age is stored as VARCHAR)
          orderByClause += 'CAST(age AS UNSIGNED) ASC';
          break;
        case 'Age (High to Low)':
          // Cast age to number for proper numeric sorting (age is stored as VARCHAR)
          orderByClause += 'CAST(age AS UNSIGNED) DESC';
          break;
        default:
          orderByClause += 'date_created DESC'; // Default sorting
      }
      sql += orderByClause;
  
      // Determine pagination values
      // Priority: use page/pageSize if provided, otherwise use limit/offset
      let finalLimit, finalOffset;
      
      if (page !== undefined && pageSize !== undefined) {
        // Use page-based pagination
        const pageNum = parseInt(page) || 1;
        const size = parseInt(pageSize) || 10;
        finalLimit = size;
        finalOffset = (pageNum - 1) * size;
      } else if (limit !== undefined) {
        // Use limit/offset pagination
        finalLimit = parseInt(limit) || 10;
        finalOffset = offset !== undefined ? parseInt(offset) : 0;
      } else {
        // No pagination - return all records
        finalLimit = null;
        finalOffset = null;
      }
  
      // Get total count (before pagination)
      const [countResult] = await query(countSql, countParams);
      const totalCount = countResult[0]?.total || 0;
  
      // Add pagination to main query
      // Note: MySQL doesn't support parameterized LIMIT/OFFSET, so we interpolate directly
      // This is safe because finalLimit and finalOffset are already parsed and validated as integers
      if (finalLimit !== null) {
        const limitValue = Math.max(1, parseInt(finalLimit) || 10); // Ensure at least 1, default to 10
        const offsetValue = Math.max(0, parseInt(finalOffset) || 0); // Ensure non-negative
        
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
        message: 'Members retrieved successfully',
        data: rows,
        count: rows.length, // Number of records in current page
        totalCount: totalCount, // Total number of records matching the query
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
      console.error('Error fetching members:', error);
      throw error;
    }
  }
// Create function to get the next member_id (incremental integer)
async function getNextMemberId() {
  try {
    const sql = 'SELECT MAX(member_id) AS max_member_id FROM tbl_members';
    const [rows] = await query(sql);
    
    // If no records exist, start with 1, otherwise increment by 1
    const maxId = rows[0]?.max_member_id || 0;
    // it should return a string like 0000000001
    const new_member_id = parseInt(maxId) + 1;
    return new_member_id.toString().padStart(9, '0');
  } catch (error) {
    console.error('Error getting next member ID:', error);
    throw error;
  }
}
async function getMemberById(memberId) {
    try {
      if (!memberId) {
        throw new Error('Member ID is required');
      }
  
      const sql = 'SELECT * FROM tbl_members WHERE member_id = ?';
      const [rows] = await query(sql, [memberId]);
  
      if (rows.length === 0) {
        return {
          success: false,
          message: 'Member not found',
          data: null
        };
      }
  
      return {
        success: true,
        message: 'Member retrieved successfully',
        data: rows[0]
      };
    } catch (error) {
      console.error('Error fetching member:', error);
      throw error;
    }
  }
  
/**
 * EXPORT - Export member records to Excel
 * @param {Object} options - Optional query parameters (same as getAllMembers: search, ageRange, joinMonth, sortBy)
 * @returns {Promise<Buffer>} Excel file buffer
 */
async function exportMembersToExcel(options = {}) {
  try {
    // Get all members matching the filters (without pagination for export)
    const exportOptions = { ...options };
    // Remove pagination to get all records
    delete exportOptions.limit;
    delete exportOptions.offset;
    delete exportOptions.page;
    delete exportOptions.pageSize;

    console.log('Export options:', exportOptions);

    const result = await getAllMembers(exportOptions);
    
    if (!result.success || !result.data || result.data.length === 0) {
      throw new Error('No members found to export');
    }

    const members = result.data;
    console.log(`Exporting ${members.length} members to Excel`);

    // Prepare data for Excel export
    const excelData = members.map((member, index) => {
      return {
        'No.': index + 1,
        'Member ID': member.member_id || '',
        'First Name': member.firstname || '',
        'Last Name': member.lastname || '',
        'Middle Name': member.middle_name || '',
        'Full Name': `${member.firstname || ''} ${member.middle_name || ''} ${member.lastname || ''}`.trim(),
        'Birthdate': member.birthdate ? moment(member.birthdate).format('YYYY-MM-DD') : '',
        'Age': member.age || '',
        'Gender': member.gender === 'M' ? 'Male' : member.gender === 'F' ? 'Female' : member.gender === 'O' ? 'Other' : member.gender || '',
        'Address': member.address || '',
        'Email': member.email || '',
        'Phone Number': member.phone_number || '',
        'Position': member.position || '',
        'Date Created': member.date_created ? moment(member.date_created).format('YYYY-MM-DD HH:mm:ss') : '',
        'Join Date': member.date_created ? moment(member.date_created).format('YYYY-MM-DD') : ''
      };
    });

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 5 },   // No.
      { wch: 12 },  // Member ID
      { wch: 15 },  // First Name
      { wch: 15 },  // Last Name
      { wch: 15 },  // Middle Name
      { wch: 30 },  // Full Name
      { wch: 12 },  // Birthdate
      { wch: 5 },   // Age
      { wch: 10 },  // Gender
      { wch: 40 },  // Address
      { wch: 25 },  // Email
      { wch: 15 },  // Phone Number
      { wch: 20 },  // Position
      { wch: 20 },  // Date Created
      { wch: 12 }   // Join Date
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Members');

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
      compression: true
    });

    if (!excelBuffer || excelBuffer.length === 0) {
      throw new Error('Failed to generate Excel file buffer');
    }

    console.log(`Excel buffer generated: ${excelBuffer.length} bytes`);
    return excelBuffer;
  } catch (error) {
    console.error('Error exporting members to Excel:', error);
    throw error;
  }
}

// Create a function to get  Members without pastors on Select Elements
async function getAllMembersWithoutPastorsForSelect() {
  try {
    // Build query to get all members with fullname (excluding pastors)
    const sql = `SELECT 
      member_id,
      firstname,
      lastname,
      middle_name,
      gender,
      CONCAT(
        firstname,
        IF(middle_name IS NOT NULL AND middle_name != '', CONCAT(' ', middle_name), ''),
        ' ',
        lastname
      ) as fullname
    FROM tbl_members
    WHERE LOWER(position) NOT LIKE ?
    ORDER BY firstname ASC, lastname ASC`;

    const [rows] = await query(sql, ['%pastor%']);

    // Format data for select elements: [{ id, name }]
    const memberOptions = rows.map(member => ({
      id: member.member_id,
      name: member.fullname || `${member.firstname} ${member.lastname}`.trim(),
      gender: member.gender
    }));

    return {
      success: true,
      message: 'Members retrieved successfully for select',
      data: memberOptions
    };
  } catch (error) {
    console.error('Error fetching members for select:', error);
    throw error;
  }
}
/**
 * GET ALL FOR SELECT - Get all members for select/dropdown elements
 * Returns simplified member data (member_id and fullname) without pagination
 * Excludes members with position containing 'pastor' (e.g., 'Senior Pastor', 'Junior Pastor')
 * @returns {Promise<Object>} Object with member options array
 */
async function getAllMembersForSelect() {
  try {
    // Build query to get all members with fullname
    const sql = `SELECT 
      member_id,
      firstname,
      lastname,
      middle_name,
      email,
      CONCAT(
        firstname,
        IF(middle_name IS NOT NULL AND middle_name != '', CONCAT(' ', middle_name), ''),
        ' ',
        lastname
      ) as fullname
    FROM tbl_members
    where position != 'none'
    ORDER BY firstname ASC, lastname ASC`;

    const [rows] = await query(sql);

    // Format data for select elements: [{ id, name }]
    const memberOptions = rows.map(member => ({
      id: member.member_id,
      name: member.fullname || `${member.firstname} ${member.lastname}`.trim(),
      email: member.email
    }));

    return {
      success: true,
      message: 'Members retrieved successfully for select',
      data: memberOptions
    };
  } catch (error) {
    console.error('Error fetching members for select:', error);
    throw error;
  }
}

/**
 * GET ALL PASTORS FOR SELECT - Get all members with position containing 'pastor' for select/dropdown elements
 * Returns simplified member data (member_id and fullname) without pagination
 * Includes positions like 'Senior Pastor', 'Junior Pastor', etc.
 * @returns {Promise<Object>} Object with pastor options array
 */
async function getAllPastorsForSelect() {
  try {
    // Build query to get all pastors with fullname (including Senior Pastor, Junior Pastor, etc.)
    const sql = `SELECT 
      member_id,
      firstname,
      lastname,
      middle_name,
      CONCAT(
        firstname,
        IF(middle_name IS NOT NULL AND middle_name != '', CONCAT(' ', middle_name), ''),
        ' ',
        lastname
      ) as fullname
    FROM tbl_members
    WHERE LOWER(position) LIKE ?
    ORDER BY firstname ASC, lastname ASC`;

    const [rows] = await query(sql, ['%pastor%']);

    // Format data for select elements: [{ id, name }]
    const pastorOptions = rows.map(pastor => ({
      id: pastor.member_id,
      name: pastor.fullname || `${pastor.firstname} ${pastor.lastname}`.trim()
    }));

    return {
      success: true,
      message: 'Pastors retrieved successfully for select',
      data: pastorOptions
    };
  } catch (error) {
    console.error('Error fetching pastors for select:', error);
    throw error;
  }
}

/**
 * 
 * Get specific member by email and status is active
 * @param {String} email - Email to check
 * @returns {Promise<Object>} Object with member data
 */
async function getSpecificMemberByEmailAndStatus(email) {
  try {
    // tbl_members schema does not have a status column; check by email only
    const sql = 'SELECT * FROM tbl_members WHERE email = ?';
    const [rows] = await query(sql, [email]);
    if(rows.length === 0) {
      return null;
    }else{
      return rows[0];
    }
  }
  catch (error) {
    console.error('Error getting specific member by email and status:', error);
    throw error;
  }
}
/**
 * GET ALL DEPARTMENT MEMBERS FOR SELECT - Get all members with position = 'department' for select/dropdown elements
 * Returns simplified member data (member_id and fullname) without pagination
 * Filters by member position = 'department' from tbl_members
 * @returns {Promise<Object>} Object with department member options array
 */
async function getAllDepartmentMembersForSelect() {
  try {
    // Build query to get all members with position = 'department'
    const sql = `SELECT 
      member_id,
      firstname,
      lastname,
      middle_name,
      email,
      CONCAT(
        firstname,
        IF(middle_name IS NOT NULL AND middle_name != '', CONCAT(' ', middle_name), ''),
        ' ',
        lastname
      ) as fullname
    FROM tbl_members
    WHERE LOWER(position) != 'member' AND LOWER(position) != 'none'
    ORDER BY firstname ASC, lastname ASC`;

    const [rows] = await query(sql);

    // Format data for select elements: [{ id, name }]
    const memberOptions = rows.map(member => ({
      id: member.member_id,
      name: member.fullname || `${member.firstname} ${member.lastname}`.trim(),
      email: member.email
    }));

    return {
      success: true,
      message: 'Department members retrieved successfully for select',
      data: memberOptions
    };
  } catch (error) {
    console.error('Error fetching department members for select:', error);
    throw error;
  }
}

/**
 * IMPORT - Import members from CSV file with improved batch processing
 * Uses streaming for large files and batch processing for better performance
 * @param {String} filePath - Path to the uploaded CSV file
 * @returns {Promise<Object>} Result object with import summary
 */
async function importMembersFromCSV(filePath) {
  const startTime = Date.now();
  const batchSize = 50; // Process members in batches of 50
  
  try {
    // Step 1: Parse CSV with validation
    const csvData = await parseCSVFile(filePath, {
      requiredFields: ['firstname', 'lastname', 'birthdate', 'age', 'gender', 'address', 'email', 'phone_number'],
      validationFn: validateMemberRow,
      transformFn: sanitizeRow,
      batchSize
    });

    if (!csvData.success) {
      throw new Error(csvData.message);
    }

    console.log(`CSV parsed: ${csvData.stats.totalRows} total rows, ${csvData.stats.validRows} valid, ${csvData.stats.invalidRows} invalid`);

    // Step 2: Separate valid rows for duplicate checking
    const validRows = csvData.rows.filter(row => row.valid);
    const invalidRowsFromParsing = csvData.rows.filter(row => !row.valid);

    // Step 3: Check for duplicates in batches
    const duplicateMembers = [];
    for (let i = 0; i < validRows.length; i += batchSize) {
      const batch = validRows.slice(i, i + batchSize);
      
      for (const row of batch) {
        const duplicateCheck = await checkDuplicateMember(row.data);
        if (duplicateCheck.isDuplicate) {
          duplicateMembers.push({
            rowNumber: row.rowNumber,
            data: row.data,
            duplicateDetails: duplicateCheck.duplicateDetails
          });
        }
      }
    }

    // Step 4: Filter to only non-duplicate valid members
    const membersToInsert = validRows.filter(row => 
      !duplicateMembers.some(dup => dup.rowNumber === row.rowNumber)
    );

    // Step 5: Process members in batches for database insertion
    const insertedMembers = [];
    const insertionErrors = [];

    for (let i = 0; i < membersToInsert.length; i += batchSize) {
      const batch = membersToInsert.slice(i, i + batchSize);
      
      // Insert batch members in parallel for better performance
      const insertPromises = batch.map(row => 
        createMember(row.data)
          .then(result => {
            if (result.success) {
              return {
                success: true,
                rowNumber: row.rowNumber,
                member_id: result.data.member_id,
                name: `${result.data.firstname} ${result.data.lastname}`
              };
            } else {
              return {
                success: false,
                rowNumber: row.rowNumber,
                error: result.message || 'Failed to insert member'
              };
            }
          })
          .catch(error => ({
            success: false,
            rowNumber: row.rowNumber,
            error: error.message || 'Database insertion error'
          }))
      );

      const batchResults = await Promise.all(insertPromises);
      
      batchResults.forEach(result => {
        if (result.success) {
          insertedMembers.push(result);
        } else {
          insertionErrors.push({
            rowNumber: result.rowNumber,
            error: result.error
          });
        }
      });
    }

    // Step 6: Compile comprehensive results
    const totalInvalidMembers = invalidRowsFromParsing.concat(
      insertionErrors.map(err => ({
        rowNumber: err.rowNumber,
        data: membersToInsert.find(m => m.rowNumber === err.rowNumber)?.data || {},
        errors: [err.error]
      }))
    );

    const processingTime = Date.now() - startTime;
    const totalProcessed = csvData.stats.totalRows;
    const totalSuccessful = insertedMembers.length;
    const totalDuplicates = duplicateMembers.length;
    const totalInvalid = totalInvalidMembers.length;

    return {
      success: totalSuccessful > 0,
      message: `Import completed in ${processingTime}ms. ${totalSuccessful} members imported successfully.`,
      summary: {
        totalRows: totalProcessed,
        imported: totalSuccessful,
        duplicates: totalDuplicates,
        invalid: totalInvalid,
        processingTimeMs: processingTime
      },
      data: {
        imported: insertedMembers,
        duplicates: duplicateMembers.map(d => ({
          rowNumber: d.rowNumber,
          data: d.data,
          duplicateDetails: d.duplicateDetails
        })),
        invalid: totalInvalidMembers
      }
    };
  } catch (error) {
    console.error('Error importing members from CSV:', error);
    return {
      success: false,
      message: `Import failed: ${error.message}`,
      error: error.message,
      summary: {
        totalRows: 0,
        imported: 0,
        duplicates: 0,
        invalid: 0
      },
      data: {
        imported: [],
        duplicates: [],
        invalid: []
      }
    };
  }
}

/**
 * Validate a member row from CSV
 * @param {Object} rowData - Row data from CSV
 * @param {Number} rowNumber - Row number for error reporting
 * @returns {Array} Array of validation error messages
 */
function validateMemberRow(rowData, rowNumber = null) {
  const errors = [];

  // Required fields
  const requiredFields = ['firstname', 'lastname', 'birthdate', 'age', 'gender', 'address', 'email', 'phone_number'];
  for (const field of requiredFields) {
    if (!rowData[field] || rowData[field].trim() === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate email format
  if (rowData.email && rowData.email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(rowData.email.trim())) {
      errors.push('Invalid email format');
    }
  }

  // Validate birthdate format
  if (rowData.birthdate && rowData.birthdate.trim() !== '') {
    const birthdate = moment(rowData.birthdate.trim(), ['YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY'], true);
    if (!birthdate.isValid()) {
      errors.push('Invalid birthdate format (use YYYY-MM-DD, MM/DD/YYYY, or DD/MM/YYYY)');
    }
  }

  // Validate gender
  if (rowData.gender && rowData.gender.trim() !== '') {
    const gender = rowData.gender.trim().toUpperCase();
    if (!['M', 'F', 'O'].includes(gender)) {
      errors.push('Invalid gender (must be M, F, or O)');
    }
  }

  // Validate age (should be positive number)
  if (rowData.age && rowData.age.trim() !== '') {
    const age = parseInt(rowData.age.trim());
    if (isNaN(age) || age < 0 || age > 150) {
      errors.push('Invalid age (must be a number between 0 and 150)');
    }
  }

  // Validate phone number format (basic validation)
  if (rowData.phone_number && rowData.phone_number.trim() !== '') {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(rowData.phone_number.trim())) {
      errors.push('Invalid phone number format');
    }
  }

  return errors;
}

module.exports = {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
  getNextMemberId,
  exportMembersToExcel,
  getAllMembersForSelect,
  getAllDepartmentMembersForSelect,
  getAllPastorsForSelect,
  getAllMembersWithoutPastorsForSelect,
  getSpecificMemberByEmailAndStatus,
  importMembersFromCSV
};


