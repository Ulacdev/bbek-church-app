# Church Management System - Integration Flowchart

This document provides visual flowcharts showing how data flows between the **church-fe** (Frontend) and **church-be** (Backend) applications.

---

## Table of Contents

1. [Overall System Flow](#overall-system-flow)
2. [Authentication Flow](#authentication-flow)
3. [Authenticated Request Flow](#authenticated-request-flow)
4. [CRUD Operations Flow](#crud-operations-flow)
5. [Error Handling Flow](#error-handling-flow)
6. [Public Route Flow](#public-route-flow)
7. [File Upload Flow](#file-upload-flow)

---

## Overall System Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    church-fe (Vue 3)                          │ │
│  │                                                               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │ │
│  │  │   Component  │→ │  Pinia Store │→ │  Axios API   │      │ │
│  │  │   (UI Layer) │  │  (State Mgmt)│  │  (HTTP Client)│      │ │
│  │  └──────────────┘  └──────────────┘  └──────┬───────┘      │ │
│  │                                                │              │ │
│  │  ┌─────────────────────────────────────────────▼───────┐    │ │
│  │  │         Request Interceptor                        │    │ │
│  │  │  - Validates JWT Token                             │    │ │
│  │  │  - Adds Authorization Header                       │    │ │
│  │  │  - Handles FormData                                │    │ │
│  │  └────────────────────────────────────────────────────┘    │ │
│  └───────────────────────────────┬──────────────────────────────┘ │
└──────────────────────────────────┼─────────────────────────────────┘
                                   │
                                   │ HTTP/HTTPS Request
                                   │ Authorization: Bearer <token>
                                   │
┌──────────────────────────────────▼─────────────────────────────────┐
│                    church-be (Express.js)                          │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Step 1: CORS Middleware                                   │  │
│  │  - Validates Origin                                         │  │
│  │  - Sets CORS Headers                                        │  │
│  └───────────────────────┬────────────────────────────────────┘  │
│                          │                                         │
│  ┌───────────────────────▼────────────────────────────────────┐  │
│  │  Step 2: Body Parser Middleware                           │  │
│  │  - Parses JSON (500MB limit)                                │  │
│  │  - Parses URL-encoded data                                  │  │
│  └───────────────────────┬────────────────────────────────────┘  │
│                          │                                         │
│  ┌───────────────────────▼────────────────────────────────────┐  │
│  │  Step 3: Security Headers Middleware                       │  │
│  │  - X-Content-Type-Options                                   │  │
│  │  - X-Frame-Options                                          │  │
│  │  - X-XSS-Protection                                         │  │
│  └───────────────────────┬────────────────────────────────────┘  │
│                          │                                         │
│  ┌───────────────────────▼────────────────────────────────────┐  │
│  │  Step 4: JWT Authentication Middleware                    │  │
│  │  - Checks if route is public                               │  │
│  │  - Validates JWT token (if protected)                       │  │
│  │  - Attaches req.user (decoded token)                       │  │
│  └───────────────────────┬────────────────────────────────────┘  │
│                          │                                         │
│  ┌───────────────────────▼────────────────────────────────────┐  │
│  │  Step 5: Audit Trail Middleware                           │  │
│  │  - Prepares audit logging                                   │  │
│  │  - Extracts entity info from path                           │  │
│  └───────────────────────┬────────────────────────────────────┘  │
│                          │                                         │
│  ┌───────────────────────▼────────────────────────────────────┐  │
│  │  Step 6: Route Handler                                     │  │
│  │  - Extracts request params/body                            │  │
│  │  - Calls DB Helper function                                │  │
│  └───────────────────────┬────────────────────────────────────┘  │
│                          │                                         │
│  ┌───────────────────────▼────────────────────────────────────┐  │
│  │  Step 7: DB Helper                                        │  │
│  │  - Builds SQL query                                        │  │
│  │  - Executes query via connection pool                      │  │
│  └───────────────────────┬────────────────────────────────────┘  │
│                          │                                         │
│  ┌───────────────────────▼────────────────────────────────────┐  │
│  │  Step 8: Database (MySQL)                                  │  │
│  │  - Executes query                                          │  │
│  │  - Returns data                                            │  │
│  └───────────────────────┬────────────────────────────────────┘  │
│                          │                                         │
│  ┌───────────────────────▼────────────────────────────────────┐  │
│  │  Step 9: Response Formatter                                │  │
│  │  - Formats data                                             │  │
│  │  - Returns JSON response                                    │  │
│  └───────────────────────┬────────────────────────────────────┘  │
│                          │                                         │
│  ┌───────────────────────▼────────────────────────────────────┐  │
│  │  Step 10: Audit Trail Logging (Async)                      │  │
│  │  - Logs action to audit_trail table                        │  │
│  │  - Non-blocking                                            │  │
│  └───────────────────────┬────────────────────────────────────┘  │
└──────────────────────────┼────────────────────────────────────────┘
                           │
                           │ HTTP Response
                           │ { success: true, data: {...} }
                           │
┌──────────────────────────▼────────────────────────────────────────┐
│                    church-fe (Vue 3)                                │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │         Response Interceptor                                │  │
│  │  - Handles success responses                                │  │
│  │  - Handles error responses (401, 403, 500, etc.)           │  │
│  │  - Shows error messages                                    │  │
│  └───────────────────────┬────────────────────────────────────┘  │
│                          │                                         │
│  ┌───────────────────────▼────────────────────────────────────┐  │
│  │  Pinia Store Updates                                       │  │
│  │  - Updates state with response data                        │  │
│  │  - Sets loading: false                                     │  │
│  └───────────────────────┬────────────────────────────────────┘  │
│                          │                                         │
│  ┌───────────────────────▼────────────────────────────────────┐  │
│  │  Component Re-renders                                      │  │
│  │  - Displays updated data                                   │  │
│  │  - Shows success/error messages                            │  │
│  └────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    USER LOGIN REQUEST                                │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: LoginDialog.vue                                          │
│  - User enters email/password                                       │
│  - Calls accountsStore.login(email, password)                       │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: accountsStore.js                                         │
│  - axios.post('/api/church-records/accounts/login', {email, pwd})   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: axios.js (Request Interceptor)                           │
│  - Adds Content-Type: application/json                              │
│  - NO Authorization header (login is public)                        │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Development: Vite Proxy                                             │
│  - /api → http://localhost:5000/api                                 │
│  Production: Direct API call to VITE_API_URL                        │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: index.js                                                   │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  CORS Middleware                                              │  │
│  │  - Validates origin (localhost:5173/5174/5175 or FRONTEND_URL)│  │
│  └──────────────────────────────────────────────────────────────┘  │
│                            │                                         │
│  ┌─────────────────────────▼────────────────────────────────────┐  │
│  │  Body Parser                                                 │  │
│  │  - Parses { email, password }                                │  │
│  └─────────────────────────┬────────────────────────────────────┘  │
│                            │                                         │
│  ┌─────────────────────────▼────────────────────────────────────┐  │
│  │  JWT Auth Middleware                                         │  │
│  │  - Checks: /api/church-records/accounts/login                │  │
│  │  - Route is PUBLIC → Skip token validation                   │  │
│  │  - Continue to route handler                                 │  │
│  └─────────────────────────┬────────────────────────────────────┘  │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: routes/church_records/accountRoutes.js                     │
│  - POST /login handler                                               │
│  - Calls accountRecords.verifyCredentials(email, password)          │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: dbHelpers/church_records/accountRecords.js                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  1. Query database: SELECT * FROM tbl_accounts WHERE email=? │  │
│  │  2. Compare password hash (bcrypt.compare)                   │  │
│  │  3. If valid:                                                 │  │
│  │     - Generate JWT token (jwt.sign)                          │  │
│  │     - Get member info (JOIN with tbl_members)                 │  │
│  │     - Return { token, account, member }                      │  │
│  │  4. If invalid: Return error                                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: Response                                                   │
│  {                                                                   │
│    success: true,                                                    │
│    data: {                                                           │
│      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",             │
│      account: { acc_id, email, position, ... },                      │
│      member: { member_id, firstname, lastname, ... }               │
│    }                                                                 │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: axios.js (Response Interceptor)                           │
│  - Receives response                                                 │
│  - Returns response.data                                             │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: accountsStore.js                                          │
│  - Stores token in localStorage.setItem('accessToken', token)       │
│  - Stores userInfo in localStorage.setItem('userInfo', JSON.stringify)│
│  - Updates Pinia store state                                        │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: Router Navigation                                         │
│  - Redirects to /admin (Admin Dashboard)                             │
│  - Route guard validates admin/staff position                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Authenticated Request Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  USER ACTION: Fetch Members List                                     │
│  (Component: MemberRecord.vue)                                      │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: memberRecordStore.js                                      │
│  - fetchMembers({ page: 1, pageSize: 20 })                          │
│  - Sets loading: true                                                │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: axios.get('/api/church-records/members/getAllMembers?...) │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: axios.js (Request Interceptor)                            │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  1. Check token validity (checkAccessTokenValidity)          │  │
│  │     - If invalid/expired: Clear token, return error          │  │
│  │  2. Get token from localStorage                                │  │
│  │  3. Add Authorization header:                                  │  │
│  │     Authorization: Bearer <token>                              │  │
│  │  4. Add Content-Type: application/json                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  HTTP Request                                                        │
│  GET /api/church-records/members/getAllMembers?page=1&pageSize=20   │
│  Headers:                                                            │
│    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...    │
│    Content-Type: application/json                                   │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: index.js - Middleware Chain                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  1. CORS Middleware                                           │  │
│  │     - Validates origin                                        │  │
│  │     - Sets CORS headers                                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                            │                                         │
│  ┌─────────────────────────▼────────────────────────────────────┐  │
│  │  2. Body Parser                                              │  │
│  │     - No body for GET request                                │  │
│  └─────────────────────────┬────────────────────────────────────┘  │
│                            │                                         │
│  ┌─────────────────────────▼────────────────────────────────────┐  │
│  │  3. Security Headers                                         │  │
│  │     - Sets security headers                                   │  │
│  └─────────────────────────┬────────────────────────────────────┘  │
│                            │                                         │
│  ┌─────────────────────────▼────────────────────────────────────┐  │
│  │  4. JWT Authentication Middleware                             │  │
│  │     - Checks: Is route public?                                │  │
│  │     - Route: /api/church-records/members/getAllMembers        │  │
│  │     - NOT in publicRoutes → Requires authentication           │  │
│  │     - Extracts token from Authorization header                │  │
│  │     - Verifies token: jwt.verify(token, JWT_SECRET)          │  │
│  │     - If valid: Attaches req.user = { acc_id, email, position }│  │
│  │     - If invalid: Returns 401 Unauthorized                   │  │
│  └─────────────────────────┬────────────────────────────────────┘  │
│                            │                                         │
│  ┌─────────────────────────▼────────────────────────────────────┐  │
│  │  5. Audit Trail Middleware                                     │  │
│  │     - Prepares audit logging                                   │  │
│  │     - Extracts entity_type: 'member'                           │  │
│  │     - Extracts action_type: 'VIEW_LIST'                         │  │
│  └─────────────────────────┬────────────────────────────────────┘  │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: routes/church_records/memberRoutes.js                      │
│  - GET /getAllMembers handler                                        │
│  - Extracts query params: page, pageSize, filters                    │
│  - Calls memberRecords.getAllMembers(options)                        │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: dbHelpers/church_records/memberRecords.js                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  1. Build SQL query with pagination                            │  │
│  │     SELECT * FROM tbl_members                                 │  │
│  │     WHERE active = 1                                           │  │
│  │     ORDER BY ...                                               │  │
│  │     LIMIT ? OFFSET ?                                           │  │
│  │                                                                │  │
│  │  2. Execute query via database/db.js                           │  │
│  │     - Uses connection pool                                     │  │
│  │     - Parameterized queries (prevents SQL injection)           │  │
│  │                                                                │  │
│  │  3. Get total count for pagination                             │  │
│  │                                                                │  │
│  │  4. Format response data                                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: Database (MySQL)                                           │
│  - Executes SELECT query                                             │
│  - Returns member records array                                      │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: Response Formatter                                         │
│  {                                                                   │
│    success: true,                                                    │
│    data: [                                                           │
│      { member_id: 1, firstname: "John", ... },                     │
│      { member_id: 2, firstname: "Jane", ... },                      │
│      ...                                                             │
│    ],                                                                │
│    pagination: {                                                     │
│      page: 1,                                                        │
│      pageSize: 20,                                                   │
│      total: 150,                                                     │
│      totalPages: 8                                                   │
│    }                                                                 │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: Audit Trail Middleware (Async, Non-blocking)              │
│  - Logs action to tbl_audit_trail                                   │
│  - action_type: 'VIEW_LIST'                                         │
│  - entity_type: 'member'                                            │
│  - user_id: req.user.acc_id                                         │
│  - status: 'success'                                                │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: axios.js (Response Interceptor)                         │
│  - Receives response                                                │
│  - Status 200 → Returns response                                    │
│  - No error → No error message shown                                │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: memberRecordStore.js                                     │
│  - Updates state:                                                    │
│    * members = response.data.data                                   │
│    * totalPages = response.data.pagination.totalPages              │
│    * totalCount = response.data.pagination.total                   │
│    * loading = false                                                │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: Component Re-renders                                     │
│  - MemberRecord.vue displays members in table                       │
│  - Shows pagination controls                                         │
│  - Loading indicator hidden                                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## CRUD Operations Flow

### CREATE Operation (Example: Create Member)

```
┌─────────────────────────────────────────────────────────────────────┐
│  USER ACTION: Create New Member                                      │
│  (Component: CreateMemberDialog.vue)                                 │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: memberRecordStore.js                                      │
│  - createMember(memberData)                                          │
│  - memberData = { firstname, lastname, email, ... }                  │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: axios.post('/api/church-records/members/createMember',    │
│                       memberData)                                    │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: Middleware Chain                                           │
│  - CORS → Body Parser → Security → Auth → Audit Trail               │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: routes/church_records/memberRoutes.js                      │
│  - POST /createMember handler                                        │
│  - Calls memberRecords.createMember(memberData, req.user.acc_id)    │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: dbHelpers/church_records/memberRecords.js                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  1. Validate member data                                       │  │
│  │  2. Build INSERT query:                                        │  │
│  │     INSERT INTO tbl_members (firstname, lastname, ...)        │  │
│  │     VALUES (?, ?, ...)                                         │  │
│  │  3. Execute query                                             │  │
│  │  4. Get inserted member_id                                     │  │
│  │  5. Return created member data                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: Response                                                   │
│  { success: true, data: { member_id: 123, ... }, status: 201 }      │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: Audit Trail (Async)                                        │
│  - Logs: CREATE action, entity_type: 'member', entity_id: 123       │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: memberRecordStore.js                                      │
│  - Refetches members list (fetchMembers())                          │
│  - Shows success message                                             │
└─────────────────────────────────────────────────────────────────────┘
```

### UPDATE Operation (Example: Update Member)

```
┌─────────────────────────────────────────────────────────────────────┐
│  USER ACTION: Update Member                                          │
│  (Component: EditMemberDialog.vue)                                   │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: memberRecordStore.js                                      │
│  - updateMember(memberId, updatedData)                              │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: axios.put('/api/church-records/members/updateMember/123',│
│                      updatedData)                                   │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: routes/church_records/memberRoutes.js                      │
│  - PUT /updateMember/:id handler                                     │
│  - Calls memberRecords.updateMember(id, updatedData)                │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: dbHelpers/church_records/memberRecords.js                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  1. Get old values (for audit trail)                           │  │
│  │  2. Build UPDATE query:                                        │  │
│  │     UPDATE tbl_members                                         │  │
│  │     SET firstname=?, lastname=?, ...                           │  │
│  │     WHERE member_id=?                                          │  │
│  │  3. Execute query                                             │  │
│  │  4. Return updated member data                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: Audit Trail (Async)                                        │
│  - Logs: UPDATE action, entity_id: 123                              │
│  - Includes old_values and new_values                               │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: Refetches data and updates UI                             │
└─────────────────────────────────────────────────────────────────────┘
```

### DELETE Operation (Example: Delete Member)

```
┌─────────────────────────────────────────────────────────────────────┐
│  USER ACTION: Delete Member                                          │
│  (Component: MemberRecord.vue - Delete button)                      │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: memberRecordStore.js                                      │
│  - deleteMember(memberId)                                           │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: axios.delete('/api/church-records/members/deleteMember/123')│
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: routes/church_records/memberRoutes.js                      │
│  - DELETE /deleteMember/:id handler                                 │
│  - Calls memberRecords.deleteMember(id, req.user.acc_id)            │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: dbHelpers/church_records/memberRecords.js                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  1. Soft delete: UPDATE tbl_members SET active=0             │  │
│  │     OR                                                         │  │
│  │     Hard delete: DELETE FROM tbl_members WHERE member_id=?    │  │
│  │  2. Execute query                                            │  │
│  │  3. Return success                                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: Audit Trail (Async)                                        │
│  - Logs: DELETE action, entity_id: 123                              │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: Refetches data and updates UI                             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  REQUEST WITH ERROR                                                  │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: Error Occurs                                               │
│  (Database error, validation error, etc.)                            │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: Error Handler Middleware (index.js)                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Error Type Detection:                                         │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  CORS Error                                            │  │  │
│  │  │  → Status: 403                                        │  │  │
│  │  │  → Message: "Origin not allowed"                      │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  JWT Error (TokenExpiredError, JsonWebTokenError)      │  │  │
│  │  │  → Status: 401                                         │  │  │
│  │  │  → Message: "Invalid or expired token"                │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  Payload Too Large (413)                                │  │  │
│  │  │  → Status: 413                                         │  │  │
│  │  │  → Message: "Payload too large. Maximum size is 500MB"  │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  Database Max Connections Error                        │  │  │
│  │  │  → Status: 503                                        │  │  │
│  │  │  → Message: "Database connection limit reached"         │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  Generic Error                                         │  │  │
│  │  │  → Status: 500 (or err.status)                        │  │  │
│  │  │  → Message: Detailed in dev, sanitized in production  │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: Error Response                                             │
│  {                                                                   │
│    success: false,                                                   │
│    error: "Error type",                                              │
│    message: "Human-readable error message",                          │
│    errors: ["Array of specific errors (optional)"]                   │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: axios.js (Response Interceptor)                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Error Handling Logic:                                        │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  401 Unauthorized                                       │  │  │
│  │  │  - Clear tokens from localStorage                       │  │  │
│  │  │  - Show error message (ElMessage.error)                 │  │  │
│  │  │  - Redirect to landing page (if not public route)       │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  400 Bad Request                                         │  │  │
│  │  │  - Show error message from response.data.message         │  │  │
│  │  │  - Or show errors array if available                     │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  403 Forbidden                                           │  │  │
│  │  │  - Show "Access Forbidden" message                      │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  500/502/503 Server Errors                              │  │  │
│  │  │  - Show generic error message                         │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  Network Error (ECONNREFUSED)                          │  │  │
│  │  │  - Show "Cannot connect to backend server"             │  │  │
│  │  │  - Suggest: "Make sure backend is running on port 5000"│  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: Pinia Store                                               │
│  - Sets error state                                                  │
│  - Sets loading: false                                               │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: Component                                                 │
│  - Displays error message to user                                    │
│  - Shows error state in UI                                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Public Route Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  PUBLIC REQUEST: Get Active Announcements                            │
│  (No authentication required)                                        │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: announcementStore.js                                      │
│  - fetchActiveAnnouncementsForUser()                                 │
│  - NO Authorization header (optional)                                │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: axios.get('/api/announcements/getActiveAnnouncementsForUser')│
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: JWT Authentication Middleware                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  - Checks: /api/announcements/getActiveAnnouncementsForUser   │  │
│  │  - Route IS in publicRoutes array → Skip token validation    │  │
│  │  - Continue to route handler (req.user may be null)          │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: routes/announcementRoutes.js                                │
│  - GET /getActiveAnnouncementsForUser handler                        │
│  - userId = req.user?.acc_id || null                                │
│  - userPosition = req.user?.position || 'non_member'                 │
│  - Calls announcementRecords.getActiveAnnouncementsForUser(...)       │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: dbHelpers/announcementRecords.js                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  - Queries announcements based on:                             │  │
│  │    * is_active = 1                                             │  │
│  │    * target_audience includes user position or 'all'          │  │
│  │    * start_date <= now <= end_date                            │  │
│  │    * User hasn't viewed (if authenticated)                     │  │
│  │  - Returns filtered announcements                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: Response                                                   │
│  {                                                                   │
│    success: true,                                                    │
│    data: [                                                           │
│      { announcement_id: 1, title: "...", ... },                     │
│      { announcement_id: 2, title: "...", ... }                      │
│    ]                                                                 │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: Displays announcements to user                            │
│  - Works for both authenticated and non-authenticated users         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## File Upload Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  USER ACTION: Upload Image (CMS Content Management)                  │
│  (Component: ContentManagementPage.vue)                             │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: cmsStore.js                                               │
│  - updateCmsSection(sectionData)                                    │
│  - sectionData contains base64-encoded images/videos                 │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: axios.post('/api/cms/home', sectionData)                 │
│  - Payload can be up to 500MB (large images/videos)                 │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: axios.js (Request Interceptor)                            │
│  - Adds Authorization header                                        │
│  - If FormData: Removes Content-Type (browser sets with boundary)   │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: index.js - Body Parser                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  - Standard routes: 500MB limit                               │  │
│  │  - CMS routes: Additional 500MB limit (app.use('/api/cms', ...))│  │
│  │  - Parses JSON body with base64 images                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: routes/cmsRoutes.js                                       │
│  - POST /home handler                                                │
│  - Receives sectionData with base64 images                           │
│  - Calls cmsRecords.updateCmsSection(...)                            │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: dbHelpers/cmsRecords.js                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  1. Decode base64 images to binary                            │  │
│  │  2. Optionally save to file system (uploads/)                  │  │
│  │  3. Store image paths or base64 in database                   │  │
│  │  4. UPDATE tbl_cms_home SET ...                                │  │
│  │  5. Return updated section data                                │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Backend: Response                                                   │
│  { success: true, data: { section: {...} } }                        │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: Updates CMS content display                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Summary

### Key Integration Points

1. **HTTP Communication**
   - Frontend uses Axios with base URL `/api` (proxied in dev, direct in prod)
   - Backend listens on port 5000 (default) or `PORT` env var
   - All API routes prefixed with `/api`

2. **Authentication**
   - JWT tokens stored in `localStorage` as `accessToken`
   - Token added to `Authorization: Bearer <token>` header
   - Backend validates token on protected routes
   - Public routes defined in `authMiddleware.js`

3. **Request Flow**
   - Frontend Component → Pinia Store → Axios → Backend
   - Backend: CORS → Body Parser → Security → Auth → Audit → Route → DB Helper → Database

4. **Response Flow**
   - Database → DB Helper → Route Handler → Response → Frontend Axios → Pinia Store → Component

5. **Error Handling**
   - Backend returns standardized error format
   - Frontend interceptor handles errors and shows user-friendly messages
   - Network errors handled gracefully

6. **State Management**
   - Pinia stores manage domain-specific state
   - Stores handle API calls and state updates
   - Components reactively update when store state changes

---

## Notes

- **Development**: Frontend proxies `/api` to `http://localhost:5000` via Vite
- **Production**: Frontend uses `VITE_API_URL` environment variable
- **CORS**: Backend validates origins based on environment (dev vs prod)
- **Audit Trail**: All authenticated actions are logged asynchronously
- **File Uploads**: Supports up to 500MB payloads for CMS content
- **Token Validation**: Tokens are validated before each request in frontend
- **Route Protection**: Admin routes require `admin` or `staff` position

---

**Last Updated**: Based on current codebase structure

