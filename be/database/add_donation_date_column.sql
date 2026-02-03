-- Add donation_date column to tbl_tithes
-- This allows recording donations that happened on a different date than when the record was created

ALTER TABLE tbl_tithes
ADD COLUMN donation_date DATE NULL AFTER date_created;

-- Update existing records to set donation_date = date_created for backward compatibility
UPDATE
  tbl_tithes
SET donation_date = DATE(date_created)
WHERE
  donation_date IS NULL;

-- Add index on donation_date for faster filtering
ALTER TABLE tbl_tithes ADD INDEX idx_donation_date (donation_date);