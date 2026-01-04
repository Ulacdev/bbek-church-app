# Audit Trail System Setup Guide

## Overview
The Audit Trail system automatically tracks all user actions performed in the web application. It logs actions such as CREATE, UPDATE, DELETE, VIEW, LOGIN, LOGOUT, and more for all entities in the system.

## Database Setup

### Step 1: Create the Audit Trail Table
Run the SQL script to create the `tbl_audit_trail` table:

```bash
mysql -u your_username -p your_database_name < database/create_audit_trail_table.sql
```

Or execute the SQL directly in your MySQL client:

```sql
-- See database/create_audit_trail_table.sql for the full SQL script
```

### Step 2: Verify Table Creation
Verify that the table was created successfully:

```sql
DESCRIBE tbl_audit_trail;
SELECT COUNT(*) FROM tbl_audit_trail;
```

## Features

### Automatic Logging
- All authenticated API requests are automatically logged
- User information (ID, email, name, position) is captured
- Action type, entity type, and entity ID are extracted from the request
- IP address and user agent are recorded
- Old and new values are stored for UPDATE actions
- Success/failure status is tracked

### Tracked Actions
- **CREATE**: Creating new records
- **UPDATE**: Updating existing records
- **DELETE**: Deleting records
- **VIEW**: Viewing a single record
- **VIEW_LIST**: Viewing a list of records
- **LOGIN**: User login actions
- **LOGOUT**: User logout actions
- **EXPORT**: Exporting data
- **VIEW_CERTIFICATE**: Viewing certificates

### Tracked Entities
- member
- account
- department
- ministry
- event
- approval
- tithe
- church_leader
- department_officer
- marriage_service
- water_baptism
- burial_service
- child_dedication
- transaction

## Frontend Access

### Navigation
1. Log in to the admin dashboard
2. Navigate to **Maintenance** → **Audit Trail**

### Features Available
- **Summary Cards**: View total actions, recent activity (24h), success/failure counts
- **Advanced Filtering**: Filter by:
  - Search query (user, description, entity)
  - Action type
  - Entity type
  - Status (success, failed, error)
  - Date range
- **Pagination**: Navigate through audit logs with configurable page size
- **Details View**: Click the eye icon to view full details of any audit log entry
- **Real-time Updates**: Refresh button to fetch latest audit logs

## API Endpoints

### Get All Audit Logs
```
GET /api/audit-trail/getAllAuditLogs
Query Parameters:
  - page: Page number (default: 1)
  - pageSize: Items per page (default: 10)
  - search: Search query
  - user_id: Filter by user ID
  - action_type: Filter by action type
  - entity_type: Filter by entity type
  - status: Filter by status
  - date_from: Start date (YYYY-MM-DD)
  - date_to: End date (YYYY-MM-DD)
  - sortBy: Sort option
```

### Get Audit Log by ID
```
GET /api/audit-trail/getAuditLogById/:id
```

### Get Summary Statistics
```
GET /api/audit-trail/getAuditTrailSummary
```

## Manual Logging

If you need to manually log an action in your route handlers, you can use:

```javascript
const { manualLogAction } = require('../middleware/auditTrailMiddleware');

// In your route handler
await manualLogAction(req, {
  actionType: 'CUSTOM_ACTION',
  entityType: 'custom_entity',
  entityId: '123',
  description: 'Custom action description',
  oldValues: { /* old data */ },
  newValues: { /* new data */ },
  status: 'success'
});
```

## Database Schema

### tbl_audit_trail
- `audit_id` (INT, PK, AI): Auto-incrementing primary key
- `user_id` (VARCHAR(45), NN): User/Account ID
- `user_email` (VARCHAR(255)): User email
- `user_name` (VARCHAR(255)): User full name
- `user_position` (VARCHAR(100)): User position/role
- `action_type` (VARCHAR(50), NN): Type of action
- `entity_type` (VARCHAR(100), NN): Type of entity
- `entity_id` (VARCHAR(45)): ID of affected entity
- `description` (TEXT): Action description
- `ip_address` (VARCHAR(45)): User IP address
- `user_agent` (TEXT): Browser/user agent info
- `old_values` (JSON): Previous values (for updates)
- `new_values` (JSON): New values (for creates/updates)
- `status` (VARCHAR(45), NN, default: 'success'): Action status
- `error_message` (TEXT): Error message if failed
- `date_created` (DATETIME, NN): Timestamp

## Indexes
The table includes indexes on:
- `user_id`
- `action_type`
- `entity_type`
- `entity_id`
- `status`
- `date_created`
- `user_email`

## Notes
- Audit logging is non-blocking - it won't affect the performance of your main requests
- Failed audit log writes are logged to console but don't break the main request
- The middleware automatically extracts user information from the JWT token
- All actions are logged after the response is sent to ensure accurate status tracking

## Troubleshooting

### No audit logs appearing
1. Check that the table exists: `SHOW TABLES LIKE 'tbl_audit_trail';`
2. Check middleware is loaded: Look for "Error in audit trail middleware" in server logs
3. Verify user is authenticated: Audit logs only capture authenticated requests
4. Check database connection: Ensure the database connection is working

### Performance issues
- Consider archiving old audit logs periodically
- The table is indexed for common queries
- Use date range filters to limit query results

## Maintenance

### Archiving Old Logs
Consider creating an archive table and moving logs older than a certain date:

```sql
CREATE TABLE tbl_audit_trail_archive LIKE tbl_audit_trail;

INSERT INTO tbl_audit_trail_archive 
SELECT * FROM tbl_audit_trail 
WHERE date_created < DATE_SUB(NOW(), INTERVAL 1 YEAR);

DELETE FROM tbl_audit_trail 
WHERE date_created < DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

