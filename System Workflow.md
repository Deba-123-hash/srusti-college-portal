# System Workflow
## Srusti Academy of Management and Technology — College Portal

**Version:** 1.0

---

## 1. Authentication Workflow

### 1.1 Login

```
User submits {email, password}
        │
        ▼
POST /api/v1/auth/login
        │
        ├─ Rate limit check (10 req/15min per IP) ──► exceeded → 429
        ├─ Account lockout check (Redis: lockout:{userId}) ──► locked → 423
        │
        ▼
Lookup User by email → bcrypt.compare(password, hash)
        │
        ├─ Fail ──► increment Redis failed-attempt counter
        │            (5th failure → set lockout:{userId}, TTL 30min) → 401
        │
        ▼ Success
Reset failed-attempt counter
Generate JWT access token (RS256, 15m) — role + userId in payload
Generate refresh token (RS256, 7d) → persist in RefreshToken table
Set refresh token as httpOnly + Secure + SameSite=Strict cookie
Write audit log entry ("login")
        │
        ▼
Response: { accessToken, user } — accessToken stored in Zustand memory only
```

### 1.2 Silent Refresh

```
Axios response interceptor catches 401
        │
        ▼
POST /api/v1/auth/refresh (cookie sent automatically)
        │
        ├─ Cookie missing/invalid/expired ──► 401 → clear client state → redirect /login
        │
        ▼ Valid
Verify against RefreshToken table (rotation: old token invalidated, new one issued)
Issue new access token → client retries original request
```

### 1.3 Password Reset via OTP

```
User requests reset (email)
        │
        ▼
POST /api/v1/auth/forgot-password
        │
Generate OTP via crypto.randomInt → hash it → store in Redis: otp:{userId} (TTL 10min, attempts=0)
Send OTP via Nodemailer (SMTP)
        │
        ▼
User submits OTP + new password
        │
        ▼
POST /api/v1/auth/reset-password
        │
        ├─ attempts >= 3 ──► reject, force new OTP request
        ├─ OTP mismatch ──► increment attempts → 401
        ▼ Match
bcrypt.hash(newPassword, 12) → update User
Invalidate all existing RefreshTokens for this user (force re-login everywhere)
Write audit log entry ("password change")
```

### 1.4 Logout

```
POST /api/v1/auth/logout
        │
Delete RefreshToken record + clear cookie
Write audit log entry ("logout")
```

## 2. Public Visitor Workflow

```
Visitor lands on "/"
        │
        ▼
React Query fetches: stats, announcements, upcoming events, recruiters, testimonials
        │
        ▼
Visitor browses /courses → /courses/:slug → /admissions
        │
        ▼
Visitor submits Admissions or Contact inquiry form
        │
        ▼
POST /api/v1/inquiries (Zod-validated, no auth required, still rate-limited)
        │
        ├─ Save to Inquiry table
        └─ Send confirmation email (Nodemailer) + notify admin inbox
        │
        ▼
Admin later sees it under /admin/inquiries → marks as read
```

## 3. Student Portal Workflows

### 3.1 Dashboard Load

```
Student logs in → redirected to /student/dashboard
        │
        ▼
Parallel React Query fetches:
  - GET /api/v1/attendance/me/summary
  - GET /api/v1/results/me/latest
  - GET /api/v1/events?upcoming=true
  - GET /api/v1/notifications/me?unread=true
        │
        ▼
Dashboard renders cards; attendance card shows warning badge if any subject < 75%
```

### 3.2 Event Registration

```
Student opens /events/:id
        │
        ▼
Clicks "Register" (only visible if authenticated + role=STUDENT)
        │
        ▼
POST /api/v1/events/:id/register
        │
        ├─ Already registered? ──► 409 conflict
        ├─ Registration closed/capacity full? ──► 400
        ▼ OK
Create EventRegistration row
Create Notification ("registration confirmed")
```

### 3.3 Placement Application

```
Student views /student/placements → active PlacementDrive list
        │
        ▼
Applies to a drive (eligibility checked against course/CGPA criteria server-side)
        │
        ▼
POST /api/v1/placements/:driveId/apply
        │
        ├─ Not eligible ──► 403 with reason
        ▼ Eligible
Create PlacementApplication (status: APPLIED)
Notify student on later status changes (SHORTLISTED, SELECTED, REJECTED) via Notification + email
```

## 4. Faculty Workflows

### 4.1 Mark Attendance

```
Faculty logs in → /admin/attendance
        │
        ▼
GET /api/v1/subjects/mine → subjects assigned to this faculty only
        │
        ▼
Faculty selects subject + date → GET /api/v1/attendance?subjectId=&date=
        │
        ▼
Faculty marks Present/Absent per student → PUT /api/v1/attendance/bulk
        │
        ├─ Middleware verifies subject belongs to this faculty (authorize + ownership check)
        │    else ──► 403
        ▼ OK
Upsert AttendanceRecord rows
Write audit log entry ("attendance marked", subjectId, date)
```

### 4.2 Upload Results

```
Faculty logs in → /admin/results
        │
        ▼
Option A: Manual entry per student
Option B: CSV upload (studentId, marks columns)
        │
        ▼
POST /api/v1/results (manual) or POST /api/v1/results/bulk-csv
        │
        ├─ Ownership check: subject must belong to this faculty
        ├─ Zod-validated rows; malformed rows rejected with row-level error details
        ▼ OK
Upsert Result rows → compute grade/CGPA contribution
Create Notification for each affected student ("result published")
Write audit log entry ("result publish")
```

## 5. Admin Workflows

### 5.1 Department-Scoped Data Access (DEPT_ADMIN)

```
DEPT_ADMIN requests GET /api/v1/students
        │
        ▼
authorize(['SUPER_ADMIN','DEPT_ADMIN']) middleware passes
        │
        ▼
Service layer injects department filter:
  if role === DEPT_ADMIN → WHERE departmentId = req.user.departmentId
  if role === SUPER_ADMIN → no filter
        │
        ▼
Prisma query executes with scoped filter → response
```

This pattern (role-based automatic query scoping in the service layer, not the controller) is applied consistently across `students`, `faculty`, `attendance`, `results` read endpoints for DEPT_ADMIN.

### 5.2 CRUD Modules (Courses, Events, Placements, Announcements, Gallery)

```
Admin submits create/update/delete via Admin Panel form
        │
        ▼
Zod validation (shared schema) on client (immediate feedback) AND server (source of truth)
        │
        ▼
Controller → Service → Prisma write
        │
        ├─ Gallery/media writes: Multer receives file → file-type MIME check →
        │    strip EXIF → upload to Cloudinary → store returned URL
        │
        ▼
Redis cache invalidation for affected public-read keys (e.g., cache:courses:list)
Write audit log entry for sensitive actions (role change, data export, etc.)
        │
        ▼
React Query cache invalidated on client → UI reflects change
```

## 6. Notification Dispatch Workflow

```
Trigger event occurs (result published, event registration, placement status change,
announcement pinned, inquiry response)
        │
        ▼
Service layer creates Notification row(s) for relevant User(s)
        │
        ├─ In-app: fetched by client via GET /api/v1/notifications/me (polled or on-focus)
        └─ Email (select triggers only): Nodemailer sends transactional email
```

## 7. Error Handling Flow (all requests)

```
Request enters pipeline
        │
        ▼
helmet → CORS → rate-limit → morgan/winston → body parse
        │
        ▼
authenticate (if protected route) → authorize(roles) → validate(schema)
        │
        ▼
Controller → Service → Repository (Prisma)
        │
        ├─ Thrown AppError / Prisma error / Zod error
        │        │
        │        ▼
        │  Centralized error-handling middleware
        │        │
        │        ▼
        │  Normalize → { success:false, error:{ code, message, details } }
        │        │
        │        ▼
        │  Winston logs error with request context
        ▼
Response sent to client with appropriate HTTP status
```

## 8. Deployment / Release Workflow

```
Build Application Packages (npm run build)
        │
        ▼
Run Database Migrations (`npx prisma migrate deploy`) on Host PostgreSQL
        │
        ▼
Ensure Services Running: PostgreSQL 15, Redis, Node.js API (node dist/server.js)
        │
        ▼
Configure Nginx Reverse Proxy on Host:
  /            → static client build (SPA fallback to index.html)
  /api/v1/*    → Node.js API upstream (http://127.0.0.1:5000)
        │
        ▼
Smoke test: GET /api/v1/health, load "/" in browser
```
