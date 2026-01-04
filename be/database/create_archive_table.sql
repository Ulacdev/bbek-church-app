-- Create tbl_archives table for storing archived/deleted records
-- Instead of permanently deleting records, they are moved to this archive table
-- Records can be restored back to their original tables

CREATE TABLE IF NOT EXISTS `tbl_archives` (
  `archive_id` INT NOT NULL AUTO_INCREMENT,
  `original_table` VARCHAR(100) NOT NULL COMMENT 'Name of the original table (e.g., tbl_members, tbl_accounts, tbl_departments)',
  `original_id` VARCHAR(45) NOT NULL COMMENT 'The ID of the record in the original table',
  `archived_data` JSON NOT NULL COMMENT 'Complete JSON data of the archived record',
  `archived_by` VARCHAR(45) NULL COMMENT 'User ID who archived the record',
  `archived_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the record was archived',
  `restored` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Whether the record has been restored (0 = not restored, 1 = restored)',
  `restored_at` DATETIME NULL COMMENT 'Timestamp when the record was restored',
  `restored_by` VARCHAR(45) NULL COMMENT 'User ID who restored the record',
  `restore_notes` TEXT NULL COMMENT 'Optional notes about the restoration',
  PRIMARY KEY (`archive_id`),
  INDEX `idx_original_table` (`original_table`),
  INDEX `idx_original_id` (`original_id`),
  INDEX `idx_archived_by` (`archived_by`),
  INDEX `idx_archived_at` (`archived_at`),
  INDEX `idx_restored` (`restored`),
  INDEX `idx_restored_at` (`restored_at`),
  INDEX `idx_original_table_id` (`original_table`, `original_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Archive table for storing deleted records that can be restored';

