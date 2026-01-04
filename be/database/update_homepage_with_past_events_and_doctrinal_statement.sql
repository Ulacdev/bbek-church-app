-- Update homepage CMS content to add Past Events section, Doctrinal Statement, and Our Beliefs button
-- This script updates the tbl_cms_home table with new content fields

UPDATE
  tbl_cms_home
SET content_json = JSON_SET(
  content_json
  , '$.pastEventsTitle'
  , 'Past Events'
  , '$.pastEventsSubtitle'
  , 'Reflect on the memorable moments and spiritual milestones from our church community.'
  , '$.doctrinalStatement'
  , 'We believe that doctrine matters — not because it divides, but because it anchors our faith in truth. While misunderstandings can create division, essential biblical teachings are non-negotiable for us. At the same time, we honor freedom in areas where Scripture allows for diversity. Above all, we strive to grow in love.\n\nIn essentials, unity.\nWe hold tightly to core Christian truths.\n\nIn non-essentials, liberty.\nWe give grace for secondary theological convictions.\n\nIn all things, love.\nEverything we believe and do is rooted in the love of Christ.'
  , '$.beliefsButtonText'
  , 'Our Beliefs'
  , '$.beliefsButtonColor'
  , '#14b8a6'
)
WHERE
  page_name = 'home';

-- If no row exists, insert one
INSERT INTO
  tbl_cms_home (page_name, content_json)
SELECT
  'home'
  , JSON_OBJECT(
    'welcomeText'
    , 'Welcome to Bible Baptist Church of Kwali'
    , 'sundayService'
    , 'Sunday Worship 9:30 AM - 12:00 PM'
    , 'wednesdayService'
    , 'Wednesday Service 7:00 PM - 9:00 PM'
    , 'planVisitButtonText'
    , 'Plan Your Visit'
    , 'planVisitButtonColor'
    , '#14b8a6'
    , 'beOneOfUsButtonText'
    , 'Be One Of Us'
    , 'beOneOfUsButtonColor'
    , '#14b8a6'
    , 'servicesTitle'
    , 'Our Services'
    , 'servicesSubtitle'
    , 'We offer various services to support our community in their spiritual journey.'
    , 'services'
    , JSON_ARRAY(
      JSON_OBJECT(
        'title'
        , 'Water Baptism'
        , 'description'
        , 'A sacred ceremony marking your commitment to Christ.'
        , 'image'
        , ''
      )
      , JSON_OBJECT(
        'title'
        , 'Marriage'
        , 'description'
        , 'Celebrate your union in the presence of God and community.'
        , 'image'
        , ''
      )
      , JSON_OBJECT(
        'title'
        , 'Child Dedication'
        , 'description'
        , 'Dedicate your child to God and commit to raising them in faith.'
        , 'image'
        , ''
      )
      , JSON_OBJECT(
        'title'
        , 'Burial Service'
        , 'description'
        , 'Honor the life of your loved one with a meaningful service.'
        , 'image'
        , ''
      )
    )
    , 'visionTitle'
    , 'We look forward to meeting you'
    , 'visionSubtitle'
    , 'We look forward to welcoming you into our family of faith. Our vision is to be a Christ-centered community that...'
    , 'liveByFaith'
    , 'Live by Faith - Boldly proclaim and position the Gospel in daily life. Trust God\'s promises with unwavering confidence.'
    , 'knownByLove'
    , 'Known by Love - Extend grace without judgment - love God, love people. Serve others sacrificially, going beyond what is expected.'
    , 'visionOfHope'
    , 'A Vision of Hope - Declare Jesus as our \'Blessed Redeemer\' (Colossians 3:12). Keep our eyes fixed on eternity, living with Kingdom perspective.'
    , 'visionBgColor'
    , '#ffffff'
    , 'visionImage'
    , ''
    , 'eventsTitle'
    , 'Upcoming Events'
    , 'eventsSubtitle'
    , 'Join us for exciting upcoming events that bring our community together in faith and fellowship.'
    , 'allEventsButtonText'
    , 'All Events'
    , 'allEventsButtonColor'
    , '#14b8a6'
    , 'pastEventsTitle'
    , 'Past Events'
    , 'pastEventsSubtitle'
    , 'Reflect on the memorable moments and spiritual milestones from our church community.'
    , 'doctrinalStatement'
    , 'We believe that doctrine matters — not because it divides, but because it anchors our faith in truth. While misunderstandings can create division, essential biblical teachings are non-negotiable for us. At the same time, we honor freedom in areas where Scripture allows for diversity. Above all, we strive to grow in love.\n\nIn essentials, unity.\nWe hold tightly to core Christian truths.\n\nIn non-essentials, liberty.\nWe give grace for secondary theological convictions.\n\nIn all things, love.\nEverything we believe and do is rooted in the love of Christ.'
    , 'beliefsButtonText'
    , 'Our Beliefs'
    , 'beliefsButtonColor'
    , '#14b8a6'
  )
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      tbl_cms_home
    WHERE
      page_name = 'home'
  );