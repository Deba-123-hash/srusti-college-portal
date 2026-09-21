# Tech Stack
## Srusti Academy of Management and Technology — College Portal

**Version:** 1.0

---

## 1. Frontend

| Layer | Technology | Purpose |
|---|---|---|
| Framework | **React.js 18** | Component-based UI |
| Build tool | **Vite** | Fast dev server, optimized production build |
| Routing | **React Router v6** | Client-side routing, nested layouts, route guards |
| Styling | **Tailwind CSS** | Utility-first styling, consistent design system |
| Auth state | **Zustand** | Lightweight store holding access token (in-memory) + user/role |
| Server state | **React Query** | Data fetching, caching, background refetch, mutations |
| Forms | **React Hook Form** + **Zod** | Performant forms with schema-based validation |
| Charts | **Recharts** | CGPA trends, attendance percentages, placement stats |
| Media | **Cloudinary** | Image hosting for gallery, faculty photos, recruiter logos |
| HTTP client | **Axios** | Configured instance with JWT-attach and silent-refresh interceptors |

## 2. Backend

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | **Node.js** | JavaScript server runtime |
| Framework | **Express.js** | REST API routing and middleware pipeline |
| Auth | **JWT (RS256)** | Access token (memory, 15m) + refresh token (httpOnly cookie, 7d) |
| Password hashing | **bcrypt** (cost factor 12) | Secure password storage |
| Validation | **Zod** | Request body/query/param validation, shared with frontend |
| Logging | **Winston** + **Morgan** | Application logs + HTTP access logs |
| Security | **Helmet**, **CORS** (whitelist), **express-rate-limit** | HTTP header hardening, origin control, brute-force mitigation |

## 3. Database & Storage

| Layer | Technology | Purpose |
|---|---|---|
| Primary database | **PostgreSQL 15** | Relational data store for all core entities |
| ORM | **Prisma 5** | Schema-first modeling, type-safe queries, migrations, seeding |
| Cache / ephemeral store | **Redis** | OTP codes, rate-limit counters, account lockout flags, hot-read caching |
| File upload handling | **Multer** → **Cloudinary** | Upload pipeline for images (gallery, profile photos, recruiter logos) |
| Email delivery | **Nodemailer** | Transactional email (OTP, inquiry confirmations, notifications) via configurable SMTP |

## 4. DevOps & Infrastructure

| Layer | Technology | Purpose |
|---|---|---|
| Runtime Environment | **Direct OS Execution** | Direct execution of client, server, DB, Redis directly on the developer's operating system |
| Reverse proxy | **Nginx** | TLS termination, static asset serving, `/api` proxying, SPA fallback routing |

## 5. Monorepo Tooling

| Aspect | Approach |
|---|---|
| Structure | `apps/client`, `apps/server`, `packages/shared` |
| Shared code | Zod schemas + TypeScript types shared between client and server via `packages/shared`, preventing validation drift |
| Language | TypeScript across both frontend and backend (recommended for type safety, consistent with Zod-based validation) |

## 6. Version Reference (as specified)

| Package | Version |
|---|---|
| React | 18.x |
| Express | latest 4.x |
| Prisma | 5.x |
| PostgreSQL | 15.x |
| React Router | 6.x |

## 7. Summary Table

| Category | Choice |
|---|---|
| Frontend framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Client state (auth) | Zustand |
| Client state (server data) | React Query |
| Forms & validation | React Hook Form + Zod |
| Charts | Recharts |
| Media hosting | Cloudinary |
| HTTP client | Axios |
| Backend framework | Node.js + Express.js |
| Auth mechanism | JWT (RS256) |
| Password hashing | bcrypt (cost 12) |
| Backend validation | Zod |
| Logging | Winston + Morgan |
| Security middleware | Helmet, CORS, express-rate-limit |
| Database | PostgreSQL 15 |
| ORM | Prisma 5 |
| Cache | Redis |
| File uploads | Multer + Cloudinary |
| Email | Nodemailer |
| Runtime Environment | Direct OS Execution (Node.js, PostgreSQL, Redis) |
| Reverse proxy | Nginx |
