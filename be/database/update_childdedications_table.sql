-- ============================================
-- Update tbl_childdedications Table Schema
-- ============================================
-- This script updates the tbl_childdedications table to the new schema
-- 
-- WARNING: This will drop the existing table and recreate it with new structure
-- Backup your data before running this script if you need to preserve existing records
-- 
-- IMPORTANT: Before running this script, check the collation of member_id in tbl_members:
--   SHOW FULL COLUMNS FROM tbl_members WHERE Field = 'member_id';
-- 
-- If member_id uses a different collation (e.g., utf8mb4_general_ci or utf8mb4_0900_ai_ci),
-- you need to update the requested_by column definition below to match that collation.
-- ============================================

-- Drop the existing table (if you need to preserve data, export it first)
DROP TABLE IF EXISTS tbl_childdedications;

-- Create the new table with updated schema
CREATE TABLE tbl_childdedications (
  child_id VARCHAR(45) NOT NULL PRIMARY KEY,
  requested_by VARCHAR(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'Member ID of the person requesting the dedication',
  child_firstname VARCHAR(100) NOT NULL COMMENT 'Child\'s first name',
  child_lastname VARCHAR(100) NOT NULL COMMENT 'Child\'s last name',
  child_middle_name VARCHAR(100) NULL COMMENT 'Child\'s middle name',
  date_of_birth DATE NOT NULL COMMENT 'Child\'s date of birth',
  place_of_birth VARCHAR(255) NOT NULL COMMENT 'Child\'s place of birth',
  gender VARCHAR(1) NOT NULL COMMENT 'Child\'s gender (M/F)',
  preferred_dedication_date DATE NOT NULL COMMENT 'Preferred date for the dedication',
  contact_phone_number VARCHAR(45) NOT NULL COMMENT 'Contact phone number',
  contact_email VARCHAR(255) NULL COMMENT 'Contact email address',
  contact_address VARCHAR(500) NOT NULL COMMENT 'Contact address',
  father_firstname VARCHAR(100) NULL COMMENT 'Father\'s first name',
  father_lastname VARCHAR(100) NULL COMMENT 'Father\'s last name',
  father_middle_name VARCHAR(100) NULL COMMENT 'Father\'s middle name',
  father_phone_number VARCHAR(45) NULL COMMENT 'Father\'s phone number',
  father_email VARCHAR(255) NULL COMMENT 'Father\'s email address',
  father_address VARCHAR(500) NULL COMMENT 'Father\'s address',
  mother_firstname VARCHAR(100) NULL COMMENT 'Mother\'s first name',
  mother_lastname VARCHAR(100) NULL COMMENT 'Mother\'s last name',
  mother_middle_name VARCHAR(100) NULL COMMENT 'Mother\'s middle name',
  mother_phone_number VARCHAR(45) NULL COMMENT 'Mother\'s phone number',
  mother_email VARCHAR(255) NULL COMMENT 'Mother\'s email address',
  mother_address VARCHAR(500) NULL COMMENT 'Mother\'s address',
  sponsors VARCHAR(1000) NULL COMMENT 'JSON stringified array of sponsor objects (firstname, lastname, middle_name, phone_number, address)',
  status VARCHAR(45) NOT NULL DEFAULT 'pending' COMMENT 'Status of the dedication request (pending, approved, ongoing, completed, cancelled)',
  date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date when the record was created',
  
  INDEX idx_requested_by (requested_by),
  INDEX idx_status (status),
  INDEX idx_preferred_dedication_date (preferred_dedication_date),
  
  CONSTRAINT fk_childdedication_requested_by 
    FOREIGN KEY (requested_by) 
    REFERENCES tbl_members(member_id) 
    ON DELETE RESTRICT 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Notes:
-- - child_id remains the primary key (auto-generated)
-- - requested_by is a foreign key to tbl_members
-- - All child name fields are separate (firstname, lastname, middle_name)
-- - Contact details include phone, email, and address
-- - Father and mother details are optional (firstname, lastname, middle_name, phone_number, email, address)
-- - sponsors field stores JSON array of sponsor objects (firstname, lastname, middle_name, phone_number, address)
-- - preferred_dedication_date is the date the requester wants the dedication
-- - status defaults to 'pending'
-- ============================================

