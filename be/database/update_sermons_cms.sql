-- Update/Insert default CMS data for Sermons page
-- This will set up the initial content for the Live.vue page to be editable via CMS

INSERT INTO
  tbl_cms_sermons (page_name, content_json)
VALUES
  (
    'sermons'
    , '{
  "pageTitle": "Sermons",
  "heroTitle": "LIVE WORSHIP & SERMONS",
  "heroDescription": "Join us for live worship services, powerful sermons, and spiritual encouragement from our community",
  "backgroundColor": "#ffffff",
  "sermonArchiveTitle": "Sermon Archive",
  "sermonArchiveDescription": "Browse through our collection of past sermons and teachings"
}'
  )
ON DUPLICATE KEY
UPDATE
  content_json = VALUES(content_json)
  , updated_at = CURRENT_TIMESTAMP;

-- Note: Hero image should be uploaded via the admin interface
-- The hero image will be stored as BLOB in tbl_cms_images with field_name = 'heroImage'