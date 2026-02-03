# Events Image Processing Flowchart

## Overview

This document describes the complete flow of image processing when creating or updating events in the Church Management System.

```mermaid
flowchart TD
    A[User Selects Image in Frontend] --> B{Image Type?}
    B -->|File Object| C[FileReader converts to Base64]
    B -->|Base64 String| D[Use as-is]
    C --> E[Add to eventPayload.image]
    D --> E
    E --> F[axios.post PUT Request]
    F --> G[Content-Type: application/json]
    G --> H[Backend API receives JSON]
    H --> I[convertImageToBlob function]
    I --> J{Input Type?}
    J -->|null/undefined| K[Return null]
    J -->|Buffer| L[Return Buffer]
    J -->|File with buffer| M[Return file.buffer]
    J -->|Data URL| N[Extract base64 after comma<br/>Return Buffer.from base64]
    J -->|Raw base64| O[Return Buffer.from base64]
    J -->|File path| P[Check if exists<br/>Return fs.readFileSync]
    K --> Q[INSERT/UPDATE tbl_events]
    L --> Q
    M --> Q
    N --> Q
    O --> Q
    P --> Q
    Q --> R[Image stored as BLOB in MySQL]
    R --> S[Success Response]
```

## Component Details

### Frontend Flow

```mermaid
flowchart LR
    subgraph Frontend
    A[EventForm.vue] --> B[eventsRecordsStore.js]
    B --> C[axios API call]
    C --> D[Backend API]
    end
```

### Backend Flow

```mermaid
flowchart LR
    subgraph Backend
    A[eventRoutes.js] --> B[eventRecords.js]
    B --> C[convertImageToBlob]
    C --> D[MySQL Database]
    end
```

## convertImageToBlob Logic

```mermaid
flowchart TD
    START[convertImageToBlob imageInput] --> A{imageInput null/undefined?}
    A -->|Yes| B[Return null]
    A -->|No| C{Is Buffer?}
    C -->|Yes| D[Return Buffer]
    C -->|No| E{Has buffer property?}
    E -->|Yes| F[Return input.buffer]
    E -->|No| G{Is String?}
    G -->|No| H[Return null]
    G -->|Yes| I{Starts with 'data:'?}
    I -->|Yes| J[Extract base64 after comma<br/>Return Buffer.from base64]
    I -->|No| K{Contains comma & data:?}
    K -->|Yes| L[Extract base64 after comma<br/>Return Buffer.from base64]
    K -->|No| M{No spaces/slashes/backslashes?}
    M -->|Yes| N{File exists?}
    M -->|No| O[Treat as raw base64<br/>Return Buffer.from base64]
    N -->|Yes| P[Return fs.readFileSync]
    N -->|No| O
    B --> END[End]
    D --> END
    F --> END
    H --> END
    J --> END
    L --> END
    P --> END
    O --> END
```

## Database Schema

```mermaid
erDiagram
    tbl_events {
        int event_id PK
        varchar title
        varchar description
        datetime start_date
        datetime end_date
        varchar location
        varchar link
        varchar type
        varchar status
        datetime date_created
        blob image
        text joined_members
    }
```

## API Endpoints

| Method | Endpoint                                 | Description           |
| ------ | ---------------------------------------- | --------------------- |
| POST   | `/church-records/events/createEvent`     | Create new event      |
| PUT    | `/church-records/events/updateEvent/:id` | Update existing event |

## Error Handling

```mermaid
flowchart TD
    A[API Error Occurs] --> B{Error Type?}
    B -->|400 Bad Request| C[Return error message to frontend<br/>Show toast notification]
    B -->|500 Server Error| D[Log error details<br/>Return generic error message]
    B -->|Image too large| E[Return 413 Payload Too Large]
```

## Common Issues & Solutions

1. **400 API Error** - Fixed: Typo in variable name (`image64Input` → `imageInput`)
2. **Images not saving** - Fixed: Proper base64 data URL detection
3. **Base64 string with data URL prefix** - Parse correctly by splitting on comma
4. **Raw base64 strings** - Handle without data URL prefix
