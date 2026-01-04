# CMS (Content Management System) Setup Guide

This CMS system allows you to dynamically manage all landing page content through the database.

## Database Setup

1. Run the SQL file to create all CMS tables:
   ```sql
   source database/create_cms_tables.sql
   ```
   Or execute the SQL file in your MySQL client.

## Table Structure

### Main Tables

Each page has its own table following the pattern: `tbl_cms_{pagename}`

**Available Pages:**

- `tbl_cms_header`
- `tbl_cms_home`
- `tbl_cms_about`
- `tbl_cms_imnew`
- `tbl_cms_services`
- `tbl_cms_events`
- `tbl_cms_pastevents`
- `tbl_cms_give`
- `tbl_cms_footer`
- `tbl_cms_planvisit`
- `tbl_cms_waterbaptism`
- `tbl_cms_burialservice`
- `tbl_cms_sermons`
- `tbl_cms_youngpeople`
- `tbl_cms_adultmen`
- `tbl_cms_adultladies`
- `tbl_cms_learnmoreministry`
- `tbl_cms_learnmoreevents`
- `tbl_cms_acceptjesus`
- `tbl_cms_belief`
- `tbl_cms_churchleader`
- `tbl_cms_departmentofficer`
- `tbl_cms_ourstory`

### Images Table

All images are stored as BLOB in `tbl_cms_images`:

- `image_id` - Primary key
- `page_name` - Which page the image belongs to
- `field_name` - Field identifier (e.g., 'logo', 'heroImage', 'visionImage')
- `image_blob` - The actual image data (LONGBLOB)
- `mime_type` - Image MIME type (e.g., 'image/jpeg', 'image/png')

## API Endpoints

### Get Page Content

```
GET /api/cms/:pageName
```

Returns the page content as JSON.

**Example:**

```javascript
GET / api / cms / home;
```

**Response:**

```json
{
  "success": true,
  "message": "CMS page retrieved successfully",
  "data": {
    "id": 1,
    "page_name": "home",
    "content": {
      "welcomeText": "Welcome to...",
      "sundayService": "Sunday Worship 9:30 AM"
      // ... other content fields
    },
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Save/Update Page Content

```
POST /api/cms/:pageName
PUT /api/cms/:pageName
```

**Request Body:**

```json
{
  "content": {
    "welcomeText": "Welcome to Bible Baptist Church",
    "sundayService": "Sunday Worship 9:30 AM - 12:00 PM",
    "services": [
      {
        "title": "Water Baptism",
        "description": "A sacred ceremony..."
      }
    ]
    // ... other content fields
  }
}
```

### Get Page with All Images

```
GET /api/cms/:pageName/full
```

Returns page content with all images as base64 data URLs.

**Response:**

```json
{
  "success": true,
  "message": "CMS page with images retrieved successfully",
  "data": {
    "page": {
      "id": 1,
      "page_name": "home",
      "content": {
        /* page content */
      }
    },
    "images": {
      "logo": "data:image/jpeg;base64,...",
      "heroImage": "data:image/png;base64,..."
    }
  }
}
```

### Save Image

```
POST /api/cms/:pageName/image/:fieldName
```

**Request Body:**

```json
{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

### Get Image

```
GET /api/cms/:pageName/image/:fieldName
```

Returns image as base64 data URL.

### Get All Images for a Page

```
GET /api/cms/:pageName/images
```

### Delete Image

```
DELETE /api/cms/:pageName/image/:fieldName
```

### Save Page with Images (Batch)

```
POST /api/cms/:pageName/save
```

**Request Body:**

```json
{
  "content": {
    "welcomeText": "Welcome..."
    // ... other content
  },
  "images": {
    "logo": "data:image/jpeg;base64,...",
    "heroImage": "data:image/png;base64,..."
  }
}
```

## Usage Examples

### Frontend Integration

#### Fetching Page Data

```javascript
// Fetch page with images
const response = await fetch("/api/cms/home/full");
const { data } = await response.json();

// Use the data
const pageContent = data.page.content;
const images = data.images; // base64 data URLs
```

#### Saving Page Data

```javascript
// Prepare content (remove image base64 from content, handle separately)
const content = {
  welcomeText: "Welcome to...",
  sundayService: "Sunday Worship 9:30 AM",
  // ... other fields
};

// Prepare images
const images = {
  logo: logoBase64String,
  heroImage: heroImageBase64String,
};

// Save everything
const response = await fetch("/api/cms/home/save", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ content, images }),
});
```

## Page Name Mapping

The page names in the API should match the component names (lowercase, no special characters):

| Component File        | Page Name           | Table Name                  |
| --------------------- | ------------------- | --------------------------- |
| Header.vue            | `header`            | `tbl_cms_header`            |
| Home.vue              | `home`              | `tbl_cms_home`              |
| About.vue             | `about`             | `tbl_cms_about`             |
| ImNew.vue             | `imnew`             | `tbl_cms_imnew`             |
| Services.vue          | `services`          | `tbl_cms_services`          |
| Events.vue            | `events`            | `tbl_cms_events`            |
| PastEvents.vue        | `pastevents`        | `tbl_cms_pastevents`        |
| Give.vue              | `give`              | `tbl_cms_give`              |
| Footer.vue            | `footer`            | `tbl_cms_footer`            |
| PlanVisit.vue         | `planvisit`         | `tbl_cms_planvisit`         |
| WaterBaptism.vue      | `waterbaptism`      | `tbl_cms_waterbaptism`      |
| BurialService.vue     | `burialservice`     | `tbl_cms_burialservice`     |
| Sermons.vue           | `sermons`           | `tbl_cms_sermons`           |
| YoungPeople.vue       | `youngpeople`       | `tbl_cms_youngpeople`       |
| AdultMen.vue          | `adultmen`          | `tbl_cms_adultmen`          |
| AdultLadies.vue       | `adultladies`       | `tbl_cms_adultladies`       |
| LearnMoreMinistry.vue | `learnmoreministry` | `tbl_cms_learnmoreministry` |
| LearnMoreEvents.vue   | `learnmoreevents`   | `tbl_cms_learnmoreevents`   |
| AcceptJesus.vue       | `acceptjesus`       | `tbl_cms_acceptjesus`       |
| Belief.vue            | `belief`            | `tbl_cms_belief`            |
| ChurchLeader.vue      | `churchleader`      | `tbl_cms_churchleader`      |
| DepartmentOfficer.vue | `departmentofficer` | `tbl_cms_departmentofficer` |
| OurStory.vue          | `ourstory`          | `tbl_cms_ourstory`          |

## Notes

1. **Images are stored as BLOB** in the database for efficiency
2. **Content is stored as JSON** for flexibility
3. **Base64 conversion** is handled automatically by the API
4. **All endpoints require authentication** (JWT token) unless configured otherwise
5. **Page names are case-insensitive** and normalized automatically

## Error Handling

All endpoints return a consistent response format:

```json
{
  "success": true/false,
  "message": "Success or error message",
  "data": { /* response data */ },
  "error": "Error message (if success is false)"
}
```
