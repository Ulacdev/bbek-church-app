-- Insert CMS page for Department Categories (Our Departments section on homepage)
-- This allows the "Our Departments" section to be editable via CMS

INSERT INTO
  tbl_cms_pages (page_name, page_title, content, date_created, status)
VALUES
  (
    'departmentcategories'
    , 'Our Departments'
    , '{"sectionTitle": "Our Departments", "sectionSubtitle": "Discover our various ministries designed to help you grow in faith and serve our community.", "adultTitle": "Adult Ministry", "adultDescription": "Join our adult fellowship for spiritual growth and community building.", "adultLinkText": "Learn More", "ladiesTitle": "Ladies Ministry", "ladiesDescription": "Empowering women through faith, fellowship, and service.", "ladiesLinkText": "Learn More", "youthTitle": "Youth Ministry", "youthDescription": "Building the next generation of leaders through Christ-centered activities.", "youthLinkText": "Learn More", "buttonColor": "#14b8a6"}'
    , NOW()
    , 'active'
  );

-- Verify insertion
SELECT
  *
FROM
  tbl_cms_pages
WHERE
  page_name = 'departmentcategories';