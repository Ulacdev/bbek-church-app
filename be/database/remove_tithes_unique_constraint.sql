-- Remove the unique constraint on member_id in tbl_tithes
-- This allows multiple donations from the same member

-- Drop the unique key constraint
ALTER TABLE tbl_tithes
DROP INDEX member_id_UNIQUE;

-- Verify the change
-- SHOW INDEX FROM tbl_tithes;