-- Department Categories CMS Table
-- Stores department categories section content for homepage (Adult, Ladies, Youth)

CREATE TABLE
IF
  NOT EXISTS tbl_cms_departmentcategories (
    id INT AUTO_INCREMENT PRIMARY KEY
    , page_name VARCHAR(50) DEFAULT 'departmentcategories' UNIQUE
    , content_json JSON
    , created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    , updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON
    UPDATE
      CURRENT_TIMESTAMP
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

  -- Insert default content for department categories
  INSERT INTO
    tbl_cms_departmentcategories (page_name, content_json)
  VALUES
    (
      'departmentcategories'
      , '{
  "sectionTitle": "Our Departments",
  "sectionSubtitle": "Discover our various ministries designed to help you grow in faith and serve our community.",
  "adultTitle": "Adult Ministry",
  "adultDescription": "Join our adult fellowship for spiritual growth and community building.",
  "adultLinkText": "Learn More",
  "ladiesTitle": "Ladies Ministry",
  "ladiesDescription": "Empowering women through faith, fellowship, and service.",
  "ladiesLinkText": "Learn More",
  "youthTitle": "Youth Ministry",
  "youthDescription": "Building the next generation of leaders through Christ-centered activities.",
  "youthLinkText": "Learn More",
  "buttonColor": "#14b8a6",
  "adultBackgroundImage": null,
  "ladiesBackgroundImage": null,
  "youthBackgroundImage": null
}'
    )
  ON DUPLICATE KEY
  UPDATE
    content_json = VALUES(content_json);