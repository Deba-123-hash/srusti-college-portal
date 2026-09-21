# Srusti Academy of Management and Technology — College Portal

> **Phase 1 Complete Project Foundation**  
> Monorepo Scaffold + Local Development Infrastructure + Environment Configuration

**Institution Address:**  
38/1, Chandaka Industrial Estate, Near Infocity, Patia, Bhubaneswar, Odisha 751024

---

## 1. System Architecture

```text
React Client (Vite + TS + Tailwind)
           ↓ HTTP / REST
      Express API (Node + TS)
      ↙                     ↘
PostgreSQL 15 (Data)     Redis 7 (Cache / Limits)
```

### Production Components
- **Database ORM**: PostgreSQL 15 managed via Prisma 5.
- **Security & RBAC**: Asymmetric RS256 JWT Authentication with Role-Based Access Control.
- **Reverse Proxy**: Host-level Nginx with SSL/TLS termination, gzip, SPA routing fallback.
- **Media Asset Storage**: Cloudinary with Multer.
- **Mail Service**: Nodemailer SMTP integration for OTP & notifications.

---

## 2. Directory Structure

```text
college-portal/
│
├── apps/
│   ├── client/                  # Frontend SPA (React 18, Vite, TypeScript, Tailwind CSS)
│   │   ├── public/              # Static public assets
│   │   ├── src/
│   │   │   ├── assets/          # Images, icons, static files
│   │   │   ├── components/      # Reusable UI component library
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── layouts/         # Layout components (Public, Student, Admin)
│   │   │   ├── lib/             # Axios API client, queryClient & configuration
│   │   │   ├── pages/           # Page route components
│   │   │   ├── routes/          # React Router v6 routing declarations
│   │   │   ├── store/           # Global client state management (Zustand)
│   │   │   ├── App.tsx          # Main application component
│   │   │   ├── main.tsx         # Application entry point
│   │   │   └── index.css        # Normalized global stylesheet
│   │   ├── package.json         # Client workspace dependencies
│   │   ├── tsconfig.json        # TypeScript configuration
│   │   ├── tsconfig.node.json   # Vite Node configuration
│   │   └── vite.config.ts       # Vite bundler configuration
│   │
│   └── server/                  # Backend REST API (Node.js, Express, TypeScript)
│       ├── src/
│       │   ├── config/          # Centralized Zod environment & CORS configuration
│       │   ├── middleware/      # Foundational Express middleware (Helmet, CORS, Error, Rate Limiting)
│       │   ├── modules/         # Business domain modules
│       │   ├── lib/             # Infrastructure clients (Prisma, Redis) & Winston/Morgan logger
│       │   ├── utils/           # Standardized API response helpers & custom ApiError
│       │   ├── app.ts           # Express application initialization & middleware pipeline
│       │   └── server.ts        # Server bootstrap & HTTP listener
│       ├── prisma/
│       │   ├── schema.prisma    # Complete Prisma 5 schema (19 entities)
│       │   ├── seed.ts          # Relational seed data script
│       │   └── migrations/      # Prisma migrations directory
│       ├── package.json         # Server workspace dependencies
│       └── tsconfig.json        # Strict TypeScript configuration
│
├── packages/
│   └── shared/                  # Monorepo cross-package contracts
│       ├── src/
│       │   └── index.ts         # Shared API_VERSION, college details, types & schemas
│       ├── package.json         # Shared package workspace definition
│       └── tsconfig.json        # Shared package TypeScript configuration
│
├── nginx/
│   └── nginx.conf               # Host-level Nginx reverse proxy configuration
│
├── .env.example                 # Environment variables specification template
├── package.json                 # Monorepo root workspaces and orchestrator
├── package-lock.json            # Deterministic dependency tree lockfile
└── README.md                    # Project architecture & developer documentation
```

---

## 3. Prerequisites & Environment Requirements

The application runs directly on the developer's operating system using standard installed software:

| Requirement | Minimum Version | Recommended | Verification Command |
|---|---|---|---|
| **Node.js** | `>= 20.0.0` (LTS) | `20.12.x` or later | `node --version` |
| **npm** | `>= 10.0.0` | `10.8.x` or later | `npm --version` |
| **PostgreSQL** | `>= 15.0` | `15.x` | `psql --version` |
| **Redis** | `>= 6.0` | `7.x` | `redis-server --version` |

PostgreSQL and Redis must be installed and running locally on the system.

---

## 4. Local Startup Workflow

Follow these straightforward steps to set up and run the application locally:

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Start PostgreSQL
Ensure the PostgreSQL service is active, and create the local development database:
```sql
CREATE DATABASE college_portal;
```

### Step 3 — Start Redis
Ensure the local Redis server is active:
```bash
redis-server
```
Verify connectivity using `redis-cli ping` (expected: `PONG`).

### Step 4 — Configure environment
Copy `.env.example` to `.env` in the project root and in `apps/server/.env`:
```bash
# Windows PowerShell
Copy-Item .env.example .env
Copy-Item .env.example apps/server/.env

# Linux / macOS
cp .env.example .env
cp .env.example apps/server/.env
```
Configure your database password and secrets if needed:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/college_portal"
REDIS_URL="redis://localhost:6379"
```

### Step 5 — Generate Prisma client
```bash
npm run prisma:generate --workspace=apps/server
```

### Step 6 — Run migration
```bash
npm run prisma:migrate --workspace=apps/server
```

### Step 7 — Seed development data
```bash
npm run prisma:seed --workspace=apps/server
```

### Step 8 — Start backend
```bash
npm run dev:server
```
The Express REST API will start on `http://localhost:5000`.

### Step 9 — Start frontend
```bash
npm run dev:client
```
The Vite React application will start on `http://localhost:5173`.

> [!TIP]
> You can also start both client and server concurrently from the root directory with:
> ```bash
> npm run dev
> ```

---

## 5. Local Service Endpoints

All services interact over standard `localhost` network ports:

| Service | Address / Port | Purpose |
|---|---|---|
| **Frontend Web App** | `http://localhost:5173` | React 18 + Vite development server |
| **Backend REST API** | `http://localhost:5000` | Express.js REST API |
| **API Health Probe** | `http://localhost:5000/api/v1/health` | Liveness health check |
| **API Readiness Probe** | `http://localhost:5000/api/v1/health/ready` | Deep database & Redis status |
| **PostgreSQL Database** | `localhost:5432` | Relational database (`college_portal`) |
| **Redis Cache** | `localhost:6379` | Cache, OTP, and rate limiting store |

---

## 6. Health Check Verification

The Phase 1 & 3 backend exposes standardized health endpoints:

### Liveness Probe
```http
GET http://localhost:5000/api/v1/health
```

**Response (HTTP 200 OK):**
```json
{
  "success": true,
  "data": {
    "status": "ok"
  },
  "message": "API is healthy"
}
```

### Readiness Probe (PostgreSQL & Redis Status)
```http
GET http://localhost:5000/api/v1/health/ready
```

**Response (HTTP 200 OK when services are connected):**
```json
{
  "success": true,
  "data": {
    "status": "ready",
    "services": {
      "database": "connected",
      "redis": "connected"
    }
  },
  "message": "All dependent services are operational"
}
```

### Verification via cURL
```bash
curl -i http://localhost:5000/api/v1/health
```

---

## 7. Production Deployment Architecture

In production, each component runs directly on the server:

```text
React frontend (Static Build)
        ↓
Nginx Reverse Proxy (Port 80/443, SSL/TLS, Gzip, SPA routing)
        ↓
Node.js / Express API (Port 5000)
        ↓
PostgreSQL 15 (Port 5432) & Redis (Port 6379)
```

1. **Build Step**: Run `npm run build` to produce compiled distributions for `@srusti/shared`, `@srusti/server`, and the `@srusti/client` static SPA bundle.
2. **Database Migrations**: Execute `npx prisma migrate deploy` directly against the production PostgreSQL instance.
3. **Host Nginx**: Place `nginx/nginx.conf` into `/etc/nginx/sites-available/` to route `/api/*` to the local Node process (`http://127.0.0.1:5000`) and serve client assets with SPA fallback (`try_files $uri $uri/ /index.html;`).
4. **Process Management**: Manage the Node.js API process using a process supervisor such as systemd or PM2.

---

## 8. RSA Keypair Generation for RS256 Authentication

The authentication system uses **RS256 asymmetric JWT authentication**. To generate a 2048-bit RSA keypair:

```bash
# 1. Generate a 2048-bit RSA private key
openssl genrsa -out jwt-private.pem 2048

# 2. Extract the public key in PEM format
openssl rsa -in jwt-private.pem -pubout -out jwt-public.pem
```

### Key Management Rules:
1. **Never commit or expose `.pem` files**: Private keys must remain secure and restricted exclusively to the backend service.
2. **Production deployment**: Inject keys securely via environment variables (`JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY`) or a secrets manager.

---

## 9. Monorepo Scripts Reference

| Command | Action |
|---|---|
| `npm run dev` | Starts server and client development servers |
| `npm run dev:server` | Starts Express development server with `tsx watch` |
| `npm run dev:client` | Starts Vite React frontend on port 5173 |
| `npm run build` | Compiles shared contracts, server TypeScript, and client production bundle |
| `npm run typecheck` | Runs strict TypeScript verification across all workspaces |
| `npm run lint` | Lints all workspaces if configured |
| `npm run test:phase3` | Runs the automated Express foundation verification suite in `apps/server` |

---

## 10. Phase 3 — Express Backend Foundation

Phase 3 establishes a secure, production-grade Express.js backend pipeline with centralized error handling, structured logging, request correlation, security hardening, and resilient lifecycle management.

### Middleware Pipeline Order

Every incoming request flows through a strictly ordered pipeline in `apps/server/src/app.ts`:

```text
Incoming Request
      │
      ▼
1. Trust Proxy (`app.set("trust proxy", 1)`)
      │
      ▼
2. Request ID Correlation (`requestIdMiddleware`) ──▶ Generates / preserves UUIDv4; sets `X-Request-ID`
      │
      ▼
3. Helmet Security Headers ──▶ Restrictive CSP, nosniff, cross-origin resource policy
      │
      ▼
4. Strict CORS Whitelist ──▶ Rejects unauthorized origins; enables credentials for cookie auth
      │
      ▼
5. General Rate Limiter ──▶ 200 requests / 15-minute window per IP with RateLimit-* headers
      │
      ▼
6. Morgan HTTP Logging ──▶ Captures access logs and pipes them into Winston structured logger
      │
      ▼
7. Body Parsers (`express.json`, `express.urlencoded`, `cookieParser`) ──▶ 1 MB size limit
      │
      ▼
8. Prototype Pollution Sanitizer (`sanitizeMiddleware`) ──▶ Recursively strips __proto__, constructor, prototype
      │
      ▼
9. API Router (`/api/v1`) ──▶ Routes requests to versioned feature modules
      │
      ├── GET /api/v1/health       (Liveness Probe)
      └── GET /api/v1/health/ready (Deep Readiness Probe: Postgres + Redis)
      │
      ▼
10. 404 Handler (`notFoundHandler`) ──▶ Standardized `ROUTE_NOT_FOUND` error
      │
      ▼
11. Centralized Error Handler (`errorHandler`) ──▶ Normalizes ApiError, Zod, SyntaxError, CORS, Prisma
```

### Standardized API Envelopes

All server responses adhere to contracts defined in `@srusti/shared`:

#### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation description"
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human-readable message",
    "details": null
  }
}
```

### Standard Error Codes

| Error Code | HTTP Status | Description |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Zod request schema validation failure (includes field-level errors) |
| `MALFORMED_JSON` | 400 | Invalid JSON syntax in request body |
| `BAD_REQUEST` | 400 | Generic invalid request parameters or foreign key errors |
| `UNAUTHORIZED` | 401 | Missing, expired, or invalid authentication credentials |
| `FORBIDDEN` | 403 | Insufficient role or permission for target action |
| `CORS_NOT_ALLOWED` | 403 | Request Origin is not in the whitelist |
| `ROUTE_NOT_FOUND` | 404 | Unmatched API endpoint |
| `RESOURCE_NOT_FOUND` | 404 | Target entity was not found in database |
| `CONFLICT` | 409 | Unique constraint violation (e.g. email or registration number duplicate) |
| `RATE_LIMIT_EXCEEDED` | 429 | Exceeded 200 requests per 15 minutes per IP |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled exception (sanitized in production, no leaked stacks) |
| `SERVICE_UNAVAILABLE` | 503 | Database or Redis probe failure during readiness check |

### Logging Subsystem (Winston + Morgan)

- **Development**: Clean, colorized console output with ISO timestamps, request IDs, and formatted metadata.
- **Production**: Machine-readable JSON logs for log ingestion.
- **Sensitive Data Redaction**: Automatically scrubs passwords, password hashes, access/refresh tokens, secrets, cookies, OTPs, and database/redis connection strings from log metadata.
- **HTTP Stream**: Morgan access logs pipe directly through Winston at `info` level.

### Infrastructure Lifecycle & Graceful Shutdown

- **Prisma Client Singleton**: Safe connection pooling across dev reloads using `globalThis`.
- **Redis Client (ioredis)**: Resilient client with automatic exponential backoff, safe masked logging, and non-fatal initialization.
- **Graceful Shutdown**: Listens to `SIGTERM` and `SIGINT`:
  1. Stops accepting new incoming HTTP connections (`server.close()`).
  2. Disconnects Prisma client pool (`prisma.$disconnect()`).
  3. Disconnects Redis client (`redis.quit()`).
  4. Enforces a 10-second timeout to force exit if connections hang.

---

## 11. Verification Status

- [x] Monorepo workspace structure (`apps/*`, `packages/*`)
- [x] Shared contract package (`@srusti/shared`) with `API_VERSION = "v1"`
- [x] PostgreSQL 15 & Prisma 5 relational schema (`apps/server/prisma/schema.prisma`)
- [x] Development database seed script (`apps/server/prisma/seed.ts`)
- [x] Centralized Zod environment configuration (`src/config/env.ts`)
- [x] Strict CORS whitelist (`src/config/cors.ts`)
- [x] Typed `ApiError` class with static factories (`src/utils/ApiError.ts`)
- [x] Promise-safe async route wrapper (`src/utils/asyncHandler.ts`)
- [x] Winston structured logging + Morgan HTTP stream (`src/lib/logger.ts`)
- [x] Prisma client singleton (`src/lib/prisma.ts`)
- [x] Redis client foundation (`src/lib/redis.ts`)
- [x] Request ID correlation middleware (`src/middleware/requestId.ts`)
- [x] Rate limiting middleware (`src/middleware/rateLimiter.ts`)
- [x] Prototype pollution defense (`src/middleware/sanitize.ts`)
- [x] Standardized 404 handler (`src/middleware/notFound.ts`)
- [x] Centralized error handler (`src/middleware/errorHandler.ts`)
- [x] Health liveness & readiness probes (`src/routes/health.routes.ts`)
- [x] Root API v1 router (`src/routes/index.ts`)
- [x] Express middleware pipeline assembly (`src/app.ts`)
- [x] Server bootstrap with 0.0.0.0 binding & graceful shutdown (`src/server.ts`)
- [x] Automated test suite: 31/31 checks passing (`npm run test:phase3 --workspace=apps/server`)
- [x] Strict Phase 3 boundaries maintained (No authentication or business routes in Phase 3)
- [x] Local development infrastructure established; direct OS execution verified
- [x] Phase 4: Full Authentication & Session Management (RS256 JWT in-memory + httpOnly refresh cookies)
- [x] Phase 5: Complete Business API Layer (13 Express modules with Prisma ORM)
- [x] Phase 6: React Frontend Foundation & API Integration (Vite + Tailwind + Zustand + TanStack Query)
- [x] Phase 7: Public Website & Prospective Student Experience (Responsive Landing, Courses, Events, Gallery, Admissions)
- [x] Phase 8: Complete Student Portal (/student/dashboard, attendance, results, placements, events, notifications)
- [x] Phase 9: Complete Administrative Console (/admin/dashboard, courses, students, faculty, attendance, results, events, placements, announcements, gallery, inquiries)
- [x] Phase 10: Production Readiness, Host Nginx, Performance & Security Hardening

---

## 12. Pre-Seeded Test Credentials

The database has been seeded with authentic, relational test accounts for all roles:

| Role | Email Address | Password | Profile / Department |
|---|---|---|---|
| **Super Admin** | `admin_test@srusti.ac.in` | `SecurePass123!` | Prof. Siba Prasad Pattanayak (Principal & Autonomous Director) |
| **Faculty (HOD)** | `faculty_test@srusti.ac.in` | `SecurePass123!` | Dr. Ashok Kumar Rath (Head of Department, MCA) |
| **Student** | `student_test@srusti.ac.in` | `SecurePass123!` | Debabrata Nayak (MCA Sem 3, RegNo: `SRUSTI-2024-MCA-001`, CGPA: `8.75`) |

---

## 13. Student Portal Features (Phase 8)

The Student Portal provides authenticated students with real-time academic and career management:

- **/student/dashboard**: Executive student overview with real-time academic standing, attendance gauge, latest published results, upcoming events, and recruitment applications.
- **/student/attendance**: Subject-wise class attendance breakdown with 75% minimum statutory attendance threshold warnings, attendance percentage pills, and historical lecture records.
- **/student/results**: Official semester marksheets showing internal marks, external marks, credits, total score, letter grades (O, E, A, B, C, D, F), and semester GPA.
- **/student/placements**: Active campus recruitment drives, eligibility CGPA checks, package details, one-click application submission, and interview tracking.
- **/student/events**: Campus symposiums, technical hackathons, guest lectures, and cultural festivals with one-click seat reservation and digital passes.
- **/student/notifications**: Personal notification center with unread counters, mark-as-read actions, and direct action deep-links.

---

## 14. Administrative Console Features (Phase 9)

The Admin Console empowers academic administrators with comprehensive institutional controls:

- **/admin/dashboard**: High-level institutional metrics (student count, faculty count, active courses, scheduled events, placement drives, pending inquiries) and security audit logs.
- **/admin/courses**: Full academic curriculum management with duration, total fees, department mapping, and syllabus links.
- **/admin/students**: Comprehensive student directory with search, course/semester filters, and user enrollment creation.
- **/admin/faculty**: Faculty directory with department allocation, designations, and contact directories.
- **/admin/attendance**: Batch attendance entry console allowing instructors to pick course, semester, subject, and date to mark student rosters (Present/Absent/Late) with one-click bulk save.
- **/admin/results**: Examination grading management with internal/external score entries, automated total & grade calculation, and cohort-wide result publication.
- **/admin/events**: Event coordination console with scheduling, seat capacity limits, and registration open/closed toggles.
- **/admin/placements**: Placement cell console with recruitment drive announcements, recruiter directory, and applicant status pipeline (Applied → Shortlisted → Interview → Selected → Rejected).
- **/admin/announcements**: Official circulars and institutional bulletins with category filtering and home-page pin capabilities.
- **/admin/gallery**: Campus media gallery management with categorized photography (Campus, Events, Cultural, Sports).
- **/admin/inquiries**: Admissions lead management console with inquiry status tracking (New → In Review → Contacted → Closed).

