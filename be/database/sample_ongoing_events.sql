-- Fix events table to allow NULL image
ALTER TABLE `tbl_events` MODIFY COLUMN `image` LONGBLOB NULL;

-- Sample Ongoing Events for BBEK Church
-- Status: ongoing (events currently happening)

INSERT INTO
  `tbl_events`(
    `event_id`
    , `title`
    , `description`
    , `start_date`
    , `end_date`
    , `location`
    , `link`
    , `type`
    , `status`
    , `date_created`
    , `image`
    , `joined_members`
  )
VALUES
  (
    NULL
    , 'Sunday Worship Service'
    , 'Join us every Sunday for worship, preaching, and fellowship. Experience the presence of God in a vibrant community of believers.'
    , '2025-01-05 08:00:00'
    , '2025-01-05 11:00:00'
    , 'Main Sanctuary'
    , 'https://zoom.us/j/123456789'
    , 'Worship'
    , 'ongoing'
    , '2025-01-01 00:00:00'
    , NULL
    , '[]'
  );

INSERT INTO
  `tbl_events`(
    `event_id`
    , `title`
    , `description`
    , `start_date`
    , `end_date`
    , `location`
    , `link`
    , `type`
    , `status`
    , `date_created`
    , `image`
    , `joined_members`
  )
VALUES
  (
    NULL
    , 'Wednesday Bible Study'
    , 'Deep dive into the Word of God every Wednesday evening. Grow in your understanding of Scripture and its application to daily life.'
    , '2025-01-08 18:00:00'
    , '2025-01-08 20:00:00'
    , 'Fellowship Hall'
    , 'https://zoom.us/j/987654321'
    , 'Bible Study'
    , 'ongoing'
    , '2025-01-01 00:00:00'
    , NULL
    , '[]'
  );

INSERT INTO
  `tbl_events`(
    `event_id`
    , `title`
    , `description`
    , `start_date`
    , `end_date`
    , `location`
    , `link`
    , `type`
    , `status`
    , `date_created`
    , `image`
    , `joined_members`
  )
VALUES
  (
    NULL
    , 'Youth Fellowship'
    , 'A time of fun, friendship, and faith for young people ages 13-25. Games, worship, and relevant teachings for the youth.'
    , '2025-01-10 19:00:00'
    , '2025-01-10 21:30:00'
    , 'Youth Center'
    , 'https://zoom.us/j/456789123'
    , 'Youth'
    , 'ongoing'
    , '2025-01-01 00:00:00'
    , NULL
    , '[]'
  );

INSERT INTO
  `tbl_events`(
    `event_id`
    , `title`
    , `description`
    , `start_date`
    , `end_date`
    , `location`
    , `link`
    , `type`
    , `status`
    , `date_created`
    , `image`
    , `joined_members`
  )
VALUES
  (
    NULL
    , 'Prayer Meeting'
    , 'Come and intercede for our church, community, and nation. Experience the power of corporate prayer.'
    , '2025-01-12 17:00:00'
    , '2025-01-12 18:30:00'
    , 'Prayer Room'
    , NULL
    , 'Prayer'
    , 'ongoing'
    , '2025-01-01 00:00:00'
    , NULL
    , '[]'
  );