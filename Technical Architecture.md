# Technical Architecture
## Srusti Academy of Management and Technology — College Portal

**Version:** 1.0

---

## 1. Architecture Overview

The system is a **monorepo, three-tier web application**:

```
┌─────────────────────────────────────────────────────────┐
│                         Nginx                            │
│         (reverse proxy, TLS termination, static)          │
└───────────────┬─────────────────────────┬────────────────┘
                │                         │
        ┌───────▼────────┐        ┌───────▼────────┐
        │  React Client   │        │  Express API    │
        │  (Vite build)   │◄──────►│  /api/v1/*      │
        └─────────────────┘  HTTPS └───────┬─────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    │                       │                       │
             ┌──────▼──────┐        ┌───────▼───────┐        ┌──────▼──────┐
             │ PostgreSQL   │        │     Redis      │        │ Cloudinary   │
             │ (Prisma ORM) │        │ (OTP, cache,   │        │ (media CDN)  │
             │              │        │  rate limits)  │        │              │
             └──────────────┘        └────────────────┘        └──────────────┘
```

## 2. Monorepo Layout

```
college-portal/
├── apps/
│   ├── client/                 # React 18 + Vite frontend
│   │   ├── src/
│   │   │   ├── pages/          # public/, student/, admin/
│   │   │   ├── components/
│   │   │   ├── store/          # Zustand slices (auth, ui)
│   │   │   ├── lib/            # axios instance, query client
│   │   │   ├── hooks/          # React Query hooks per resource
│   │   │   └── routes/         # React Router v6 route trees + guards
│   │   └── vite.config.ts
│   └── server/                 # Node.js + Express backend
│       ├── src/
│       │   ├── modules/        # auth, courses, students, faculty,
│       │   │                   # attendance, results, events,
│       │   │                   # placements, gallery, inquiries,
│       │   │                   # announcements, notifications
│       │   ├── middleware/     # auth, rbac, error-handler, rate-limit
│       │   ├── lib/            # prisma client, redis client, cloudinary, mailer
│       │   ├── utils/          # response envelope, logger
│       │   └── app.ts / server.ts
│       └── prisma/
│           ├── schema.prisma
│           ├── migrations/
│           └── seed.ts
├── packages/
│   └── shared/                 # Zod schemas + TS types shared client/server
└── nginx/
    └── nginx.conf
```

**Rationale:** the `packages/shared` package guarantees the frontend's form validation (React Hook Form + Zod) and the backend's request validation use the *same* schema definitions — no drift between client and server validation rules.

## 3. Frontend Architecture

| Concern | Choice | Notes |
|---|---|---|
| Framework | React 18 + Vite | Fast HMR, ESM-native build |
| Routing | React Router v6 | Nested routes per section (`public`, `student`, `admin`), route guards via wrapper components |
| Styling | Tailwind CSS | Utility-first, consistent design tokens |
| Client auth state | Zustand | Holds access token **in memory only** (not localStorage/sessionStorage) + decoded user/role |
| Server state | React Query | Caching, refetch-on-focus, optimistic updates for admin CRUD |
| Forms | React Hook Form + Zod | Shared schemas from `packages/shared` |
| Charts | Recharts | CGPA trend, attendance %, placement stats |
| HTTP | Axios | Single instance with request/response interceptors for JWT attach + silent refresh |

### 3.1 Route Guarding Pattern

- `PublicRoute` — always accessible.
- `ProtectedRoute` — requires a valid access token; redirects to login otherwise.
- `RoleRoute(allowedRoles[])` — wraps `ProtectedRoute`; checks decoded role against an allow-list before rendering (e.g., `/admin/courses` → `['SUPER_ADMIN','DEPT_ADMIN']`).

### 3.2 Axios Interceptor Flow

1. Request interceptor attaches `Authorization: Bearer <accessToken>` from the Zustand store.
2. Response interceptor watches for `401`; on first 401, calls `/api/v1/auth/refresh` (cookie-based, silent), updates the store, and retries the original request once.
3. A second consecutive 401 clears the store and redirects to `/login`.

## 4. Backend Architecture

| Concern | Choice | Notes |
|---|---|---|
| Framework | Express.js | Modular routers per domain, mounted under `/api/v1` |
| ORM | Prisma 5 | Schema-first, migrations, type-safe client |
| Validation | Zod | Every request body/query/params parsed via shared schemas |
| Auth | JWT RS256 | Access token short-lived (15m), refresh token in httpOnly cookie (7d) |
| Password hashing | bcrypt (cost 12) | |
| Caching / ephemeral store | Redis | OTP codes, login rate-limit counters, hot-read caching (course list, announcements) |
| File upload | Multer → Cloudinary | MIME-sniffed via `file-type`, UUID filenames, EXIF stripped |
| Email | Nodemailer | SMTP configurable via `.env` |
| Logging | Winston (app logs) + Morgan (HTTP access logs) | |
| Security headers | Helmet | Full CSP configured per environment |

### 4.1 Layered Module Pattern

Each backend module (e.g., `attendance`) follows:

```
modules/attendance/
├── attendance.routes.ts     # Express router, mounts middleware
├── attendance.controller.ts # Request/response glue
├── attendance.service.ts    # Business logic
├── attendance.schema.ts     # Zod validators (imports from packages/shared where reusable)
└── attendance.repository.ts # Prisma queries (no raw SQL)
```

This separation keeps route handlers thin and business logic testable independent of Express.

### 4.2 Middleware Pipeline (applied in order)

1. `helmet()`
2. CORS (whitelist from `.env`)
3. `express-rate-limit` (general: 200/15min; `/auth/login`: 10/15min)
4. `morgan` → Winston stream
5. Body parsing + sanitation (DOMPurify for rich-text fields)
6. Route-level: `authenticate` (JWT verify) → `authorize(roles[])` → `validate(zodSchema)` → controller
7. Centralized error handler (last middleware) — normalizes all errors into the standard error envelope

## 5. Database Design

**Engine:** PostgreSQL 15, accessed exclusively through Prisma (no raw SQL — prevents injection by construction).

### 5.1 Core Models

| Model | Purpose |
|---|---|
| `User` | Base identity: email, password hash, role, status |
| `RefreshToken` | Persisted refresh tokens for revocation/rotation |
| `Student` | Profile linked to `User`, department, course, enrollment year |
| `Faculty` | Profile linked to `User`, department, assigned subjects |
| `AdminProfile` | Profile linked to `User` for SUPER_ADMIN/DEPT_ADMIN |
| `Department` | MCA, BCA, MBA, BBA, B.Com |
| `Course` | Belongs to department; duration, eligibility, fee, syllabus link |
| `Subject` | Belongs to course + semester; assigned faculty |
| `AttendanceRecord` | Student + subject + date + status |
| `Result` | Student + subject + semester + marks/grade |
| `Event` | Public/registerable event |
| `EventRegistration` | Student ↔ Event join |
| `Company` | Recruiter entity |
| `PlacementDrive` | Company + role + eligibility + drive date |
| `PlacementApplication` | Student ↔ PlacementDrive join + status |
| `Announcement` | Pinned/expiring notices |
| `GalleryItem` | Cloudinary media + category |
| `Inquiry` | Public admissions/contact form submissions |
| `Notification` | In-app per-user notification |

### 5.2 Relationships (high level)

- `Department 1—N Course`, `Course 1—N Subject`
- `User 1—1 Student|Faculty|AdminProfile` (role-specific profile tables)
- `Faculty N—N Subject` (subjects they teach)
- `Student N—N Event` via `EventRegistration`
- `Student N—N PlacementDrive` via `PlacementApplication`
- `PlacementDrive N—1 Company`

Full column-level schema is maintained in `apps/server/prisma/schema.prisma` as the single source of truth.

## 6. Caching Strategy (Redis)

| Key pattern | Purpose | TTL |
|---|---|---|
| `otp:{userId}` | Hashed OTP for password reset | 10 min, max 3 attempts |
| `ratelimit:login:{ip}` | Login attempt counter | 15 min window |
| `lockout:{userId}` | Account lockout flag after 5 failed logins | 30 min |
| `cache:courses:list` | Cached public course list | Invalidated on admin course write |
| `cache:announcements:active` | Cached active announcements | Invalidated on write |

## 7. Deployment Architecture

- **Local Execution** (dev): `client`, `server`, `postgres`, `redis` running directly on the host operating system with `localhost` networking.
- **Direct Server Deployment (prod)**: Nginx installed on the host as a reverse proxy; client is built to static assets served by Nginx; API requests proxied to the host Node.js `server` instance (`http://127.0.0.1:5000`).
- **Nginx** responsibilities: TLS termination, gzip, static asset caching headers, `/api/*` → server upstream, SPA fallback (`try_files $uri $uri/ /index.html`) for client-side routing.
- **Migrations**: `npx prisma migrate deploy` run directly against host PostgreSQL before the server starts in production.

## 8. Environment Configuration

All secrets and environment-specific values are sourced from `.env` (never hardcoded), including DB connection string, Redis URL, JWT RS256 key pair, Cloudinary credentials, SMTP credentials, and the client's API base URL. See `.env.example` in the repo root for the full variable list.

## 9. Cross-Cutting Concerns

| Concern | Approach |
|---|---|
| API response consistency | Single envelope shape (success/data/message/meta or success/error) enforced via a response utility used by every controller |
| Error handling | Centralized Express error-handling middleware; custom `AppError` class carrying `code`, `statusCode`, `details` |
| Observability | Winston structured logs (JSON in production) + Morgan HTTP logs; audit log table for sensitive actions |
| Type safety | TypeScript across client and server; shared types package prevents contract drift |
| Testing (recommended, not yet implemented) | Vitest/Jest for services; Supertest for API integration; React Testing Library for components |
