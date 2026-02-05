-- Add cellphone column to tbl_audit_trail
-- Run this SQL to add cellphone field for tracking user phone numbers

ALTER TABLE tbl_audit_trail
ADD COLUMN cellphone VARCHAR(50) NULL AFTER user_position;

-- Update the column comment
ALTER TABLE tbl_audit_trail
MODIFY COLUMN cellphone VARCHAR(50) NULL COMMENT 'User cellphone number';

-- Verify the column was added
-- SELECT * FROM tbl_audit_trail LIMIT 1;
