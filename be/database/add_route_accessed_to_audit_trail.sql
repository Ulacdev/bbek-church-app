-- Migration script to update description column to store route accessed
-- Run this if you already have the tbl_audit_trail table created
-- This updates the description field to store the route instead of a formatted description

-- Update the description column comment to reflect it now stores routes
ALTER TABLE `tbl_audit_trail` 
MODIFY COLUMN `description` TEXT NULL COMMENT 'The API route/endpoint that was accessed (e.g., GET /api/church-records/members/createMember)';

-- Add index for description (now contains routes) for better query performance
ALTER TABLE `tbl_audit_trail` 
ADD INDEX `idx_description` (`description`(255));

