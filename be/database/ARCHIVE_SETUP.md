# Archive System Setup Guide

## Overview
The Archive system stores deleted records instead of permanently deleting them. Records can be restored back to their original tables.

## Database Setup

### Step 1: Create the Archive Table
Run the SQL script to create the `tbl_archives` table:

```bash
mysql -u your_username -p your_database_name < database/create_archive_table.sql
```

Or execute the SQL directly in your MySQL client:

```sql
-- See database/create_archive_table.sql for the full SQL script
```

### Step 2: Verify Table Creation
Verify that the table was created successfully:

```sql
DESCRIBE tbl_archives;
SELECT COUNT(*) FROM tbl_archives;
```

## How It Works

### Archiving Process
1. When a delete operation is called, the system:
   - Fetches the complete record data
   - Archives it to `tbl_archives` table
   - Then deletes it from the original table

### Restoration Process
1. User selects an archived record
2. System checks if a record with the same ID already exists
3. If not, restores the record back to its original table
4. Marks the archive as restored

## Updating Delete Functions

To enable archiving for other delete functions, follow this pattern:

### Example: Updating a Delete Function

**Before:**
```javascript
async function deleteRecord(recordId) {
  // ... validation ...
  const sql = 'DELETE FROM tbl_table WHERE id = ?';
  await query(sql, [recordId]);
  return { success: true, message: 'Record deleted' };
}
```

**After:**
```javascript
const { archiveBeforeDelete } = require('../archiveHelper');

async function deleteRecord(recordId, archivedBy = null) {
  // ... validation ...
  
  // Get the record data
  const recordCheck = await getRecordById(recordId);
  if (!recordCheck.success) {
    return { success: false, message: 'Record not found' };
  }

  // Archive before deleting
  await archiveBeforeDelete(
    'tbl_table',
    String(recordId),
    recordCheck.data,
    archivedBy
  );

  // Delete from original table
  const sql = 'DELETE FROM tbl_table WHERE id = ?';
  await query(sql, [recordId]);
  
  return { success: true, message: 'Record archived and deleted successfully' };
}
```

### Update Route Handler
```javascript
router.delete('/deleteRecord/:id', async (req, res) => {
  const { id } = req.params;
  const archivedBy = req.user?.acc_id || null; // Get user from JWT
  const result = await deleteRecord(parseInt(id), archivedBy);
  // ... handle response ...
});
```

## Supported Tables

The archive system supports restoration for these tables:
- `tbl_members` (member_id)
- `tbl_accounts` (acc_id)
- `tbl_departments` (department_id)
- `tbl_ministries` (ministry_id)
- `tbl_events` (event_id)
- `tbl_approvals` (approval_id)
- `tbl_tithes` (tithe_id)
- `tbl_church_leaders` (church_leader_id)
- `tbl_department_officers` (department_officer_id)
- `tbl_waterbaptism` (baptism_id)
- `tbl_marriage` (marriage_id)
- `tbl_burial` (burial_id)
- `tbl_child_dedication` (child_dedication_id)
- `tbl_transactions` (transaction_id)

## API Endpoints

### Get All Archives
```
GET /api/archives/getAllArchives
Query params: search, page, pageSize, original_table, restored, date_from, date_to, sortBy
```

### Get Archive by ID
```
GET /api/archives/getArchiveById/:id
```

### Restore Archive
```
POST /api/archives/restoreArchive/:id
Body: { restore_notes? }
```

### Get Archive Summary
```
GET /api/archives/getArchiveSummary
```

## Frontend Access

### Navigation
1. Log in to the admin dashboard
2. Navigate to **Maintenance** → **Archives**

### Features Available
- **Summary Cards**: View total archived, not restored, restored counts
- **Filtering**: Filter by table, restoration status, date range
- **View Details**: Click eye icon to view complete archived data
- **Restore**: Click restore icon to restore records back to original table
- **Pagination**: Navigate through archived records

## Database Schema

### tbl_archives
- `archive_id` (INT, PK, AI): Auto-incrementing primary key
- `original_table` (VARCHAR(100), NN): Name of the original table
- `original_id` (VARCHAR(45), NN): ID of the record in original table
- `archived_data` (JSON, NN): Complete JSON data of the archived record
- `archived_by` (VARCHAR(45)): User ID who archived the record
- `archived_at` (DATETIME, NN): Timestamp when archived
- `restored` (TINYINT(1), NN, default: 0): Whether restored (0 = no, 1 = yes)
- `restored_at` (DATETIME): Timestamp when restored
- `restored_by` (VARCHAR(45)): User ID who restored the record
- `restore_notes` (TEXT): Optional notes about restoration

## Notes
- Archiving is non-blocking - if archiving fails, deletion still proceeds
- Restoration checks for existing records to prevent duplicates
- All archived data is stored as JSON for easy restoration
- Archive records are never permanently deleted (for audit purposes)

## Next Steps

To enable archiving for all delete operations:

1. Update each delete function in `dbHelpers/church_records/` and `dbHelpers/services/`
2. Import `archiveBeforeDelete` from `archiveHelper.js`
3. Fetch record data before deletion
4. Call `archiveBeforeDelete` before the DELETE query
5. Update route handlers to pass `archivedBy` parameter

Example files already updated:
- ✅ `memberRecords.js` - `deleteMember()`
- ✅ `departmentRecords.js` - `deleteDepartment()`

Remaining files to update (if needed):
- `accountRecords.js` - `deleteAccount()`
- `ministryRecords.js` - `deleteMinistry()`
- `eventRecords.js` - `deleteEvent()`
- `approvalRecord.js` - `deleteApproval()`
- `tithesRecords.js` - `deleteTithe()`
- `churchLeaderRecords.js` - `deleteChurchLeader()`
- `departmentOfficerRecords.js` - `deleteDepartmentOfficer()`
- `waterBaptismRecords.js` - `deleteWaterBaptism()`
- `marriageServiceRecords.js` - `deleteMarriageService()`
- `burialServiceRecords.js` - `deleteBurialService()`
- `childDedicationRecords.js` - `deleteChildDedication()`
- `transactionRecords.js` - `deleteTransaction()`

