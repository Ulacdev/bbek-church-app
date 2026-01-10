-- Add family-related fields to tbl_members table
-- This migration adds profession, spouse_name, marriage_date, children (JSON array), and desire_ministry fields

ALTER TABLE tbl_members
ADD COLUMN profession VARCHAR(100) NULL AFTER civil_status
, ADD COLUMN spouse_name VARCHAR(100) NULL AFTER profession
, ADD COLUMN marriage_date DATE NULL AFTER spouse_name
, ADD COLUMN children JSON NULL AFTER marriage_date
, ADD COLUMN desire_ministry VARCHAR(255) NULL AFTER children;