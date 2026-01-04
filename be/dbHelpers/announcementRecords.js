const { query } = require('../database/db');
const moment = require('moment');

/**
 * CREATE - Create a new announcement
 * @param {Object} announcementData - Announcement data
 * @returns {Promise<Object>} Created announcement
 */
async function createAnnouncement(announcementData) {
  try {
    const {
      title,
      content,
      type = 'info',
      priority = 'normal',
      target_audience = 'all',
      start_date = null,
      end_date = null,
      is_active = 1,
      created_by = null
    } = announcementData;

    const sql = `
      INSERT INTO tbl_announcements 
      (title, content, type, priority, target_audience, start_date, end_date, is_active, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Validate required fields
    if (!title || !content) {
      return {
        success: false,
        message: 'Title and content are required'
      };
    }

    // Ensure content is a string (convert object to JSON string if needed)
    let contentString = content;
    if (typeof content === 'object' && content !== null) {
      contentString = JSON.stringify(content);
    } else if (content !== null && content !== undefined) {
      contentString = String(content);
    } else {
      contentString = '';
    }

    // Handle is_active conversion (boolean to int)
    let isActiveValue = 1;
    if (is_active !== undefined && is_active !== null) {
      isActiveValue = (is_active === true || is_active === 1 || is_active === '1' || is_active === 'true') ? 1 : 0;
    }

    const params = [
      title,
      contentString,
      type,
      priority,
      target_audience,
      start_date ? moment(start_date).format('YYYY-MM-DD HH:mm:ss') : null,
      end_date ? moment(end_date).format('YYYY-MM-DD HH:mm:ss') : null,
      isActiveValue,
      created_by
    ];

    const [result] = await query(sql, params);

    if (!result || !result.insertId) {
      throw new Error('Failed to insert announcement into database');
    }

    return {
      success: true,
      message: 'Announcement created successfully',
      data: {
        announcement_id: result.insertId,
        ...announcementData
      }
    };
  } catch (error) {
    console.error('Error creating announcement:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    throw error;
  }
}

/**
 * READ ALL - Get all announcements with pagination and filters
 * @param {Object} options - Optional query parameters
 * @returns {Promise<Object>} Paginated announcements
 */
async function getAllAnnouncements(options = {}) {
  try {
    const search = options.search || options.q || null;
    const limit = options.limit !== undefined ? parseInt(options.limit) : undefined;
    const offset = options.offset !== undefined ? parseInt(options.offset) : undefined;
    const page = options.page !== undefined ? parseInt(options.page) : undefined;
    const pageSize = options.pageSize !== undefined ? parseInt(options.pageSize) : undefined;
    const type = options.type || null;
    const priority = options.priority || null;
    const target_audience = options.target_audience || null;
    const is_active = options.is_active !== undefined ? options.is_active : null;
    const sortBy = options.sortBy || null;

    // Build base query for counting total records
    let countSql = 'SELECT COUNT(*) as total FROM tbl_announcements a';
    let countParams = [];

    // Build query for fetching records with creator info
    let sql = `
      SELECT 
        a.*,
        CONCAT(
          COALESCE(m.firstname, ''),
          IF(m.middle_name IS NOT NULL AND m.middle_name != '', CONCAT(' ', m.middle_name), ''),
          IF(m.lastname IS NOT NULL AND m.lastname != '', CONCAT(' ', m.lastname), '')
        ) as created_by_name,
        acc.email as created_by_email
      FROM tbl_announcements a
      LEFT JOIN tbl_accounts acc ON a.created_by = acc.acc_id
      LEFT JOIN tbl_members m ON acc.email = m.email
    `;
    const params = [];

    // Build WHERE conditions array
    const whereConditions = [];
    let hasWhere = false;

    // Add search functionality
    const searchValue = search && search.trim() !== '' ? search.trim() : null;
    if (searchValue) {
      const searchCondition = `(a.title LIKE ? OR a.content LIKE ?)`;
      const searchPattern = `%${searchValue}%`;

      whereConditions.push(searchCondition);
      countParams.push(searchPattern, searchPattern);
      params.push(searchPattern, searchPattern);
      hasWhere = true;
    }

    // Add type filter
    if (type && type !== 'All Types') {
      whereConditions.push('a.type = ?');
      countParams.push(type);
      params.push(type);
      hasWhere = true;
    }

    // Add priority filter
    if (priority && priority !== 'All Priorities') {
      whereConditions.push('a.priority = ?');
      countParams.push(priority);
      params.push(priority);
      hasWhere = true;
    }

    // Add target_audience filter
    if (target_audience && target_audience !== 'All Audiences') {
      whereConditions.push('a.target_audience = ?');
      countParams.push(target_audience);
      params.push(target_audience);
      hasWhere = true;
    }

    // Add is_active filter
    if (is_active !== null && is_active !== undefined) {
      const activeValue = is_active === true || is_active === 'true' || is_active === 1 || is_active === '1' ? 1 : 0;
      whereConditions.push('a.is_active = ?');
      countParams.push(activeValue);
      params.push(activeValue);
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
      case 'Date (Newest)':
        orderByClause += 'a.created_at DESC';
        break;
      case 'Date (Oldest)':
        orderByClause += 'a.created_at ASC';
        break;
      case 'Title (A-Z)':
        orderByClause += 'a.title ASC';
        break;
      case 'Priority (High to Low)':
        orderByClause += "FIELD(a.priority, 'urgent', 'high', 'normal', 'low')";
        break;
      default:
        orderByClause += 'a.created_at DESC'; // Default sorting
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

    // Calculate pagination metadata
    const currentPage = page !== undefined ? parseInt(page) : (finalOffset !== null ? Math.floor(finalOffset / finalLimit) + 1 : 1);
    const currentPageSize = finalLimit || rows.length;
    const totalPages = finalLimit ? Math.ceil(totalCount / finalLimit) : 1;

    return {
      success: true,
      message: 'Announcements retrieved successfully',
      data: rows,
      count: rows.length,
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
    console.error('Error fetching announcements:', error);
    throw error;
  }
}

/**
 * READ ONE - Get a single announcement by ID
 * @param {Number} announcementId - Announcement ID
 * @returns {Promise<Object>} Announcement data
 */
async function getAnnouncementById(announcementId) {
  try {
    const sql = `
      SELECT 
        a.*,
        CONCAT(
          COALESCE(m.firstname, ''),
          IF(m.middle_name IS NOT NULL AND m.middle_name != '', CONCAT(' ', m.middle_name), ''),
          IF(m.lastname IS NOT NULL AND m.lastname != '', CONCAT(' ', m.lastname), '')
        ) as created_by_name,
        acc.email as created_by_email
      FROM tbl_announcements a
      LEFT JOIN tbl_accounts acc ON a.created_by = acc.acc_id
      LEFT JOIN tbl_members m ON acc.email = m.email
      WHERE a.announcement_id = ?
    `;

    const [rows] = await query(sql, [announcementId]);

    if (rows.length === 0) {
      return {
        success: false,
        message: 'Announcement not found',
        data: null
      };
    }

    return {
      success: true,
      message: 'Announcement retrieved successfully',
      data: rows[0]
    };
  } catch (error) {
    console.error('Error fetching announcement:', error);
    throw error;
  }
}

/**
 * UPDATE - Update an announcement
 * @param {Number} announcementId - Announcement ID
 * @param {Object} announcementData - Updated announcement data
 * @returns {Promise<Object>} Updated announcement
 */
async function updateAnnouncement(announcementId, announcementData) {
  try {
    const {
      title,
      content,
      type,
      priority,
      target_audience,
      start_date,
      end_date,
      is_active
    } = announcementData;

    // Ensure content is a string (convert object to JSON string if needed)
    let contentString = content;
    if (content !== undefined && content !== null) {
      if (typeof content === 'object') {
        contentString = JSON.stringify(content);
      } else {
        contentString = String(content);
      }
    } else {
      contentString = '';
    }

    const sql = `
      UPDATE tbl_announcements 
      SET 
        title = ?,
        content = ?,
        type = ?,
        priority = ?,
        target_audience = ?,
        start_date = ?,
        end_date = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE announcement_id = ?
    `;

    const params = [
      title,
      contentString,
      type,
      priority,
      target_audience,
      start_date ? moment(start_date).format('YYYY-MM-DD HH:mm:ss') : null,
      end_date ? moment(end_date).format('YYYY-MM-DD HH:mm:ss') : null,
      is_active !== undefined ? (is_active ? 1 : 0) : undefined,
      announcementId
    ];

    // Build params array properly
    const finalParams = [
      title,
      ...(contentString !== undefined ? [contentString] : []),
      type,
      priority,
      target_audience,
      start_date ? moment(start_date).format('YYYY-MM-DD HH:mm:ss') : null,
      end_date ? moment(end_date).format('YYYY-MM-DD HH:mm:ss') : null,
      is_active !== undefined ? (is_active ? 1 : 0) : undefined,
      announcementId
    ];

    await query(sql, params);

    return {
      success: true,
      message: 'Announcement updated successfully',
      data: { announcement_id: announcementId, ...announcementData }
    };
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
}

/**
 * DELETE - Delete an announcement
 * @param {Number} announcementId - Announcement ID
 * @param {String} archivedBy - User ID who archived the record
 * @returns {Promise<Object>} Deletion result
 */
async function deleteAnnouncement(announcementId, archivedBy = null) {
  try {
    // Archive before delete
    const { archiveBeforeDelete } = require('./archiveHelper');
    const announcement = await getAnnouncementById(announcementId);
    
    if (announcement.success && announcement.data) {
      await archiveBeforeDelete('tbl_announcements', announcementId, announcement.data, archivedBy);
    }

    const sql = 'DELETE FROM tbl_announcements WHERE announcement_id = ?';
    await query(sql, [announcementId]);

    return {
      success: true,
      message: 'Announcement deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
}

/**
 * Get active announcements for a user (not yet viewed)
 * @param {String} userId - User ID
 * @param {String} userPosition - User position/role
 * @returns {Promise<Array>} Array of active announcements for the user
 */
async function getActiveAnnouncementsForUser(userId, userPosition = 'non_member') {
  try {
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    
    // Build query based on whether user is authenticated
    let sql, params;
    
    if (userId) {
      // Authenticated user - check if they've viewed the announcement
      sql = `
        SELECT a.*
        FROM tbl_announcements a
        LEFT JOIN tbl_user_announcements ua ON a.announcement_id = ua.announcement_id AND ua.user_id = ?
        WHERE a.is_active = 1
          AND (a.start_date IS NULL OR a.start_date <= ?)
          AND (a.end_date IS NULL OR a.end_date >= ?)
          AND (a.target_audience = 'all' OR a.target_audience = ?)
          AND ua.tracking_id IS NULL
        ORDER BY 
          FIELD(a.priority, 'urgent', 'high', 'normal', 'low'),
          a.created_at DESC
      `;
      params = [userId, now, now, userPosition];
    } else {
      // Non-authenticated user - only show announcements for 'all' or 'non_member' audience
      // Note: We can't track views for non-authenticated users, so they'll see all active announcements
      sql = `
        SELECT a.*
        FROM tbl_announcements a
        WHERE a.is_active = 1
          AND (a.start_date IS NULL OR a.start_date <= ?)
          AND (a.end_date IS NULL OR a.end_date >= ?)
          AND (a.target_audience = 'all' OR a.target_audience = 'non_member')
        ORDER BY 
          FIELD(a.priority, 'urgent', 'high', 'normal', 'low'),
          a.created_at DESC
      `;
      params = [now, now];
    }

    const [rows] = await query(sql, params);

    return {
      success: true,
      message: 'Active announcements retrieved successfully',
      data: rows
    };
  } catch (error) {
    console.error('Error fetching active announcements for user:', error);
    throw error;
  }
}

/**
 * Mark announcement as viewed by user
 * @param {Number} announcementId - Announcement ID
 * @param {String} userId - User ID
 * @returns {Promise<Object>} Result
 */
async function markAnnouncementAsViewed(announcementId, userId) {
  try {
    const sql = `
      INSERT INTO tbl_user_announcements (announcement_id, user_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE viewed_at = CURRENT_TIMESTAMP
    `;

    await query(sql, [announcementId, userId]);

    return {
      success: true,
      message: 'Announcement marked as viewed'
    };
  } catch (error) {
    console.error('Error marking announcement as viewed:', error);
    throw error;
  }
}

/**
 * Get announcement summary statistics
 * @returns {Promise<Object>} Summary statistics
 */
async function getAnnouncementSummary() {
  try {
    const sql = `
      SELECT 
        COUNT(*) as total_count,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_count,
        SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive_count,
        SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent_count,
        SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_count,
        SUM(CASE WHEN target_audience = 'all' THEN 1 ELSE 0 END) as all_audience_count
      FROM tbl_announcements
    `;

    const [rows] = await query(sql);

    return {
      success: true,
      message: 'Summary statistics retrieved successfully',
      data: rows[0] || {}
    };
  } catch (error) {
    console.error('Error fetching announcement summary:', error);
    throw error;
  }
}

module.exports = {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getActiveAnnouncementsForUser,
  markAnnouncementAsViewed,
  getAnnouncementSummary
};

