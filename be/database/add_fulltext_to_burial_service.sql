-- Add FULLTEXT index to tbl_burialservice for enhanced search capabilities
-- This enables fast, relevance-based searching across multiple fields

ALTER TABLE `tbl_burialservice` ADD FULLTEXT(
  `burial_id`
  , `location`
  , `deceased_name`
  , `relationship`
  , `status`
);

-- Optional: Add FULLTEXT index to tbl_members for pastor and member name searching
ALTER TABLE `tbl_members` ADD FULLTEXT(`firstname`, `lastname`, `middle_name`);

-- Note: Ensure the FULLTEXT indexes are properly populated with data
-- For MyISAM engine, you may need to run: REPAIR TABLE tbl_burialservice;
-- For InnoDB (default in modern MySQL), FULLTEXT indexes are maintained automatically

-- Verification query to check if FULLTEXT indexes exist
-- SELECT INDEX_NAME, COLUMN_NAME, INDEX_TYPE
-- FROM INFORMATION_SCHEMA.STATISTICS
-- WHERE TABLE_SCHEMA = DATABASE()
-- AND TABLE_NAME = 'tbl_burialservice'
-- AND INDEX_TYPE = 'FULLTEXT';