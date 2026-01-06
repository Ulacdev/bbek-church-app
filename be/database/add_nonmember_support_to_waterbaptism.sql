-- Migration script to add non-member support for water baptism
-- This allows non-members to register for water baptism without requiring a member_id

-- Step 1: Make member_id nullable (for non-member registrations)
ALTER TABLE `tbl_waterbaptism` MODIFY COLUMN `member_id` VARCHAR(45) NULL COMMENT 'Nullable for non-member registrations';

-- Step 2: Add personal info columns for non-members
ALTER TABLE `tbl_waterbaptism`
ADD COLUMN
IF
  NOT EXISTS `firstname` VARCHAR(100) NULL AFTER `member_id`
  , ADD COLUMN
  IF
    NOT EXISTS `lastname` VARCHAR(100) NULL AFTER `firstname`
    , ADD COLUMN
    IF
      NOT EXISTS `middle_name` VARCHAR(100) NULL AFTER `lastname`
      , ADD COLUMN
      IF
        NOT EXISTS `email` VARCHAR(100) NULL AFTER `middle_name`
        , ADD COLUMN
        IF
          NOT EXISTS `phone_number` VARCHAR(20) NULL AFTER `email`
          , ADD COLUMN
          IF
            NOT EXISTS `birthdate` DATE NULL AFTER `phone_number`
            , ADD COLUMN
            IF
              NOT EXISTS `age` INT NULL AFTER `birthdate`
              , ADD COLUMN
              IF
                NOT EXISTS `gender` VARCHAR(20) NULL AFTER `age`
                , ADD COLUMN
                IF
                  NOT EXISTS `address` TEXT NULL AFTER `gender`
                  , ADD COLUMN
                  IF
                    NOT EXISTS `civil_status` VARCHAR(20) NULL AFTER `address`;

                    -- Step 3: Add is_member flag to distinguish between member and non-member registrations
                    ALTER TABLE `tbl_waterbaptism`
                    ADD COLUMN
                    IF
                      NOT EXISTS `is_member` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = member, 0 = non-member';

                      -- Step 4: Add FULLTEXT index for new columns
                      ALTER TABLE `tbl_waterbaptism` ADD FULLTEXT(
                        `firstname`
                        , `lastname`
                        , `middle_name`
                        , `email`
                        , `phone_number`
                        , `address`
                      );

                      -- Verification query:
                      -- SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_COMMENT
                      -- FROM INFORMATION_SCHEMA.COLUMNS
                      -- WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tbl_waterbaptism'
                      -- ORDER BY ORDINAL_POSITION;