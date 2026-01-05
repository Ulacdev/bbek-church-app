# Burial Service FULLTEXT Search Implementation

## Overview

Enhanced burial service backend with FULLTEXT search capabilities for improved performance and relevance-based searching. This implementation provides both backward compatibility with LIKE searches and advanced FULLTEXT search functionality.

## Database Setup

### 1. FULLTEXT Index Creation

Run the SQL script to add FULLTEXT indexes:

```sql
-- Execute this in your database
ALTER TABLE `tbl_burialservice`
ADD FULLTEXT(`burial_id`, `location`, `deceased_name`, `relationship`, `status`);

ALTER TABLE `tbl_members`
ADD FULLTEXT(`firstname`, `lastname`, `middle_name`);
```

**File Location**: `be/database/add_fulltext_to_burial_service.sql`

## Backend Implementation

### 1. Enhanced Service Functions

#### `getAllBurialServices(options)`

- **Enhanced with FULLTEXT support**
- Automatically uses FULLTEXT search when `useFulltext: true` (default)
- Falls back to LIKE search for compatibility
- Includes pastor information in all queries
- New sorting options: Pastor Name, Location, Relevance

#### `searchBurialServicesFulltext(options)`

- **NEW**: Dedicated FULLTEXT search function
- Returns relevance scores for each result
- Configurable minimum relevance threshold
- Optimized for complex search queries

### 2. New API Endpoints

#### Standard Search (Enhanced)

```
GET/POST /api/church-records/burial-services/getAllBurialServices
```

**Enhanced Parameters**:

- `search` - Search term
- `useFulltext` - boolean (default: true) - Enable FULLTEXT search
- `status` - Filter by status
- `sortBy` - Enhanced sorting options:
  - "Burial ID (A-Z/Z-A)"
  - "Service Date (Newest/Oldest)"
  - "Pastor Name (A-Z/Z-A)" ← NEW
  - "Location (A-Z/Z-A)" ← NEW
  - "Relevance" ← NEW (only with FULLTEXT)

#### FULLTEXT Search (Advanced)

```
GET/POST /api/church-records/burial-services/searchFulltext
```

**Parameters**:

- `search` (required) - Search term
- `limit` (default: 50) - Results limit
- `offset` (default: 0) - Pagination offset
- `minRelevance` (default: 0) - Minimum relevance score

### 3. Enhanced Data Structure

#### Standard Search Response

```json
{
  "success": true,
  "data": [
    {
      "burial_id": "0000000001",
      "member_id": "123",
      "fullname": "Juan Dela Cruz", // Member full name
      "deceased_name": "Pedro Dela Cruz",
      "relationship": "Son",
      "location": "Manila Memorial Park", // Searchable with FULLTEXT
      "pastor_id": "456",
      "pastor_fullname": "Rev. Maria Santos", // NEW: Pastor name
      "service_date": "2026-01-10 10:00:00",
      "status": "pending",
      "date_created": "2026-01-05 12:00:00"
    }
  ],
  "totalCount": 25,
  "summaryStats": {
    /* ... */
  },
  "pagination": {
    /* ... */
  }
}
```

#### FULLTEXT Search Response

```json
{
  "success": true,
  "data": [
    {
      "burial_id": "0000000001",
      "fullname": "Juan Dela Cruz",
      "pastor_fullname": "Rev. Maria Santos",
      "location": "Manila Memorial Park",
      "burial_relevance": 2.5, // NEW: Burial data relevance
      "member_relevance": 1.8, // NEW: Member name relevance
      "pastor_relevance": 0.0, // NEW: Pastor name relevance
      "total_relevance": 4.3 // NEW: Combined relevance score
    }
  ],
  "count": 10,
  "totalCount": 25,
  "searchTerm": "Manila Memorial",
  "relevanceThreshold": 0
}
```

## Usage Examples

### 1. Standard Search with FULLTEXT

```javascript
// Frontend API call
const response = await fetch(
  "/api/church-records/burial-services/getAllBurialServices",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      search: "Manila Memorial Park",
      useFulltext: true,
      sortBy: "Relevance",
      limit: 20,
    }),
  }
);

const result = await response.json();
console.log("Pastor Name:", result.data[0]?.pastor_fullname);
console.log("Location:", result.data[0]?.location);
```

### 2. Advanced FULLTEXT Search

```javascript
// Advanced search with relevance scoring
const response = await fetch(
  "/api/church-records/burial-services/searchFulltext",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      search: "Rev. Maria Santos burial",
      minRelevance: 1.0,
      limit: 10,
    }),
  }
);

const result = await response.json();
result.data.forEach((item) => {
  console.log(`${item.pastor_fullname} - Relevance: ${item.total_relevance}`);
});
```

### 3. Get Specific Burial Service with Pastor Info

```javascript
const response = await fetch(
  "/api/church-records/burial-services/getBurialServiceById/0000000001"
);
const result = await response.json();

if (result.success) {
  console.log("Pastor Name:", result.data.pastor_fullname);
  console.log("Location:", result.data.location);
  console.log("Service Date:", result.data.service_date);
}
```

## Search Capabilities

### FULLTEXT Search Fields

- **Burial Service**: `burial_id`, `location`, `deceased_name`, `relationship`, `status`
- **Member Names**: `firstname`, `lastname`, `middle_name` (via JOIN)
- **Pastor Names**: `firstname`, `lastname`, `middle_name` (via JOIN)

### Search Features

1. **Natural Language Search**: Intelligent word matching
2. **Relevance Scoring**: Results ranked by relevance
3. **Multi-field Search**: Searches across burial, member, and pastor data
4. **Performance**: Faster than LIKE queries for large datasets
5. **Backward Compatible**: Falls back to LIKE when FULLTEXT unavailable

### Example Search Terms

- `"Manila Memorial"` - Location search
- `"Rev. Maria Santos"` - Pastor name search
- `"Juan Dela Cruz"` - Member name search
- `"pending burial"` - Status and type search
- `"Son relationship"` - Relationship search

## Export Enhancements

### Enhanced Excel Export

The export function now includes:

- Member full name
- Pastor full name
- Pastor ID
- All original fields

```javascript
// Export with enhanced data
const response = await fetch(
  "/api/church-records/burial-services/exportExcel",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      search: "Manila",
      useFulltext: true,
    }),
  }
);

// Download will include pastor names and member names
```

## Migration Notes

### Backward Compatibility

- Existing API calls continue to work
- Default behavior uses FULLTEXT when available
- Falls back to LIKE search if FULLTEXT fails

### Performance Considerations

- FULLTEXT indexes require additional storage
- First search may be slower while indexes load
- Subsequent searches are significantly faster

### Database Requirements

- MySQL 5.7+ or MariaDB 10.0+ for optimal FULLTEXT support
- InnoDB engine recommended (default in modern MySQL)
- Ensure sufficient buffer pool size for FULLTEXT cache

## Testing

### Test FULLTEXT Search

```bash
# Test the SQL directly
SELECT burial_id, location, deceased_name,
       MATCH(burial_id, location, deceased_name, relationship, status)
       AGAINST('Manila Memorial' IN NATURAL LANGUAGE MODE) as relevance
FROM tbl_burialservice
WHERE MATCH(burial_id, location, deceased_name, relationship, status)
      AGAINST('Manila Memorial' IN NATURAL LANGUAGE MODE);
```

### Test API Endpoints

```bash
# Test standard search
curl -X POST http://localhost:3000/api/church-records/burial-services/getAllBurialServices \
  -H "Content-Type: application/json" \
  -d '{"search": "Manila", "useFulltext": true}'

# Test FULLTEXT search
curl -X POST http://localhost:3000/api/church-records/burial-services/searchFulltext \
  -H "Content-Type: application/json" \
  -d '{"search": "Rev. Maria Santos", "minRelevance": 1.0}'
```

## Troubleshooting

### FULLTEXT Not Working

1. Check if indexes were created successfully
2. Verify MySQL version supports FULLTEXT
3. Ensure sufficient data in indexed fields (minimum 3 characters)
4. Check for stopwords 过滤

### Performance Issues

1. Monitor FULLTEXT index size
2. Adjust `ft_min_word_len` if needed
3. Consider relevance threshold tuning
4. Check query execution plan with EXPLAIN

### Fallback Behavior

- If FULLTEXT search fails, automatically falls back to LIKE search
- Check logs for FULLTEXT-specific errors
- Ensure database connection has proper privileges
