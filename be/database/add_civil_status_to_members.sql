-- Add civil_status column to tbl_members table
-- This migration adds a civil_status field to store member's civil status (single, married, widowed, divorced, separated)

ALTER TABLE tbl_members 
ADD COLUMN civil_status VARCHAR(20) NULL 
DEFAULT 'single'
AFTER phone_number;

-- Add index for better query performance if needed
-- CREATE INDEX idx_civil_status ON tbl_members(civil_status);

