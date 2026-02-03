-- Add reason_of_death column to tbl_burialservice
-- This field is optional to capture the cause of death

ALTER TABLE `tbl_burialservice`
ADD COLUMN `reason_of_death` VARCHAR(255) NULL AFTER `date_death`;

-- Verify the column was added
-- SELECT burial_id, deceased_name, date_death, reason_of_death FROM tbl_burialservice;
