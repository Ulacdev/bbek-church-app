-- SQL to add YouTube links to completed sermon events
-- Run this to update existing events with YouTube links for the sermon archive

-- ============================================
-- STEP 1: Find completed sermon events missing links
-- ============================================
-- Run this query first to see which events need links:
-- SELECT event_id, title, start_date, end_date, link FROM tbl_events WHERE status = 'completed' AND type = 'sermon' AND (link IS NULL OR link = '');

-- ============================================
-- STEP 2: Update existing events with YouTube links
-- ============================================
-- Replace the link values with your actual YouTube video/embed URLs
-- YouTube link formats:
--   - Full watch: https://www.youtube.com/watch?v=VIDEO_ID
--   - Embed: https://www.youtube.com/embed/VIDEO_ID
--   - Short: https://youtu.be/VIDEO_ID

-- Example UPDATE statements:
UPDATE
  tbl_events
SET link = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
WHERE
  event_id = 1
  AND status = 'completed';

UPDATE
  tbl_events
SET link = 'https://www.youtube.com/watch?v=EXAMPLE_VIDEO_ID_2'
WHERE
  event_id = 2
  AND status = 'completed';

UPDATE
  tbl_events
SET link = 'https://www.youtube.com/watch?v=EXAMPLE_VIDEO_ID_3'
WHERE
  event_id = 3
  AND status = 'completed';

-- ============================================
-- STEP 3: Add a new completed sermon event with link
-- ============================================
INSERT INTO
  tbl_events (
    title
    , description
    , start_date
    , end_date
    , location
    , link
    , type
    , status
    , date_created
  )
VALUES
  (
    'Sunday Worship Service - February 1, 2026'
    , 'Sunday worship service sermon'
    , '2026-02-01 09:00:00'
    , '2026-02-01 11:00:00'
    , 'Main Sanctuary'
    , 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID'
    , 'sermon'
    , 'completed'
    , NOW()
  );

-- ============================================
-- STEP 4: Bulk update all completed sermons without links
-- ============================================
-- WARNING: This updates ALL completed sermons without links
-- Use a default video or update individually for better control

-- UPDATE tbl_events
-- SET link = 'https://www.youtube.com/watch?v=DEFAULT_VIDEO_ID'
-- WHERE status = 'completed'
--   AND type = 'sermon'
--   AND (link IS NULL OR link = '')
--   AND end_date < NOW();