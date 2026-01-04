-- Add guardian fields to tbl_members table
ALTER TABLE tbl_members
ADD COLUMN guardian_name VARCHAR(100) NULL AFTER position
, ADD COLUMN guardian_contact VARCHAR(20) NULL AFTER guardian_name
, ADD COLUMN guardian_relationship VARCHAR(50) NULL AFTER guardian_contact;