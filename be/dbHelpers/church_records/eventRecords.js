const { query } = require('../../database/db');
const moment = require('moment');
const XLSX = require('xlsx');
const fs = require('fs');
const { archiveBeforeDelete } = require('../archiveHelper');

/**
 * Event Records CRUD Operations
 * Based on tbl_events schema:
 * - event_id (INT, PK, NN, AI) - auto-incrementing
 * - title (VARCHAR(45), NN)
 * - description (VARCHAR(500), NN)
 * - start_date (DATETIME, NN)
 * - end_date (DATETIME, NN)
 * - location (VARCHAR(45), NN)
 * - link (VARCHAR(150), nullable)
 * - type (VARCHAR(45), NN)
 * - status (VARCHAR(45), NN, default: 'pending')
 * - date_created (DATETIME, NN)
 * - image (LONGBLOB, nullable)
 * - joined_members (VARCHAR(2000), nullable) - JSON stringified array
 */

/**
 * Helper function to convert image to blob
 * Supports: base64 string, Buffer, file path
 * @param {String|Buffer|Object} imageInput - Image as base64 string, Buffer, or file path
 * @returns {Buffer|null} - Image as Buffer (blob) or null
 */
function convertImageToBlob(imageInput) {
  try {
    // If null or undefined, return null
    if (!imageInput) {
      return null;
    }

    // If already a Buffer, return it
    if (Buffer.isBuffer(imageInput)) {
      return imageInput;
    }

    // If it's a file object from multer (has buffer property)
    if (imageInput.buffer && Buffer.isBuffer(imageInput.buffer)) {
      return imageInput.buffer;
    }

    // If it's a file path (string starting with / or containing path separators)
    if (typeof imageInput === 'string' && (imageInput.startsWith('/') || imageInput.includes('\\') || imageInput.includes('/'))) {
      // Check if file exists
      if (fs.existsSync(imageInput)) {
        return fs.readFileSync(imageInput);
      }
      return null;
    }

    // If it's a base64 string
    if (typeof imageInput === 'string') {
      // Remove data URL prefix if present (e.g., "data:image/png;base64,")
      const base64Data = imageInput.includes(',') 
        ? imageInput.split(',')[1] 
        : imageInput;
      
      // Convert base64 to Buffer
      return Buffer.from(base64Data, 'base64');
    }

    return null;
  } catch (error) {
    console.error('Error converting image to blob:', error);
    throw new Error('Failed to convert image to blob: ' + error.message);
  }
}

/**
 * Helper function to convert blob to base64 string for JSON responses
 * @param {Buffer|null} blob - Image blob as Buffer
 * @returns {String|null} - Base64 string or null
 */
function convertBlobToBase64(blob) {
  try {
    if (!blob) {
      return null;
    }
    
    if (Buffer.isBuffer(blob)) {
      return blob.toString('base64');
    }
    
    return null;
  } catch (error) {
    console.error('Error converting blob to base64:', error);
    return null;
  }
}

/**
 * CREATE - Insert a new event record
 * @param {Object} eventData - Event data object
 * @returns {Promise<Object>} Result object
 */
async function createEvent(eventData) {
  try {
    const {
      title,
      description,
      start_date,
      end_date,
      location,
      link = null,
      type,
      status = 'pending',
      date_created = new Date(),
      image = null,
      joined_members = null
    } = eventData;

    // Validate required fields
    if (!title) {
      throw new Error('Missing required field: title');
    }
    if (!description) {
      throw new Error('Missing required field: description');
    }
    if (!start_date) {
      throw new Error('Missing required field: start_date');
    }
    if (!end_date) {
      throw new Error('Missing required field: end_date');
    }
    if (!location) {
      throw new Error('Missing required field: location');
    }
    if (!type) {
      throw new Error('Missing required field: type');
    }

    // Validate date range
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    if (isNaN(startDate.getTime())) {
      throw new Error('Invalid start_date format');
    }
    if (isNaN(endDate.getTime())) {
      throw new Error('Invalid end_date format');
    }
    if (endDate < startDate) {
      throw new Error('end_date must be after or equal to start_date');
    }

    // Format dates
    const formattedStartDate = moment(start_date).format('YYYY-MM-DD HH:mm:ss');
    const formattedEndDate = moment(end_date).format('YYYY-MM-DD HH:mm:ss');
    const formattedDateCreated = moment(date_created).format('YYYY-MM-DD HH:mm:ss');

    // Validate field lengths
    if (title.trim().length > 45) {
      throw new Error('Title exceeds maximum length of 45 characters');
    }
    if (description.trim().length > 500) {
      throw new Error('Description exceeds maximum length of 500 characters');
    }
    if (location.trim().length > 45) {
      throw new Error('Location exceeds maximum length of 45 characters');
    }
    if (link && link.trim().length > 45) {
      throw new Error('Link exceeds maximum length of 45 characters');
    }
    if (type.trim().length > 45) {
      throw new Error('Type exceeds maximum length of 45 characters');
    }
    if (status.trim().length > 45) {
      throw new Error('Status exceeds maximum length of 45 characters');
    }

    // Convert image to blob
    const imageBlob = convertImageToBlob(image);

    // Convert joined_members array to JSON string
    let joinedMembersJson = null;
    if (joined_members !== null && joined_members !== undefined) {
      if (Array.isArray(joined_members)) {
        joinedMembersJson = JSON.stringify(joined_members);
      } else if (typeof joined_members === 'string') {
        // If it's already a string, try to parse and re-stringify to validate
        try {
          const parsed = JSON.parse(joined_members);
          joinedMembersJson = JSON.stringify(parsed);
        } catch (e) {
          // If not valid JSON, treat as plain string and wrap in array
          joinedMembersJson = JSON.stringify([joined_members]);
        }
      } else {
        joinedMembersJson = JSON.stringify([joined_members]);
      }

      // Validate joined_members JSON length (max 2000 characters)
      if (joinedMembersJson.length > 2000) {
        throw new Error('Joined members data exceeds maximum length of 2000 characters');
      }
    }

    const sql = `
      INSERT INTO tbl_events 
        (title, description, start_date, end_date, location, link, type, status, date_created, image, joined_members)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      title.trim(),
      description.trim(),
      formattedStartDate,
      formattedEndDate,
      location.trim(),
      link ? link.trim() : null,
      type.trim(),
      status,
      formattedDateCreated,
      imageBlob,
      joinedMembersJson
    ];

    const [result] = await query(sql, params);
    
    // Fetch the created event
    const createdEvent = await getEventById(result.insertId);

    return {
      success: true,
      message: 'Event created successfully',
      data: createdEvent.data
    };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

/**
 * READ ALL - Get all event records with pagination and filters
 * @param {Object} options - Optional query parameters (search, limit, offset, page, pageSize, status, type, sortBy)
 * @returns {Promise<Object>} Object with paginated event records and metadata
 */
async function getAllEvents(options = {}) {
  try {
    // Extract and normalize parameters from options
    const search = options.search || options.q || null;
    const limit = options.limit !== undefined ? parseInt(options.limit) : undefined;
    const offset = options.offset !== undefined ? parseInt(options.offset) : undefined;
    const page = options.page !== undefined ? parseInt(options.page) : undefined;
    const pageSize = options.pageSize !== undefined ? parseInt(options.pageSize) : undefined;
    const status = options.status || null;
    const type = options.type || null;
    const sortBy = options.sortBy || null;

    // Build base query for counting total records
    let countSql = 'SELECT COUNT(*) as total FROM tbl_events';
    let countParams = [];

    // Build query for fetching records
    let sql = 'SELECT * FROM tbl_events';
    const params = [];

    // Build WHERE conditions array
    const whereConditions = [];
    let hasWhere = false;

    // Add search functionality
    const searchValue = search && search.trim() !== '' ? search.trim() : null;
    if (searchValue) {
      const searchCondition = `(title LIKE ? OR description LIKE ? OR location LIKE ? OR type LIKE ?)`;
      const searchPattern = `%${searchValue}%`;

      whereConditions.push(searchCondition);
      countParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
      hasWhere = true;
    }

    // Add status filter
    if (status && status !== 'All Statuses') {
      whereConditions.push('status = ?');
      countParams.push(status);
      params.push(status);
      hasWhere = true;
    }

    // Add type filter
    if (type && type !== 'All Types') {
      whereConditions.push('type = ?');
      countParams.push(type);
      params.push(type);
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
      case 'Title (A-Z)':
        orderByClause += 'title ASC';
        break;
      case 'Title (Z-A)':
        orderByClause += 'title DESC';
        break;
      case 'Start Date (Newest)':
        orderByClause += 'start_date DESC';
        break;
      case 'Start Date (Oldest)':
        orderByClause += 'start_date ASC';
        break;
      case 'End Date (Newest)':
        orderByClause += 'end_date DESC';
        break;
      case 'End Date (Oldest)':
        orderByClause += 'end_date ASC';
        break;
      case 'Date Created (Newest)':
        orderByClause += 'date_created DESC';
        break;
      case 'Date Created (Oldest)':
        orderByClause += 'date_created ASC';
        break;
      case 'Type (A-Z)':
        orderByClause += 'type ASC';
        break;
      case 'Status (A-Z)':
        orderByClause += 'status ASC';
        break;
      default:
        orderByClause += 'date_created DESC'; // Default sorting
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

    // Convert image blobs to base64 and create imageURL field, parse joined_members JSON for JSON response
    const processedRows = rows.map(event => {
      const processedEvent = { ...event };
      
      // Convert image blob to base64 and create imageURL field
      let imageUrl = null;
      if (event.image && Buffer.isBuffer(event.image)) {
        const base64String = convertBlobToBase64(event.image);
        if (base64String) {
          // Create data URL format for frontend use
          imageUrl = `data:image/jpeg;base64,${base64String}`;
        }
      }
      processedEvent.imageUrl = imageUrl;
      // Keep base64 image for backward compatibility, but prefer imageUrl
      if (event.image && Buffer.isBuffer(event.image)) {
        processedEvent.image = convertBlobToBase64(event.image);
      } else {
        processedEvent.image = null;
      }
      
      // Parse joined_members JSON string back to array
      if (event.joined_members) {
        try {
          processedEvent.joined_members = JSON.parse(event.joined_members);
        } catch (e) {
          console.warn('Failed to parse joined_members JSON for event_id:', event.event_id);
          processedEvent.joined_members = [];
        }
      } else {
        processedEvent.joined_members = [];
      }
      
      return processedEvent;
    });

    // Calculate pagination metadata
    const currentPage = page !== undefined ? parseInt(page) : (finalOffset !== null && finalLimit !== null ? Math.floor(finalOffset / finalLimit) + 1 : 1);
    const currentPageSize = finalLimit || processedRows.length;
    const totalPages = finalLimit ? Math.ceil(totalCount / finalLimit) : 1;

    return {
      success: true,
      message: 'Events retrieved successfully',
      data: processedRows,
      count: processedRows.length,
      totalCount: totalCount,
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
    console.error('Error fetching events:', error);
    throw error;
  }
}

/**
 * READ ONE - Get a single event by ID
 * @param {Number} eventId - Event ID
 * @returns {Promise<Object>} Event record
 */
async function getEventById(eventId) {
  try {
    if (!eventId) {
      throw new Error('Event ID is required');
    }

    const sql = 'SELECT * FROM tbl_events WHERE event_id = ?';
    const [rows] = await query(sql, [eventId]);

    if (rows.length === 0) {
      return {
        success: false,
        message: 'Event not found',
        data: null
      };
    }

    // Convert image blob to base64 and create imageURL field, parse joined_members JSON for JSON response
    const event = rows[0];
    
    // Convert image blob to base64 and create imageURL field
    let imageUrl = null;
    if (event.image && Buffer.isBuffer(event.image)) {
      const base64String = convertBlobToBase64(event.image);
      if (base64String) {
        // Create data URL format for frontend use
        imageUrl = `data:image/jpeg;base64,${base64String}`;
      }
    }
    event.imageUrl = imageUrl;
    // Keep base64 image for backward compatibility, but prefer imageUrl
    if (event.image && Buffer.isBuffer(event.image)) {
      event.image = convertBlobToBase64(event.image);
    } else {
      event.image = null;
    }
    
    // Parse joined_members JSON string back to array
    if (event.joined_members) {
      try {
        event.joined_members = JSON.parse(event.joined_members);
      } catch (e) {
        console.warn('Failed to parse joined_members JSON for event_id:', event.event_id);
        event.joined_members = [];
      }
    } else {
      event.joined_members = [];
    }

    return {
      success: true,
      message: 'Event retrieved successfully',
      data: event
    };
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
}

/**
 * UPDATE - Update an existing event record
 * @param {Number} eventId - Event ID
 * @param {Object} eventData - Updated event data
 * @returns {Promise<Object>} Result object
 */
async function updateEvent(eventId, eventData) {
  try {
    if (!eventId) {
      throw new Error('Event ID is required');
    }

    // Check if event exists
    const eventCheck = await getEventById(eventId);
    if (!eventCheck.success) {
      return {
        success: false,
        message: 'Event not found',
        data: null
      };
    }

    const {
      title,
      description,
      start_date,
      end_date,
      location,
      link,
      type,
      status,
      date_created,
      image,
      joined_members
    } = eventData;

    // Build dynamic update query based on provided fields
    const fields = [];
    const params = [];

    if (title !== undefined) {
      if (title.trim().length > 45) {
        throw new Error('Title exceeds maximum length of 45 characters');
      }
      fields.push('title = ?');
      params.push(title.trim());
    }

    if (description !== undefined) {
      if (description.trim().length > 500) {
        throw new Error('Description exceeds maximum length of 500 characters');
      }
      fields.push('description = ?');
      params.push(description.trim());
    }

    if (start_date !== undefined) {
      const startDate = new Date(start_date);
      if (isNaN(startDate.getTime())) {
        throw new Error('Invalid start_date format');
      }
      const formattedStartDate = moment(start_date).format('YYYY-MM-DD HH:mm:ss');
      fields.push('start_date = ?');
      params.push(formattedStartDate);
    }

    if (end_date !== undefined) {
      const endDate = new Date(end_date);
      if (isNaN(endDate.getTime())) {
        throw new Error('Invalid end_date format');
      }
      const formattedEndDate = moment(end_date).format('YYYY-MM-DD HH:mm:ss');
      fields.push('end_date = ?');
      params.push(formattedEndDate);
    }

    // Validate date range if both dates are being updated
    if (start_date !== undefined && end_date !== undefined) {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      if (endDate < startDate) {
        throw new Error('end_date must be after or equal to start_date');
      }
    } else if (start_date !== undefined) {
      // If only start_date is updated, check against existing end_date
      const existingEndDate = new Date(eventCheck.data.end_date);
      const newStartDate = new Date(start_date);
      if (existingEndDate < newStartDate) {
        throw new Error('end_date must be after or equal to start_date');
      }
    } else if (end_date !== undefined) {
      // If only end_date is updated, check against existing start_date
      const existingStartDate = new Date(eventCheck.data.start_date);
      const newEndDate = new Date(end_date);
      if (newEndDate < existingStartDate) {
        throw new Error('end_date must be after or equal to start_date');
      }
    }

    if (location !== undefined) {
      if (location.trim().length > 45) {
        throw new Error('Location exceeds maximum length of 45 characters');
      }
      fields.push('location = ?');
      params.push(location.trim());
    }

    if (link !== undefined) {
      if (link === null || link === '') {
        fields.push('link = ?');
        params.push(null);
      } else {
        if (link.trim().length > 500) {
          throw new Error('Link exceeds maximum length of 500 characters');
        }
        fields.push('link = ?');
        params.push(link.trim());
      }
    }

    if (type !== undefined) {
      if (type.trim().length > 45) {
        throw new Error('Type exceeds maximum length of 45 characters');
      }
      fields.push('type = ?');
      params.push(type.trim());
    }

    if (status !== undefined) {
      if (status.trim().length > 45) {
        throw new Error('Status exceeds maximum length of 45 characters');
      }
      fields.push('status = ?');
      params.push(status);
    }

    if (date_created !== undefined) {
      const formattedDateCreated = moment(date_created).format('YYYY-MM-DD HH:mm:ss');
      fields.push('date_created = ?');
      params.push(formattedDateCreated);
    }

    if (image !== undefined) {
      // Convert image to blob
      const imageBlob = convertImageToBlob(image);
      fields.push('image = ?');
      params.push(imageBlob);
    }

    if (joined_members !== undefined) {
      // Convert joined_members array to JSON string
      let joinedMembersJson = null;
      if (joined_members !== null) {
        if (Array.isArray(joined_members)) {
          joinedMembersJson = JSON.stringify(joined_members);
        } else if (typeof joined_members === 'string') {
          // If it's already a string, try to parse and re-stringify to validate
          try {
            const parsed = JSON.parse(joined_members);
            joinedMembersJson = JSON.stringify(parsed);
          } catch (e) {
            // If not valid JSON, treat as plain string and wrap in array
            joinedMembersJson = JSON.stringify([joined_members]);
          }
        } else {
          joinedMembersJson = JSON.stringify([joined_members]);
        }

        // Validate joined_members JSON length (max 2000 characters)
        if (joinedMembersJson.length > 2000) {
          throw new Error('Joined members data exceeds maximum length of 2000 characters');
        }
      }
      
      fields.push('joined_members = ?');
      params.push(joinedMembersJson);
    }

    if (fields.length === 0) {
      return {
        success: false,
        message: 'No fields to update',
        data: null
      };
    }

    params.push(eventId);

    const sql = `
      UPDATE tbl_events
      SET ${fields.join(', ')}
      WHERE event_id = ?
    `;

    const [result] = await query(sql, params);

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: 'Event not found or no changes made',
        data: null
      };
    }

    // Fetch updated event
    const updatedEvent = await getEventById(eventId);

    return {
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent.data
    };
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

/**
 * DELETE - Delete an event record (archives it first)
 * @param {Number} eventId - Event ID
 * @param {String} archivedBy - User ID who is deleting/archiving the record (optional)
 * @returns {Promise<Object>} Result object
 */
async function deleteEvent(eventId, archivedBy = null) {
  try {
    if (!eventId) {
      throw new Error('Event ID is required');
    }

    // Check if event exists
    const eventCheck = await getEventById(eventId);
    if (!eventCheck.success) {
      return {
        success: false,
        message: 'Event not found',
        data: null
      };
    }

    // Archive the record before deleting
    await archiveBeforeDelete(
      'tbl_events',
      String(eventId),
      eventCheck.data,
      archivedBy
    );

    // Delete from original table
    const sql = 'DELETE FROM tbl_events WHERE event_id = ?';
    const [result] = await query(sql, [eventId]);

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: 'Event not found',
        data: null
      };
    }

    return {
      success: true,
      message: 'Event archived and deleted successfully',
      data: { event_id: eventId }
    };
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

/**
 * EXPORT - Export event records to Excel
 * @param {Object} options - Optional query parameters (same as getAllEvents: search, status, type, sortBy)
 * @returns {Promise<Buffer>} Excel file buffer
 */
async function exportEventsToExcel(options = {}) {
  try {
    // Get all events matching the filters (without pagination for export)
    const exportOptions = { ...options };
    // Remove pagination to get all records
    delete exportOptions.limit;
    delete exportOptions.offset;
    delete exportOptions.page;
    delete exportOptions.pageSize;

    const result = await getAllEvents(exportOptions);
    
    if (!result.success || !result.data || result.data.length === 0) {
      throw new Error('No events found to export');
    }

    const events = result.data;

    // Prepare data for Excel export
    const excelData = events.map((event, index) => {
      return {
        'No.': index + 1,
        'Event ID': event.event_id || '',
        'Title': event.title || '',
        'Description': event.description || '',
        'Start Date': event.start_date ? moment(event.start_date).format('YYYY-MM-DD HH:mm:ss') : '',
        'End Date': event.end_date ? moment(event.end_date).format('YYYY-MM-DD HH:mm:ss') : '',
        'Location': event.location || '',
        'Link': event.link || '',
        'Type': event.type || '',
        'Status': event.status || '',
        'Date Created': event.date_created ? moment(event.date_created).format('YYYY-MM-DD HH:mm:ss') : '',
        'Created Date': event.date_created ? moment(event.date_created).format('YYYY-MM-DD') : ''
      };
    });

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 5 },   // No.
      { wch: 12 },  // Event ID
      { wch: 30 },  // Title
      { wch: 40 },  // Description
      { wch: 20 },  // Start Date
      { wch: 20 },  // End Date
      { wch: 25 },  // Location
      { wch: 30 },  // Link
      { wch: 20 },  // Type
      { wch: 15 },  // Status
      { wch: 20 },  // Date Created
      { wch: 15 }   // Created Date
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Events');

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
      compression: true
    });

    return excelBuffer;
  } catch (error) {
    console.error('Error exporting events to Excel:', error);
    throw error;
  }
}

/**
 * READ ALL BY MEMBER - Get all events where a specific member has joined
 * @param {Number} memberId - Member ID
 * @param {Object} options - Optional query parameters (search, limit, offset, page, pageSize, status, type, sortBy)
 * @returns {Promise<Object>} Object with paginated event records and metadata
 */
async function getEventsByMemberId(memberId, options = {}) {
  try {
    if (!memberId) {
      throw new Error('Member ID is required');
    }

    // Extract and normalize parameters from options
    const search = options.search || options.q || null;
    const limit = options.limit !== undefined ? parseInt(options.limit) : undefined;
    const offset = options.offset !== undefined ? parseInt(options.offset) : undefined;
    const page = options.page !== undefined ? parseInt(options.page) : undefined;
    const pageSize = options.pageSize !== undefined ? parseInt(options.pageSize) : undefined;
    const status = options.status || null;
    const type = options.type || null;
    const sortBy = options.sortBy || null;

    // Convert memberId to number for comparison
    const memberIdNum = parseInt(memberId);

    // First, get all events and filter by member_id in joined_members array
    // Build base query to fetch all events
    let sql = 'SELECT * FROM tbl_events';
    const params = [];

    // Build WHERE conditions array for other filters (not member_id)
    const whereConditions = [];
    let hasWhere = false;

    // Add search functionality
    const searchValue = search && search.trim() !== '' ? search.trim() : null;
    if (searchValue) {
      const searchCondition = `(title LIKE ? OR description LIKE ? OR location LIKE ? OR type LIKE ?)`;
      const searchPattern = `%${searchValue}%`;

      whereConditions.push(searchCondition);
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
      hasWhere = true;
    }

    // Add status filter
    if (status && status !== 'All Statuses') {
      whereConditions.push('status = ?');
      params.push(status);
      hasWhere = true;
    }

    // Add type filter
    if (type && type !== 'All Types') {
      whereConditions.push('type = ?');
      params.push(type);
      hasWhere = true;
    }

    // Apply WHERE clause if any conditions exist
    if (hasWhere) {
      const whereClause = ' WHERE ' + whereConditions.join(' AND ');
      sql += whereClause;
    }

    // Add sorting
    let orderByClause = ' ORDER BY ';
    const sortByValue = sortBy && sortBy.trim() !== '' ? sortBy.trim() : null;
    switch (sortByValue) {
      case 'Title (A-Z)':
        orderByClause += 'title ASC';
        break;
      case 'Title (Z-A)':
        orderByClause += 'title DESC';
        break;
      case 'Start Date (Newest)':
        orderByClause += 'start_date DESC';
        break;
      case 'Start Date (Oldest)':
        orderByClause += 'start_date ASC';
        break;
      case 'End Date (Newest)':
        orderByClause += 'end_date DESC';
        break;
      case 'End Date (Oldest)':
        orderByClause += 'end_date ASC';
        break;
      case 'Date Created (Newest)':
        orderByClause += 'date_created DESC';
        break;
      case 'Date Created (Oldest)':
        orderByClause += 'date_created ASC';
        break;
      case 'Type (A-Z)':
        orderByClause += 'type ASC';
        break;
      case 'Status (A-Z)':
        orderByClause += 'status ASC';
        break;
      default:
        orderByClause += 'date_created DESC'; // Default sorting
    }
    sql += orderByClause;

    // Execute query to get all events (before filtering by member_id)
    const [allRows] = await query(sql, params);

    // Filter events where member_id exists in joined_members array
    // joined_members is stored as VARCHAR string containing JSON array like "[1, 2, 3]"
    const filteredRows = allRows.filter(event => {
      // Check if joined_members exists and is not empty
      if (!event.joined_members || event.joined_members.trim() === '') {
        return false;
      }

      try {
        // Parse the JSON string to array
        const joinedMembersArray = JSON.parse(event.joined_members);
        
        // Check if it's an array and contains the member_id
        if (Array.isArray(joinedMembersArray)) {
          // Compare as numbers to handle zero-padded strings (e.g., "000000004" should match 4)
          // Convert both the array element and memberId to numbers for comparison
          return joinedMembersArray.some(id => {
            const idNum = parseInt(id);
            return !isNaN(idNum) && idNum === memberIdNum;
          });
        }
        return false;
      } catch (e) {
        // If parsing fails, skip this event
        console.warn('Failed to parse joined_members JSON for event_id:', event.event_id, e);
        return false;
      }
    });

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

    // Apply pagination to filtered results
    let rows;
    if (finalLimit !== null) {
      const limitValue = Math.max(1, parseInt(finalLimit) || 10);
      const offsetValue = Math.max(0, parseInt(finalOffset) || 0);
      rows = filteredRows.slice(offsetValue, offsetValue + limitValue);
    } else {
      rows = filteredRows;
    }

    // Convert image blobs to base64 and create imageURL field, parse joined_members JSON for JSON response
    const processedRows = rows.map(event => {
      const processedEvent = { ...event };
      
      // Convert image blob to base64 and create imageURL field
      let imageUrl = null;
      if (event.image && Buffer.isBuffer(event.image)) {
        const base64String = convertBlobToBase64(event.image);
        if (base64String) {
          // Create data URL format for frontend use
          imageUrl = `data:image/jpeg;base64,${base64String}`;
        }
      }
      processedEvent.imageUrl = imageUrl;
      // Keep base64 image for backward compatibility, but prefer imageUrl
      if (event.image && Buffer.isBuffer(event.image)) {
        processedEvent.image = convertBlobToBase64(event.image);
      } else {
        processedEvent.image = null;
      }
      
      // Parse joined_members JSON string back to array
      if (event.joined_members) {
        try {
          processedEvent.joined_members = JSON.parse(event.joined_members);
        } catch (e) {
          console.warn('Failed to parse joined_members JSON for event_id:', event.event_id);
          processedEvent.joined_members = [];
        }
      } else {
        processedEvent.joined_members = [];
      }
      
      return processedEvent;
    });

    // Calculate pagination metadata
    const currentPage = page !== undefined ? parseInt(page) : (finalOffset !== null && finalLimit !== null ? Math.floor(finalOffset / finalLimit) + 1 : 1);
    const currentPageSize = finalLimit || processedRows.length;
    // Calculate total pages based on filtered results
    const totalFilteredCount = filteredRows.length;
    const totalPages = finalLimit ? Math.ceil(totalFilteredCount / finalLimit) : 1;
    const hasMore = currentPage < totalPages;

    return {
      success: true,
      message: 'Events retrieved successfully',
      data: processedRows,
      count: processedRows.length,
      pagination: {
        page: currentPage,
        pageSize: currentPageSize,
        totalPages: totalPages,
        hasNextPage: hasMore,
        hasPreviousPage: currentPage > 1
      }
    };
  } catch (error) {
    console.error('Error fetching events by member ID:', error);
    throw error;
  }
}

/**
 * READ ALL SERMON EVENTS - Get all sermon events that are not pending
 * Prioritizes ongoing status, then sorts by latest date
 * @returns {Promise<Object>} Object with sermon event records
 */
async function getSermonEvents() {
  try {
    // Build query to get events where status != 'pending' AND type = 'sermon'
    // Sort: ongoing status first, then by start_date DESC (latest first)
    const sql = `
      SELECT * FROM tbl_events
      WHERE status != ? AND type = ?
      ORDER BY
        CASE WHEN status = 'ongoing' THEN 0 ELSE 1 END,
        start_date DESC
    `;

    const params = ['pending', 'sermon'];

    // Execute query
    const [rows] = await query(sql, params);

    // Convert image blobs to base64 and create imageURL field, parse joined_members JSON for JSON response
    const processedRows = rows.map(event => {
      const processedEvent = { ...event };

      // Convert image blob to base64 and create imageURL field
      let imageUrl = null;
      if (event.image && Buffer.isBuffer(event.image)) {
        const base64String = convertBlobToBase64(event.image);
        if (base64String) {
          // Create data URL format for frontend use
          imageUrl = `data:image/jpeg;base64,${base64String}`;
        }
      }
      processedEvent.imageUrl = imageUrl;
      // Keep base64 image for backward compatibility, but prefer imageUrl
      if (event.image && Buffer.isBuffer(event.image)) {
        processedEvent.image = convertBlobToBase64(event.image);
      } else {
        processedEvent.image = null;
      }

      // Parse joined_members JSON string back to array
      if (event.joined_members) {
        try {
          processedEvent.joined_members = JSON.parse(event.joined_members);
        } catch (e) {
          console.warn('Failed to parse joined_members JSON for event_id:', event.event_id);
          processedEvent.joined_members = [];
        }
      } else {
        processedEvent.joined_members = [];
      }

      return processedEvent;
    });

    return {
      success: true,
      message: 'Sermon events retrieved successfully',
      data: processedRows,
      count: processedRows.length
    };
  } catch (error) {
    console.error('Error fetching sermon events:', error);
    throw error;
  }
}

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  exportEventsToExcel,
  getEventsByMemberId,
  getSermonEvents
};

