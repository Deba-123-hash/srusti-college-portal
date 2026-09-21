# Product Requirement Document (PRD)
## Srusti Academy of Management and Technology — College Portal Web Application

**Version:** 1.0
**Owner:** Deba
**Date:** September 2026

---

## 1. Purpose

Build a production-ready College Portal for Srusti Academy of Management and Technology (SAMT) that serves three audiences from a single monorepo application:

1. **Prospective students / public visitors** — a marketing and information website.
2. **Enrolled students** — a self-service portal for attendance, results, placements, events.
3. **Faculty and administrative staff** — a management panel to run day-to-day academic operations.

## 2. Background

- **Institution:** Srusti Academy of Management and Technology
- **Address:** 38/1, Chandaka Industrial Estate, Near Infocity, Patia, Bhubaneswar, Odisha 751024
- **Courses offered:** MCA, BCA, MBA, BBA, B.Com

The college currently has no unified digital system connecting its public website, student records, and administrative workflows. This project consolidates all three into one full-stack application.

## 3. Goals

| Goal | Success Criterion |
|---|---|
| Public-facing site that markets the college | All 8 public pages live, mobile responsive, SEO-friendly |
| Self-service student portal | Students can view attendance, results, register for events/placements without staff involvement |
| Role-based admin/faculty panel | Faculty can mark attendance/results for own subjects only; admins manage full college data |
| Secure by default | JWT RS256 auth, hashed passwords, rate limiting, audit logs |
| Straightforward local execution | Direct execution on host OS with Node.js, PostgreSQL, Redis, and Nginx |

## 4. Non-Goals

- No timetable/scheduling module (explicitly excluded).
- No payment gateway integration for fee payment (fee structure is displayed, not collected online).
- No mobile app (web-responsive only).
- No multi-college/tenant support — single institution only.

## 5. User Roles & Personas

| Role | Description | Key Needs |
|---|---|---|
| **SUPER_ADMIN** | College IT/management head | Full CRUD across all modules, user/role management, audit visibility |
| **DEPT_ADMIN** | Head of a department (MCA, BCA, etc.) | Manage own department's students, faculty, results, courses |
| **FACULTY** | Teaching staff | Mark attendance and upload results only for subjects they teach |
| **STUDENT** | Enrolled learner | View own attendance/results, register for events and placement drives |
| **Visitor** (unauthenticated) | Prospective student, parent, recruiter | Browse courses, admissions info, placements, gallery; submit inquiries |

## 6. Functional Requirements

### 6.1 Public Website (no login)

| Page | Requirement |
|---|---|
| Home (`/`) | Hero banner, key stats (year founded, courses, students, placement %), announcements, upcoming events, recruiter carousel, testimonials |
| About (`/about`) | History, mission/vision, management team (photos), infrastructure, NAAC/affiliation |
| Courses (`/courses`, `/courses/:slug`) | List all 5 courses; detail page with duration, eligibility, fee, syllabus PDF, department faculty |
| Admissions (`/admissions`) | Process steps, per-course eligibility, fee table, important dates, inquiry form (DB + email) |
| Placements (`/placements`) | Year-wise stats, recruiter logos, success stories |
| Events (`/events`, `/events/:id`) | Card-grid listing; detail page with registration (students only, gated by login) |
| Gallery (`/gallery`) | Categorized photos: Events, Campus, Cultural, Sports |
| Contact (`/contact`) | Address, embedded map, department directory, inquiry form |

### 6.2 Student Portal (`/student/*`, JWT-protected)

| Page | Requirement |
|---|---|
| Dashboard | Personalized summary (attendance snapshot, latest results, upcoming events) |
| Attendance | Subject-wise %, visual warning if below 75% |
| Results | Semester marks, grade, CGPA trend chart |
| Placements | Active drives + student's own applications |
| Events | Browse and register |
| Notifications | In-app list of alerts (results published, event reminders, etc.) |

**Explicitly excluded:** timetable module.

### 6.3 Admin Panel (`/admin/*`, JWT-protected, role-gated)

| Module | SUPER_ADMIN / DEPT_ADMIN | FACULTY |
|---|---|---|
| Dashboard (stats overview) | ✅ | ❌ |
| Courses (CRUD) | ✅ | ❌ |
| Students (view/manage) | ✅ (own dept for DEPT_ADMIN) | ❌ |
| Faculty (view/manage) | ✅ | ❌ |
| Attendance | ✅ (view all) | ✅ (mark, own subjects only) |
| Results | ✅ (CSV or manual upload, all) | ✅ (own subjects only) |
| Events (CRUD) | ✅ | ❌ |
| Placements (CRUD drives, manage applications) | ✅ | ❌ |
| Announcements (create/pin/expire) | ✅ | ❌ |
| Gallery (upload/delete) | ✅ | ❌ |
| Inquiries (view/mark read) | ✅ | ❌ |

`DEPT_ADMIN` scope is restricted to their own department's records; `SUPER_ADMIN` has unrestricted access.

## 7. Data Requirements (Summary)

Core entities: `User`, `RefreshToken`, `Student`, `Faculty`, `AdminProfile`, `Department`, `Course`, `Subject`, `AttendanceRecord`, `Result`, `Event`, `EventRegistration`, `Company`, `PlacementDrive`, `PlacementApplication`, `Announcement`, `GalleryItem`, `Inquiry`, `Notification`.

Seed data must include 5 departments, 5 courses, 1 super admin, 3 sample students, 2 faculty, 2 events, 2 announcements, 1 placement drive. (Full schema detail lives in `Technical Architecture.md`.)

## 8. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Security | JWT RS256, bcrypt(12), Helmet CSP, CORS whitelist, rate limiting, OTP-based password reset, account lockout, audit logging (full detail in `Security System.md`) |
| Performance | Redis caching for hot reads (course list, announcements); paginated list endpoints |
| Availability | Resilient local services; Nginx reverse proxy in front of client + API |
| Maintainability | Shared Zod schemas/types package between client and server; consistent API response envelope |
| Accessibility | Public pages should be usable with keyboard navigation and reasonable color contrast |
| Responsiveness | All pages functional on mobile, tablet, desktop breakpoints (Tailwind) |

## 9. API Contract (Summary)

Base URL: `/api/v1`

Success:
```json
{ "success": true, "data": {}, "message": "...", "meta": { "page": 1, "limit": 20, "total": 100 } }
```
Error:
```json
{ "success": false, "error": { "code": "STRING", "message": "...", "details": {} } }
```

## 10. Build Sequence (Delivery Plan)

1. Monorepo scaffold + local dev environment + `.env.example`
2. Prisma schema + migrations + seed
3. Express app setup (middleware, error handler, logger)
4. Auth module (login, logout, refresh, OTP reset)
5. Backend API modules (courses, events, placements, attendance, results, gallery, inquiry, notifications)
6. React app setup (routing, Axios interceptor, Zustand store)
7. Public pages UI
8. Student portal UI
9. Admin panel UI
10. Nginx config + local/host production setup

Each step is confirmed before the next begins; steps are not skipped or merged unless explicitly instructed.

## 11. Out of Scope / Future Considerations

- Online fee payment gateway
- Timetable/scheduling
- Mobile native apps
- Multi-tenant support for other institutions
- Alumni network module

## 12. Open Questions

- Final SMTP provider for transactional email (placeholder in `.env.example` for now)
- Whether syllabus PDFs are hosted on Cloudinary or a static asset store
- Exact NAAC/affiliation copy and any pending legal/compliance text for the About page
