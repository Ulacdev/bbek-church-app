-- Add date_completed column to tbl_childdedications
-- This stores the actual date when the child dedication ceremony was completed

ALTER TABLE tbl_childdedications
ADD COLUMN date_completed DATE NULL DEFAULT NULL AFTER preferred_dedication_date;

-- Add index for faster queries on date_completed
CREATE INDEX idx_childdedications_date_completed
ON tbl_childdedications(date_completed);