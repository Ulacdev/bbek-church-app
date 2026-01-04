const { createAuditLog } = require('../dbHelpers/auditTrailRecords');
const { query } = require('../database/db');

/**
 * Audit Trail Middleware
 * Automatically logs user actions to the audit trail
 */

/**
 * Get user information from database based on user_id (acc_id)
 * @param {String} userId - User/Account ID
 * @returns {Promise<Object>} User information
 */
async function getUserInfo(userId) {
  try {
    if (!userId) return null;

    // Get account info and join with members table to get fullname
    // tbl_accounts doesn't have firstname/lastname, so we join with tbl_members
    const sql = `
      SELECT 
        a.acc_id,
        a.email,
        a.position,
        CONCAT(
          COALESCE(m.firstname, ''),
          IF(m.middle_name IS NOT NULL AND m.middle_name != '', CONCAT(' ', m.middle_name), ''),
          IF(m.lastname IS NOT NULL AND m.lastname != '', CONCAT(' ', m.lastname), '')
        ) as fullname
      FROM tbl_accounts a
      LEFT JOIN tbl_members m ON a.email = m.email
      WHERE a.acc_id = ?
    `;
    const [rows] = await query(sql, [userId]);
    
    if (rows.length > 0) {
      return {
        user_id: rows[0].acc_id,
        user_email: rows[0].email || null,
        user_name: rows[0].fullname || rows[0].email || null, // Fallback to email if no fullname
        user_position: rows[0].position || null
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user info for audit trail:', error);
    return null;
  }
}

/**
 * Extract entity type and ID from request path
 * @param {String} path - Request path
 * @param {String} method - HTTP method
 * @returns {Object} Entity type and ID
 */
function extractEntityInfo(path, method) {
  // Map API paths to entity types based on actual routes in index.js
  // Order matters - more specific paths should come first
  const pathMappings = {
    '/api/church-records/members': 'member',
    '/api/church-records/accounts': 'account',
    '/api/church-records/departments': 'department',
    '/api/church-records/ministries': 'ministry',
    '/api/church-records/events': 'event',
    '/api/church-records/approvals': 'approval',
    '/api/church-records/tithes': 'tithe',
    '/api/church-records/church-leaders': 'church_leader',
    '/api/church-records/department-officers': 'department_officer',
    '/api/church-records/child-dedications': 'child_dedication',
    '/api/church-records/burial-services': 'burial_service',
    '/api/services/water-baptisms': 'water_baptism',
    '/api/services/marriage-services': 'marriage_service',
    '/api/transactions': 'transaction',
    '/api/member-registration': 'member_registration',
    '/api/audit-trail': 'audit_trail',
    '/api/archives': 'archive',
    '/api/announcements': 'announcement',
    '/api/forms': 'form',
    '/api/cms': 'cms_page',
    '/api/dashboard': 'dashboard'
  };

  let entityType = 'unknown';
  let entityId = null;

  // Find matching path prefix (check longest matches first)
  const sortedPrefixes = Object.entries(pathMappings).sort((a, b) => b[0].length - a[0].length);
  for (const [prefix, type] of sortedPrefixes) {
    if (path.startsWith(prefix)) {
      entityType = type;
      break;
    }
  }

  // If still unknown, try to infer from path segments
  if (entityType === 'unknown') {
    const pathSegments = path.split('/').filter(seg => seg && !seg.includes('?'));
    
    // Try to extract entity type from path segments
    // e.g., /api/something/action -> 'something'
    if (pathSegments.length >= 2 && pathSegments[0] === 'api') {
      const potentialEntity = pathSegments[1];
      // Convert kebab-case or snake_case to snake_case
      const normalizedEntity = potentialEntity
        .replace(/-/g, '_')
        .toLowerCase();
      
      // Only use if it looks like a valid entity name (alphanumeric and underscores)
      if (/^[a-z][a-z0-9_]*$/.test(normalizedEntity)) {
        entityType = normalizedEntity;
      }
    }
  }

  // Extract ID from path patterns:
  // - /getXById/:id
  // - /updateX/:id
  // - /deleteX/:id
  // - /getXByY/:y (where Y is a field like memberId)
  // - /:id (direct ID in path)
  const idPatterns = [
    /\/get\w+ById\/(\d+)/i,           // getMemberById/123
    /\/update\w+\/(\d+)/i,              // updateMember/123
    /\/delete\w+\/(\d+)/i,             // deleteMember/123
    /\/get\w+By\w+\/(\d+)/i,           // getTitheByMemberId/123
    /\/update\w+Status\/(\d+)/i,        // updateApprovalStatus/123
    /\/(\d+)(?:\?|$)/                  // /123 or /123?param=value
  ];

  for (const pattern of idPatterns) {
    const match = path.match(pattern);
    if (match) {
      entityId = match[1];
      break;
    }
  }

  // If no ID found in path, try to extract from request body (for POST/PUT)
  // This will be handled in logAuditAction function

  return { entityType, entityId };
}

/**
 * Determine action type from HTTP method and path
 * Based on actual route patterns in the codebase
 * @param {String} method - HTTP method
 * @param {String} path - Request path
 * @returns {String} Action type
 */
function getActionType(method, path) {
  const upperMethod = method.toUpperCase();
  const lowerPath = path.toLowerCase();
  
  // Check for specific action patterns in path (order matters - check specific first)
  
  // Authentication actions
  if (lowerPath.includes('/login')) return 'LOGIN';
  if (lowerPath.includes('/logout')) return 'LOGOUT';
  if (lowerPath.includes('/forgotpassword')) return 'FORGOT_PASSWORD';
  if (lowerPath.includes('/verifycredentials')) return 'VERIFY_CREDENTIALS';
  
  // Certificate actions
  if (lowerPath.includes('/getcertificatedata')) return 'VIEW_CERTIFICATE';
  
  // Export actions
  if (lowerPath.includes('/exportexcel') || lowerPath.includes('/export')) return 'EXPORT';
  
  // Check actions
  if (lowerPath.includes('/check')) return 'CHECK';
  
  // CRUD actions based on route patterns
  if (lowerPath.includes('/create')) return 'CREATE';
  if (lowerPath.includes('/register')) return 'CREATE'; // member registration
  if (lowerPath.includes('/update')) return 'UPDATE';
  if (lowerPath.includes('/delete')) return 'DELETE';
  
  // GET requests - determine if viewing single record or list
  if (upperMethod === 'GET') {
    // Patterns that indicate viewing a single record:
    // - /getXById/:id
    // - /getXByY/:y (e.g., getTitheByMemberId/:memberId)
    // - /getX/:id (direct ID)
    // - /getCertificateData/:id
    // - /me (get current user)
    if (lowerPath.includes('/getbyid') || 
        lowerPath.includes('/getby') || 
        lowerPath.includes('/getcertificatedata') ||
        lowerPath.endsWith('/me') ||
        /\/get\w+byid\/\d+/i.test(path) ||
        /\/get\w+by\w+\/\d+/i.test(path) ||
        /\/(\d+)(?:\?|$)/.test(path)) {
      return 'VIEW';
    }
    
    // Patterns that indicate viewing a list:
    // - /getAllX
    // - /getAllXForSelect
    // - /getTotalsByServiceType (summary/statistics)
    if (lowerPath.includes('/getall') || 
        lowerPath.includes('/gettotals') ||
        lowerPath.includes('/getaudittrailsummary')) {
      return 'VIEW_LIST';
    }
    
    // Default for GET is VIEW_LIST
    return 'VIEW_LIST';
  }
  
  // Map HTTP methods to action types (fallback)
  switch (upperMethod) {
    case 'POST':
      return 'CREATE';
    case 'PUT':
    case 'PATCH':
      return 'UPDATE';
    case 'DELETE':
      return 'DELETE';
    default:
      return 'UNKNOWN';
  }
}

/**
 * Create audit log entry
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {String} actionType - Action type override (optional)
 * @param {String} entityType - Entity type override (optional)
 * @param {String} entityId - Entity ID override (optional)
 * @param {String} description - Description override (optional)
 * @param {Object} oldValues - Old values for UPDATE actions (optional)
 * @param {Object} newValues - New values for CREATE/UPDATE actions (optional)
 * @param {String} status - Status (success, failed, error) - default: 'success'
 * @param {String} errorMessage - Error message if status is not success (optional)
 */
async function logAuditAction(req, res, options = {}) {
  try {
    // Don't log audit trail routes themselves to avoid recursion
    if (req.path.startsWith('/api/audit-trail')) {
      return;
    }
    
    // Don't log if user is not authenticated (unless it's a login action)
    if (!req.user && !req.path.includes('/login')) {
      return;
    }

    const {
      actionType: overrideActionType,
      entityType: overrideEntityType,
      entityId: overrideEntityId,
      description: overrideDescription,
      oldValues,
      newValues,
      status: overrideStatus = 'success',
      errorMessage
    } = options;

    // Get user info
    let userInfo = {
      user_id: req.user?.acc_id || req.user?.user_id || 'anonymous',
      user_email: req.user?.email || null,
      user_name: null,
      user_position: req.user?.position || null
    };

    // Fetch full user info if we have user_id
    if (userInfo.user_id && userInfo.user_id !== 'anonymous') {
      const fullUserInfo = await getUserInfo(userInfo.user_id);
      if (fullUserInfo) {
        userInfo = { ...userInfo, ...fullUserInfo };
      }
    }

    // Extract entity info
    const { entityType: extractedEntityType, entityId: extractedEntityId } = extractEntityInfo(req.path, req.method);
    const finalEntityType = overrideEntityType || extractedEntityType;
    
    // Log warning if entity type is still unknown (for debugging)
    if (finalEntityType === 'unknown' && !overrideEntityType) {
      console.warn(`[Audit Trail] Unknown entity type for path: ${req.method} ${req.path}`);
    }
    
    // Try to extract entity ID from various sources (in order of priority):
    // 1. Override parameter
    // 2. Extracted from path
    // 3. Request body fields (common ID field names)
    // 4. Request params (for routes like /:id)
    const possibleEntityIds = [
      overrideEntityId,
      extractedEntityId,
      req.params?.id,
      req.params?.memberId,
      req.body?.id,
      req.body?.member_id,
      req.body?.acc_id,
      req.body?.transaction_id,
      req.body?.event_id,
      req.body?.ministry_id,
      req.body?.department_id,
      req.body?.approval_id,
      req.body?.baptism_id,
      req.body?.marriage_id,
      req.body?.burial_id,
      req.body?.child_dedication_id,
      req.body?.child_id,
      req.body?.tithe_id,
      req.body?.church_leader_id,
      req.body?.department_officer_id
    ].filter(id => id !== null && id !== undefined);
    
    // Always provide a value for entity_id - use a generated value if none found
    let finalEntityId = possibleEntityIds.length > 0 ? String(possibleEntityIds[0]) : null;
    
    // If still no ID found, generate one based on entity type and timestamp or use path
    if (!finalEntityId) {
      // Try to use a meaningful identifier from the path or body
      const pathSegments = req.path.split('/').filter(seg => seg && !seg.includes('?'));
      const lastSegment = pathSegments[pathSegments.length - 1];
      
      // If last segment looks like an ID (numeric or alphanumeric), use it
      if (lastSegment && /^[a-zA-Z0-9_-]+$/.test(lastSegment) && lastSegment !== finalEntityType) {
        finalEntityId = lastSegment;
      } else {
        // Generate a unique identifier based on entity type, timestamp, and user
        const timestamp = Date.now();
        const userId = userInfo.user_id || 'unknown';
        finalEntityId = `${finalEntityType}_${userId}_${timestamp}`;
      }
    }

    // Determine action type
    const finalActionType = overrideActionType || getActionType(req.method, req.path);

    // Get the route that was accessed (include method and full path)
    const routeAccessed = `${req.method} ${req.originalUrl || req.path}`;
    
    // Use route as description (or override if provided)
    const description = overrideDescription || routeAccessed;

    // Get IP address and user agent
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || null;
    const userAgent = req.headers['user-agent'] || null;

    // Prepare audit data
    const auditData = {
      ...userInfo,
      action_type: finalActionType,
      entity_type: finalEntityType,
      entity_id: finalEntityId,
      description,
      ip_address: ipAddress,
      user_agent: userAgent,
      old_values: oldValues,
      new_values: newValues || (req.method !== 'GET' ? req.body : null),
      status: overrideStatus,
      error_message: errorMessage
    };

    // Create audit log (non-blocking - don't fail the request if logging fails)
    createAuditLog(auditData).catch(error => {
      console.error('Error creating audit log (non-blocking):', error);
    });
  } catch (error) {
    // Don't throw error - audit logging should never break the main request
    console.error('Error in audit trail middleware:', error);
  }
}

/**
 * Middleware to log actions after response is sent
 * This ensures we can log the status of the action
 */
const auditTrailMiddleware = (req, res, next) => {
  // Store original end function
  const originalEnd = res.end;
  const originalJson = res.json;

  // Override res.json to capture response
  res.json = function(body) {
    res.locals.responseBody = body;
    return originalJson.call(this, body);
  };

  // Override res.end to log after response is sent
  res.end = function(chunk, encoding) {
    // Log audit action after response is sent (non-blocking)
    setImmediate(async () => {
      try {
        // Determine status based on status code and response body
        let status = 'success'; // Default to success
        let errorMessage = null;

        // Check status code first
        if (res.statusCode) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            status = 'success';
          } else if (res.statusCode >= 400 && res.statusCode < 500) {
            status = 'failed';
          } else if (res.statusCode >= 500) {
            status = 'error';
          }
        }

        // Also check response body for success/failure indicators
        if (res.locals.responseBody) {
          const responseBody = res.locals.responseBody;
          
          // If response has explicit success: false, mark as failed
          if (responseBody.success === false) {
            status = 'failed';
            errorMessage = responseBody.error || responseBody.message || null;
          }
          // If response has explicit success: true, ensure status is success
          else if (responseBody.success === true) {
            status = 'success';
          }
          // If response has error field, mark as failed/error
          else if (responseBody.error) {
            status = res.statusCode >= 500 ? 'error' : 'failed';
            errorMessage = responseBody.error || responseBody.message || null;
          }
        }

        await logAuditAction(req, res, {
          status,
          errorMessage: status !== 'success' ? errorMessage : null
        });
      } catch (error) {
        console.error('Error in audit trail middleware callback:', error);
      }
    });

    // Call original end
    return originalEnd.call(this, chunk, encoding);
  };

  next();
};

/**
 * Helper function to manually log an action (for use in route handlers)
 * @param {Object} req - Express request object
 * @param {Object} options - Audit log options
 */
async function manualLogAction(req, options = {}) {
  await logAuditAction(req, null, options);
}

module.exports = {
  auditTrailMiddleware,
  logAuditAction,
  manualLogAction,
  getActionType,
  extractEntityInfo
};

