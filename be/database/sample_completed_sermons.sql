-- Sample completed sermon events with YouTube links
-- Run these INSERT statements to populate your sermon archive

-- ============================================
-- Youth Fellowship - February 1, 2026
-- ============================================
INSERT INTO tbl_events (title, description, start_date, end_date, location, link, type, status, date_created)
VALUES (
  'Youth Fellowship - Feb 2026',
  'Youth fellowship gathering and worship',
  '2026-02-01 09:23:00',
  '2026-02-01 12:00:00',
  'Youth Hall',
  'https://www.youtube.com/watch?v=VIDEO_ID_1',
  'sermon',
  'completed',
  '2026-02-01 09:00:00'
);

-- ============================================
-- Sunday Worship Service - January 26, 2026
-- ============================================
INSERT INTO tbl_events (title, description, start_date, end_date, location, link, type, status, date_created)
VALUES (
  'Sunday Worship Service - Jan 26, 2026',
  'Weekly Sunday worship service and sermon',
  '2026-01-26 09:00:00',
  '2026-01-26 11:30:00',
  'Main Sanctuary',
  'https://www.youtube.com/watch?v=VIDEO_ID_2',
  'sermon',
  'completed',
  '2026-01-26 08:00:00'
);

-- ============================================
-- Sunday Worship Service - January 19, 2026
-- ============================================
INSERT INTO tbl_events (title, description, start_date, end_date, location, link, type, status, date_created)
VALUES (
  'Sunday Worship Service - Jan 19, 2026',
  'Weekly Sunday worship service and sermon',
  '2026-01-19 09:00:00',
  '2026-01-19 11:30:00',
  'Main Sanctuary',
  'https://www.youtube.com/watch?v=VIDEO_ID_3',
  'sermon',
  'completed',
  '2026-01-19 08:00:00'
);

-- ============================================
-- Sunday Worship Service - January 12, 2026
-- ============================================
INSERT INTO tbl_events (title, description, start_date, end_date, location, link, type, status, date_created)
VALUES (
  'Sunday Worship Service - Jan 12, 2026',
  'Weekly Sunday worship service and sermon',
  '2026-01-12 09:00:00',
  '2026-01-12 11:30:00',
  'Main Sanctuary',
  'https://www.youtube.com/watch?v=VIDEO_ID_4',
  'sermon',
  'completed',
  '2026-01-12 08:00:00'
);

-- ============================================
-- Sunday Worship Service - January 5, 2026
-- ============================================
INSERT INTO tbl_events (title, description, start_date, end_date, location, link, type, status, date_created)
VALUES (
  'Sunday Worship Service - Jan 5, 2026',
  'Weekly Sunday worship service and sermon',
  '2026-01-05 09:00:00',
  '2026-01-05 11:30:00',
  'Main Sanctuary',
  'https://www.youtube.com/watch?v=VIDEO_ID_5',
  'sermon',
  'completed',
  '2026-01-05 08:00:00'
);

-- ============================================
-- Christmas Service - December 25, 2025
-- ============================================
INSERT INTO tbl_events (title, description, start_date, end_date, location, link, type, status, date_created)
VALUES (
  'Christmas Service 2025',
  'Christmas celebration and worship',
  '2025-12-25 10:00:00',
  '2025-12-25 12:30:00',
  'Main Sanctuary',
  'https://www.youtube.com/watch?v=VIDEO_ID_6',
  'sermon',
  'completed',
  '2025-12-25 09:00:00'
);

-- ============================================
-- Sunday Worship Service - December 21, 2025
-- ============================================
INSERT INTO tbl_events (title, description, start_date, end_date, location, link, type, status, date_created)
VALUES (
  'Sunday Worship Service - Dec 21, 2025',
  'Weekly Sunday worship service and sermon',
  '2025-12-21 09:00:00',
  '2025-12-21 11:30:00',
  'Main Sanctuary',
  'https://www.youtube.com/watch?v=VIDEO_ID_7',
  'sermon',
  'completed',
  '2025-12-21 08:00:00'
);

-- ============================================
-- Sunday Worship Service - December 14, 2025
-- ============================================
INSERT INTO tbl_events (title, description, start_date, end_date, location, link, type, status, date_created)
VALUES (
  'Sunday Worship Service - Dec 14, 2025',
  'Weekly Sunday worship service and sermon',
  '2025-12-14 09:00:00',
  '2025-12-14 11:30:00',
  'Main Sanctuary',
  'https://www.youtube.com/watch?v=VIDEO_ID_8',
  'sermon',
  'completed',
  '2025-12-14 08:00:00'
);

-- ============================================
-- Sunday Worship Service - December 7, 2025
-- ============================================
INSERT INTO tbl_events (title, description, start_date, end_date, location, link, type, status, date_created)
VALUES (
  'Sunday Worship Service - Dec 7, 2025',
  'Weekly Sunday worship service and sermon',
  '2025-12-07 09:00:00',
  '2025-12-07 11:30:00',
  'Main Sanctuary',
  'https://www.youtube.com/watch?v=VIDEO_ID_9',
  'sermon',
  'completed',
  '2025-12-07 08:00:00'
);

-- ============================================
-- Thanksgiving Service - November 27, 2025
-- ============================================
INSERT INTO tbl_events (title, description, start_date, end_date, location, link, type, status, date_created)
VALUES (
  'Thanksgiving Service 2025',
  'Thanksgiving celebration and worship',
  '2025-11-27 10:00:00',
  '2025-11-27 12:30:00',
  'Main Sanctuary',
  'https://www.youtube.com/watch?v=VIDEO_ID_10',
  'sermon',
  'completed',
  '2025-11-27 09:00:00'
);

-- ============================================
-- Instructions:
-- ============================================
-- 1. Replace VIDEO_ID_X with actual YouTube video IDs
-- 2. Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
-- 3. Or use embed format: https://www.youtube.com/embed/VIDEO_ID
-- 4. Run these statements in your database
-- 5. Events will appear in the sermon archive sorted by date (newest first)
