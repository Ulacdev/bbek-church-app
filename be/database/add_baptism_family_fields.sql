-- Migration script to add family-related fields to tbl_waterbaptism table
-- Adds profession, spouse_name, marriage_date, children, and desire_ministry fields

-- Add profession column
ALTER TABLE `tbl_waterbaptism`
ADD COLUMN IF NOT EXISTS `profession` VARCHAR(100) NULL AFTER `civil_status`;

-- Add spouse_name column
ALTER TABLE `tbl_waterbaptism`
ADD COLUMN IF NOT EXISTS `spouse_name` VARCHAR(100) NULL AFTER `profession`;

-- Add marriage_date column
ALTER TABLE `tbl_waterbaptism`
ADD COLUMN IF NOT EXISTS `marriage_date` DATE NULL AFTER `spouse_name`;

-- Add children column
ALTER TABLE `tbl_waterbaptism`
ADD COLUMN IF NOT EXISTS `children` JSON NULL COMMENT 'JSON array of children: [{"name": "string", "age": number, "gender": "M/F", "birthday": "YYYY-MM-DD"}]' AFTER `marriage_date`;

-- Add desire_ministry column
ALTER TABLE `tbl_waterbaptism`
ADD COLUMN IF NOT EXISTS `desire_ministry` VARCHAR(100) NULL AFTER `children`;

-- Add FULLTEXT index for the new text fields
ALTER TABLE `tbl_waterbaptism` ADD FULLTEXT IF NOT EXISTS(
  `profession`,
  `spouse_name`,
  `desire_ministry`
);

-- Verification query:
-- SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_COMMENT
-- FROM INFORMATION_SCHEMA.COLUMNS
-- WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tbl_waterbaptism'
-- AND COLUMN_NAME IN ('profession', 'spouse_name', 'marriage_date', 'children', 'desire_ministry')
-- ORDER BY ORDINAL_POSITION;</content>
</xai:function_call">The SQL migration file has been created successfully. You can run this script to add the new fields to your `tbl_waterbaptism` table. The script includes:

- **Profession field**: VARCHAR(100) for storing the applicant's profession
- **Spouse Name field**: VARCHAR(100) for married applicants
- **Marriage Date field**: DATE field for the wedding date
- **Children field**: JSON field to store an array of children objects with name, age, gender, and birthday
- **Desire Ministry field**: VARCHAR(100) for admin/staff to record desired ministry

The script uses `IF NOT EXISTS` to safely add columns without errors if they already exist, and includes FULLTEXT indexing for search capabilities.

To apply this migration, run the SQL script in your MySQL database.
