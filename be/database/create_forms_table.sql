-- Create forms table for storing form submissions (Schedule Change Requests, Prayer Requests, etc.)
-- This table uses a flexible structure to handle different form types

CREATE TABLE IF NOT EXISTS `tbl_forms` (
  `form_id` INT NOT NULL AUTO_INCREMENT,
  `form_type` VARCHAR(50) NOT NULL COMMENT 'Type of form: schedule_change, prayer_request, etc.',
  `submitted_by` VARCHAR(45) NULL COMMENT 'User ID who submitted the form (from tbl_accounts) - NULL for anonymous submissions',
  `status` VARCHAR(50) NOT NULL DEFAULT 'pending' COMMENT 'Status: pending, approved, rejected',
  
  -- Form-specific data stored as JSON for flexibility
  `form_data` JSON NOT NULL COMMENT 'Form-specific data stored as JSON (varies by form_type)',
  
  -- Common fields
  `name` VARCHAR(255) NULL COMMENT 'Submitter name (for prayer requests or anonymous submissions)',
  `email` VARCHAR(255) NULL COMMENT 'Submitter email',
  `phone` VARCHAR(50) NULL COMMENT 'Submitter phone number',
  
  -- Admin fields
  `admin_notes` TEXT NULL COMMENT 'Admin notes/comments on the form submission',
  `reviewed_by` VARCHAR(45) NULL COMMENT 'User ID who reviewed the form (from tbl_accounts)',
  `reviewed_at` DATETIME NULL COMMENT 'Timestamp when form was reviewed',
  
  -- Timestamps
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when form was submitted',
  `updated_at` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when form was last updated',
  
  PRIMARY KEY (`form_id`),
  INDEX `idx_form_type` (`form_type`),
  INDEX `idx_status` (`status`),
  INDEX `idx_submitted_by` (`submitted_by`),
  INDEX `idx_email` (`email`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_form_type_status` (`form_type`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Forms table for storing various form submissions';

-- Example JSON structure for form_data:
-- For schedule_change:
-- {
--   "serviceType": "child-dedication",
--   "originalDate": "2024-12-15",
--   "requestedDate": "2024-12-22",
--   "reason": "Family emergency - need to reschedule"
-- }
--
-- For prayer_request:
-- {
--   "request": "Please pray for my family's health",
--   "anonymous": false
-- }

