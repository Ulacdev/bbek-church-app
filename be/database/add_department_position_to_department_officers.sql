-- Migration: Add department_id and position columns to tbl_departmentofficers
-- This adds support for distinguishing between Admin (Department Lead) and regular departments
-- with position restrictions based on department type

-- Add department_id column
ALTER TABLE tbl_departmentofficers
ADD COLUMN department_id VARCHAR(50) NULL DEFAULT NULL AFTER member_id;

-- Add position column
ALTER TABLE tbl_departmentofficers
ADD COLUMN position VARCHAR(100) NULL DEFAULT NULL AFTER department_id;

-- Add index for faster queries
CREATE INDEX idx_department_officers_department_id
ON tbl_departmentofficers(department_id);
CREATE INDEX idx_department_officers_position
ON tbl_departmentofficers(position);

-- Update existing records to have NULL for new columns (they will need to be updated manually)
UPDATE
  tbl_departmentofficers
SET department_id = NULL, position = NULL
WHERE
  department_id IS NULL;