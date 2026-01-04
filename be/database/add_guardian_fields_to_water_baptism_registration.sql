-- Add guardian fields to tbl_water_baptism_registration table
ALTER TABLE tbl_water_baptism_registration
ADD COLUMN guardian_name VARCHAR(100) NULL AFTER notes
, ADD COLUMN guardian_contact VARCHAR(20) NULL AFTER guardian_name
, ADD COLUMN guardian_relationship VARCHAR(50) NULL AFTER guardian_contact;