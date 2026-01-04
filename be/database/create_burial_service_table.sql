DROP TABLE
IF
  EXISTS `tbl_burialservice`;

  CREATE TABLE `tbl_burialservice` (
    `burial_id` VARCHAR(45) NOT NULL
    , `member_id` VARCHAR(45) NOT NULL
    , `relationship` VARCHAR(45) NOT NULL
    , `location` VARCHAR(100) NULL
    , `pastor_id` VARCHAR(45) NULL
    , `service_date` DATETIME NULL
    , `status` VARCHAR(45) NOT NULL DEFAULT 'pending'
    , `date_created` DATETIME NOT NULL
    , `deceased_name` VARCHAR(100) NULL
    , `deceased_birthdate` DATE NULL
    , `date_death` DATE NULL
    , PRIMARY KEY (`burial_id`)
    , INDEX `fk_burial_service_member_idx` (`member_id` ASC)
    , CONSTRAINT `fk_burial_service_member` FOREIGN KEY (`member_id`) REFERENCES `tbl_members` (`member_id`)
    ON DELETE CASCADE
    ON
    UPDATE
      CASCADE
      , INDEX `fk_burial_service_pastor_idx` (`pastor_id` ASC)
      , CONSTRAINT `fk_burial_service_pastor` FOREIGN KEY (`pastor_id`) REFERENCES `tbl_members` (`member_id`)
    ON DELETE SET NULL
    ON
    UPDATE
      CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;