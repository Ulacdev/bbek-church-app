-- Unify burial service and water baptism tables to use the same structure
-- Target columns: baptism_id, location, pastor_name, member_id, baptism_date, status, date_created, guardian_name, guardian_contact, guardian_relationship

-- First, let's check the current structure of both tables
-- DESCRIBE tbl_burialservice;
-- DESCRIBE tbl_waterbaptism;

-- Update burial service table to match water baptism structure
ALTER TABLE `tbl_burialservice`
-- Change burial_id to baptism_id for consistency
CHANGE COLUMN `burial_id` `baptism_id` VARCHAR(45) NOT NULL
, -- Add missing columns that water baptism has
ADD COLUMN `baptism_date` DATETIME NULL AFTER `location`
, ADD COLUMN `guardian_name` VARCHAR(100) NULL AFTER `status`
, ADD COLUMN `guardian_contact` VARCHAR(20) NULL AFTER `guardian_name`
, ADD COLUMN `guardian_relationship` VARCHAR(50) NULL AFTER `guardian_contact`
, -- Rename pastor_id to pastor_name for consistency (but keep as ID reference)
  CHANGE COLUMN `pastor_id` `pastor_name` VARCHAR(45) NULL
, -- Rename service_date to baptism_date (but we already added baptism_date above, so let's use service_date)
-- We'll keep service_date for burial services but also add baptism_date for unified structure
MODIFY COLUMN `location` VARCHAR(100) NULL
, -- Update index names to match new structure
DROP PRIMARY KEY
, ADD PRIMARY KEY (`baptism_id`);

-- Update water baptism table to ensure it has all required columns
-- Check if these columns exist, if not add them
ALTER TABLE `tbl_waterbaptism`
ADD COLUMN
IF
  NOT EXISTS `location` VARCHAR(100) NULL AFTER `baptism_date`
  , ADD COLUMN
  IF
    NOT EXISTS `pastor_name` VARCHAR(45) NULL AFTER `location`
    , -- Guardian fields should already exist from previous ALTER, but let's ensure they're there
    ADD COLUMN
    IF
      NOT EXISTS `guardian_name` VARCHAR(100) NULL AFTER `status`
      , ADD COLUMN
      IF
        NOT EXISTS `guardian_contact` VARCHAR(20) NULL AFTER `guardian_name`
        , ADD COLUMN
        IF
          NOT EXISTS `guardian_relationship` VARCHAR(50) NULL AFTER `guardian_contact`;

          -- Create FULLTEXT indexes for both tables for enhanced search
          -- Burial service FULLTEXT
          ALTER TABLE `tbl_burialservice` ADD FULLTEXT(
            `baptism_id`
            , `location`
            , `deceased_name`
            , `relationship`
            , `status`
            , `guardian_name`
            , `guardian_contact`
            , `guardian_relationship`
          );

          -- Water baptism FULLTEXT
          ALTER TABLE `tbl_waterbaptism` ADD FULLTEXT(
            `baptism_id`
            , `location`
            , `status`
            , `guardian_name`
            , `guardian_contact`
            , `guardian_relationship`
          );

          -- Member table FULLTEXT for name searching
          ALTER TABLE `tbl_members` ADD FULLTEXT(`firstname`, `lastname`, `middle_name`);

          -- Verification queries
          -- SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS
          -- WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('tbl_burialservice', 'tbl_waterbaptism')
          -- ORDER BY TABLE_NAME, ORDINAL_POSITION;