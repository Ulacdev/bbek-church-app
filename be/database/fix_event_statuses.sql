-- Fix event statuses: Update 'approved' to 'pending', 'cancelled' to 'completed'
-- Run this SQL to update existing events

-- Update events with 'approved' status to 'pending'
UPDATE
  tbl_events
SET status = 'pending'
WHERE
  status = 'approved';

-- Update events with 'cancelled' status to 'completed'
UPDATE
  tbl_events
SET status = 'completed'
WHERE
  status = 'cancelled';

-- Verify the changes
SELECT
  status
  , COUNT(*) as count
FROM
  tbl_events
GROUP BY
  status;