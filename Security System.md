# Security System
## Srusti Academy of Management and Technology — College Portal

**Version:** 1.0

---

## 1. Security Philosophy

Security is enforced at every layer — network edge (Nginx/Helmet), transport (TLS, cookie flags), application (auth/authz middleware, validation), and data (parameterized queries, hashing). No layer is trusted to be the sole line of defense (defense in depth).

## 2. Authentication

### 2.1 JWT Strategy — RS256

| Token | Storage | Lifetime | Notes |
|---|---|---|---|
| Access token | Zustand store (in-memory, JS heap) — **never** localStorage/sessionStorage | 15 minutes | Signed RS256; payload: `userId`, `role`, `departmentId` (if applicable) |
| Refresh token | httpOnly + Secure + SameSite=Strict cookie | 7 days | Persisted server-side in `RefreshToken` table for revocation; rotated on every use |

**Why RS256 over HS256:** asymmetric signing means the server holds the private key for signing while the public key can be distributed to any service that needs to *verify* tokens (useful if the API is later split into microservices) without risk of forging tokens.

**Why in-memory access tokens:** eliminates XSS-based token theft via `localStorage`/`sessionStorage` access. A page reload requires a silent refresh (via the httpOnly cookie), which is an accepted UX trade-off for the security gain.

### 2.2 Password Storage

- **bcrypt**, cost factor **12**.
- Passwords are never logged, never included in API responses, never sent back to the client in any form.

### 2.3 OTP-Based Password Reset

- OTP generated via `crypto.randomInt` (cryptographically secure, not `Math.random`).
- OTP is **hashed** before storage in Redis (never stored in plaintext, even transiently).
- Key: `otp:{userId}`, TTL: **10 minutes**.
- Maximum **3 verification attempts** before the OTP is invalidated and a new one must be requested.
- Successful reset invalidates **all** existing refresh tokens for that user (forces re-login on all devices).

### 2.4 Account Lockout

- **5 consecutive failed login attempts** → account locked for **30 minutes** (`lockout:{userId}` key in Redis).
- Failed-attempt counter resets on successful login.
- Lockout state is checked *before* password comparison to avoid unnecessary bcrypt work and to give a consistent early response.

## 3. Authorization (RBAC)

| Role | Scope |
|---|---|
| `SUPER_ADMIN` | Unrestricted access to all modules and departments |
| `DEPT_ADMIN` | Same module access as SUPER_ADMIN, automatically scoped to their own `departmentId` at the service/query layer |
| `FACULTY` | Access limited to `/admin/attendance` and `/admin/results`, and only for subjects where `Subject.facultyId === req.user.id` |
| `STUDENT` | Access limited to their own records (`Student.userId === req.user.id`) and public/registerable resources |

**Enforcement pattern:**
1. `authenticate` middleware verifies the JWT signature and expiry, attaches `req.user`.
2. `authorize([roles])` middleware checks `req.user.role` is in the allowed list for the route — rejects with `403` otherwise.
3. **Ownership checks** happen inside the service layer for faculty/student-scoped resources (e.g., a faculty member cannot mark attendance for a subject they don't teach, even if they guess the subject ID) — this prevents Insecure Direct Object Reference (IDOR) vulnerabilities.

## 4. Transport & Network Security

| Control | Detail |
|---|---|
| HTTPS/TLS | Terminated at Nginx; all HTTP traffic redirected to HTTPS in production |
| Helmet.js | Full CSP configured — restricts script/style/img/connect sources; disables `X-Powered-By`; sets `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` |
| CORS | Explicit **whitelist** of allowed origins from `.env` — no wildcard (`*`) in any environment |
| Rate limiting | `express-rate-limit`: 200 requests/15min general API; **10 requests/15min** specifically on `/api/v1/auth/login` to blunt brute-force attempts |
| Cookies | Refresh token cookie: `httpOnly`, `Secure`, `SameSite=Strict` — inaccessible to JS, not sent cross-site, only sent over HTTPS |

## 5. Input Validation & Injection Prevention

| Vector | Mitigation |
|---|---|
| Request bodies/query/params | **Zod** schema validation on every endpoint (shared schemas between client and server) |
| SQL injection | **Prisma** parameterized queries exclusively — raw SQL is disallowed by policy |
| Stored XSS (rich text fields, e.g., announcements, event descriptions) | **DOMPurify** sanitization before persistence |
| File upload abuse | **Multer** for upload handling + **`file-type`** library to verify actual file content/MIME (not just the client-supplied extension) + **UUID filenames** (prevents path traversal / filename collision) |
| EXIF metadata leakage | Cloudinary configured to **strip EXIF** from uploaded images (removes GPS/location and device metadata) |

## 6. Secrets Management

- All credentials and keys (DB connection string, Redis URL, JWT RS256 key pair, Cloudinary keys, SMTP credentials) are supplied via `.env` and **never hardcoded** in source.
- `.env` is kept strictly local and never published; `.env.example` documents required variables with empty/placeholder values.
- JWT signing uses an RS256 key pair — the private key is only ever present on the server/signing service; it is not distributed to the client or exposed publicly.

## 7. Audit Logging

The following sensitive actions are recorded to an audit log (persisted, queryable by SUPER_ADMIN):

- Login
- Logout
- Password change
- Role change
- Result publish
- Data export

Each audit entry captures: actor (`userId`, role), action type, target resource, timestamp, and (where applicable) IP address. Audit logs are append-only from the application's perspective — no update/delete endpoint is exposed for them.

## 8. Logging & Monitoring

- **Winston** — structured application logs (JSON format in production) for errors, warnings, and security-relevant events (failed logins, lockouts, authorization failures).
- **Morgan** — HTTP access logs, piped into the Winston stream for centralized log handling.
- Error responses returned to clients never leak stack traces or internal details in production — the centralized error handler returns only `code`, `message`, and safe `details`; full error context is logged server-side only.

## 9. Data Access Boundaries Summary

| Data | Who can read | Who can write |
|---|---|---|
| Own attendance/results | Student (self only) | Faculty (own subjects only) → SUPER_ADMIN/DEPT_ADMIN can also write |
| All attendance/results (department) | DEPT_ADMIN (own dept), SUPER_ADMIN (all) | Same as above |
| Courses, Events, Placements, Announcements, Gallery | Public (read, published items only) | SUPER_ADMIN / DEPT_ADMIN |
| Inquiries | SUPER_ADMIN / DEPT_ADMIN | Public (create only, no read/update access to submissions) |
| Audit log | SUPER_ADMIN only | System-generated only (no manual write endpoint) |

## 10. Threat Model Notes

| Threat | Mitigation in place |
|---|---|
| Credential stuffing / brute force | Login rate limit (10/15min) + account lockout (5 fails → 30min) |
| Token theft via XSS | Access token never touches persistent browser storage; CSP restricts script sources |
| CSRF on refresh endpoint | `SameSite=Strict` cookie attribute prevents cross-site cookie submission |
| IDOR on faculty/student resources | Service-layer ownership checks in addition to role-based route guards |
| Malicious file upload (web shell, disguised executable) | MIME-sniffing via `file-type`, UUID renaming, Cloudinary-hosted (not served from app server filesystem) |
| SQL injection | Prisma ORM only, no raw SQL string concatenation permitted |
| Stored XSS via rich text | DOMPurify sanitization on write |
| Privilege escalation | Role checked server-side on every request from JWT claims, never trusted from client-submitted role fields |

## 11. Security Requirements Checklist (from project spec)

- [x] RS256 JWT — access token in memory, refresh in httpOnly/Secure/SameSite=Strict cookie
- [x] bcrypt cost factor 12
- [x] Helmet.js with full CSP
- [x] CORS whitelist only (no wildcard)
- [x] Rate limiting — 200/15min general, 10/15min on `/auth/login`
- [x] OTP via `crypto.randomInt`, hashed in Redis, 10min TTL, max 3 attempts
- [x] Account lockout — 5 failed logins → 30min lock
- [x] Zod validation on every request body
- [x] Prisma parameterized queries only (no raw SQL)
- [x] DOMPurify for rich text fields
- [x] Multer + `file-type` MIME check + UUID filenames
- [x] Cloudinary EXIF stripping
- [x] Audit log for login, logout, password change, role change, result publish, data export
- [x] All secrets via `.env`, never hardcoded
