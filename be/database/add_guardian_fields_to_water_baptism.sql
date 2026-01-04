-- Add guardian fields to tbl_waterbaptism table
ALTER TABLE tbl_waterbaptism
ADD COLUMN guardian_name VARCHAR(100) NULL AFTER status
, ADD COLUMN guardian_contact VARCHAR(20) NULL AFTER guardian_name
, ADD COLUMN guardian_relationship VARCHAR(50) NULL AFTER guardian_contact;