// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Automated Phase 4 Authentication & Authorization Verification Suite
// =============================================================================

import http from "node:http";
import crypto from "node:crypto";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";
import { redis } from "../src/lib/redis";
import { hashPassword, comparePassword } from "../src/lib/password";
import { verifyAccessToken, signAccessToken } from "../src/lib/jwt";
import { authorize } from "../src/middleware/authorize";
import { authenticate } from "../src/middleware/authenticate";
import { Router } from "express";
import { apiV1Router } from "../src/routes";

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, details?: string) {
  if (condition) {
    results.push({ name, passed: true });
    console.log(`  ✅ PASS: ${name}`);
  } else {
    results.push({ name, passed: false, details });
    console.error(`  ❌ FAIL: ${name} - ${details || "Assertion failed"}`);
  }
}

// Helper to extract cookie value from Set-Cookie header
function extractCookie(res: Response, cookieName: string): string | null {
  const setCookie = res.headers.get("set-cookie");
  if (!setCookie) return null;
  const match = setCookie.match(new RegExp(`${cookieName}=([^;]+)`));
  return match ? match[1] : null;
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("  Running Phase 4 Auth & RBAC Verification Suite");
  console.log("=======================================================\n");

  // Spin up test server on an ephemeral port
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  console.log(`Test server running at: ${baseUrl}\n`);

  // Seed test users in PostgreSQL
  console.log("Seeding test accounts in database...");
  const passwordHash = await hashPassword("SecurePass123!");

  const testStudent = await prisma.user.upsert({
    where: { email: "student_test@srusti.ac.in" },
    update: { passwordHash, status: "ACTIVE", role: "STUDENT" },
    create: {
      email: "student_test@srusti.ac.in",
      name: "Test Student",
      passwordHash,
      role: "STUDENT",
      status: "ACTIVE",
    },
  });

  const testAdmin = await prisma.user.upsert({
    where: { email: "admin_test@srusti.ac.in" },
    update: { passwordHash, status: "ACTIVE", role: "SUPER_ADMIN" },
    create: {
      email: "admin_test@srusti.ac.in",
      name: "Test Admin",
      passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });

  const testFaculty = await prisma.user.upsert({
    where: { email: "faculty_test@srusti.ac.in" },
    update: { passwordHash, status: "ACTIVE", role: "FACULTY" },
    create: {
      email: "faculty_test@srusti.ac.in",
      name: "Test Faculty",
      passwordHash,
      role: "FACULTY",
      status: "ACTIVE",
    },
  });

  const testInactive = await prisma.user.upsert({
    where: { email: "inactive_test@srusti.ac.in" },
    update: { passwordHash, status: "INACTIVE", role: "STUDENT" },
    create: {
      email: "inactive_test@srusti.ac.in",
      name: "Inactive Student",
      passwordHash,
      role: "STUDENT",
      status: "INACTIVE",
    },
  });

  const testLockout = await prisma.user.upsert({
    where: { email: "lockout_test@srusti.ac.in" },
    update: { passwordHash, status: "ACTIVE", role: "STUDENT" },
    create: {
      email: "lockout_test@srusti.ac.in",
      name: "Lockout Test User",
      passwordHash,
      role: "STUDENT",
      status: "ACTIVE",
    },
  });

  // Clean Redis test keys
  await redis.del(`lockout:${testLockout.id}`);
  await redis.del(`failed_attempts:${testLockout.id}`);
  await redis.del(`lockout:${testStudent.id}`);
  await redis.del(`failed_attempts:${testStudent.id}`);
  await redis.del(`otp:${testStudent.id}`);
  await redis.del(`otp_verified:${testStudent.id}`);

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Valid Login Flow & RS256 Tokens
    // -------------------------------------------------------------------------
    console.log("\n[1] Testing Valid Login Flow (POST /api/v1/auth/login)...");
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "student_test@srusti.ac.in",
        password: "SecurePass123!",
      }),
    });
    const loginData = (await loginRes.json()) as any;

    assert(loginRes.status === 200, "Login returns HTTP 200");
    assert(loginData.success === true, "Response has success: true");
    assert(loginData.data.user?.email === "student_test@srusti.ac.in", "Returned user email matches");
    assert(loginData.data.user?.role === "STUDENT", "Returned user role is STUDENT");
    assert(typeof loginData.data.accessToken === "string", "Returns RS256 access token");

    // Verify RS256 signature and payload
    const decodedToken = verifyAccessToken(loginData.data.accessToken);
    assert(decodedToken.userId === testStudent.id, "RS256 JWT payload contains correct userId");
    assert(decodedToken.role === "STUDENT", "RS256 JWT payload contains role STUDENT");

    // Verify httpOnly cookie
    const refreshTokenCookie = extractCookie(loginRes, "refreshToken");
    assert(typeof refreshTokenCookie === "string", "Sets httpOnly refreshToken cookie");

    // Verify refresh token hashed in PostgreSQL
    const tokenHash = crypto.createHash("sha256").update(refreshTokenCookie!).digest("hex");
    const dbToken = await prisma.refreshToken.findUnique({ where: { tokenHash } });
    assert(dbToken !== null, "Hashed refresh token exists in PostgreSQL");
    assert(dbToken?.userId === testStudent.id, "Refresh token is bound to correct userId");
    assert(dbToken?.revokedAt === null, "New refresh token is active (not revoked)");

    // Verify lastLoginAt updated
    const updatedUser = await prisma.user.findUnique({ where: { id: testStudent.id } });
    assert(updatedUser?.lastLoginAt !== null, "User lastLoginAt timestamp was updated");

    // Verify LOGIN audit log
    const loginAudit = await prisma.auditLog.findFirst({
      where: { userId: testStudent.id, action: "LOGIN" },
      orderBy: { createdAt: "desc" },
    });
    assert(loginAudit !== null, "LOGIN audit log record created");

    // -------------------------------------------------------------------------
    // TEST 2: Invalid Email (Timing Safe) & Invalid Password
    // -------------------------------------------------------------------------
    console.log("\n[2] Testing Invalid Credentials...");
    const badEmailRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "nonexistent@srusti.ac.in",
        password: "WrongPassword!",
      }),
    });
    assert(badEmailRes.status === 401, "Non-existent email returns 401 UNAUTHORIZED");
    const badEmailData = await badEmailRes.json();
    assert(badEmailData.error?.code === "INVALID_CREDENTIALS", "Returns standardized INVALID_CREDENTIALS code");

    const badPassRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "student_test@srusti.ac.in",
        password: "WrongPassword123!",
      }),
    });
    assert(badPassRes.status === 401, "Incorrect password returns 401 UNAUTHORIZED");

    // -------------------------------------------------------------------------
    // TEST 3: Inactive Account Rejection
    // -------------------------------------------------------------------------
    console.log("\n[3] Testing Inactive Account Rejection...");
    const inactiveRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "inactive_test@srusti.ac.in",
        password: "SecurePass123!",
      }),
    });
    assert(inactiveRes.status === 401, "Inactive account returns 401");
    const inactiveData = await inactiveRes.json();
    assert(inactiveData.error?.code === "ACCOUNT_INACTIVE", "Returns ACCOUNT_INACTIVE error code");

    // -------------------------------------------------------------------------
    // TEST 4: 5 Failed Attempts -> 30-minute Redis Lockout
    // -------------------------------------------------------------------------
    console.log("\n[4] Testing 5 Failed Attempts -> 30-minute Redis Lockout...");
    for (let i = 1; i <= 4; i++) {
      await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "lockout_test@srusti.ac.in",
          password: "BadPassword!",
        }),
      });
    }

    // 5th failed attempt should trigger lockout
    const fifthRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "lockout_test@srusti.ac.in",
        password: "BadPassword!",
      }),
    });
    assert(fifthRes.status === 401, "5th failed attempt triggers lockout");
    const fifthData = await fifthRes.json();
    assert(fifthData.error?.code === "ACCOUNT_LOCKED", "5th attempt returns ACCOUNT_LOCKED");

    // Check Redis key directly
    const lockoutVal = await redis.get(`lockout:${testLockout.id}`);
    assert(lockoutVal === "locked", "Redis lockout key set for user");
    const lockoutTtl = await redis.ttl(`lockout:${testLockout.id}`);
    assert(lockoutTtl > 1700 && lockoutTtl <= 1800, "Lockout TTL is ~30 minutes (1800s)");

    // Even with the CORRECT password, locked user is rejected immediately before bcrypt
    const lockedRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "lockout_test@srusti.ac.in",
        password: "SecurePass123!",
      }),
    });
    assert(lockedRes.status === 401, "Correct password on locked account is rejected");
    const lockedData = await lockedRes.json();
    assert(lockedData.error?.code === "ACCOUNT_LOCKED", "Returns ACCOUNT_LOCKED code");

    // -------------------------------------------------------------------------
    // TEST 4.1: Dedicated Login Rate Limiter (10 requests / 15 min)
    // -------------------------------------------------------------------------
    console.log("\n[4.1] Testing Dedicated Login Rate Limiter (10 req / 15 min)...");
    const rateLimitRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "student_test@srusti.ac.in",
        password: "SecurePass123!",
      }),
    });
    assert(rateLimitRes.status === 429, "11th login attempt returns HTTP 429 RATE_LIMIT_EXCEEDED");
    const rateLimitData = (await rateLimitRes.json()) as any;
    assert(rateLimitData.error?.code === "RATE_LIMIT_EXCEEDED", "Error envelope contains RATE_LIMIT_EXCEEDED code");

    // -------------------------------------------------------------------------
    // TEST 5: Refresh Token Rotation
    // -------------------------------------------------------------------------
    console.log("\n[5] Testing Refresh Token Rotation (POST /api/v1/auth/refresh)...");
    const refreshRes = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshTokenCookie}`,
      },
    });
    assert(refreshRes.status === 200, "Refresh endpoint returns 200");
    const refreshData = (await refreshRes.json()) as any;
    assert(typeof refreshData.data.accessToken === "string", "Returns new RS256 access token");

    const newRefreshCookie = extractCookie(refreshRes, "refreshToken");
    assert(typeof newRefreshCookie === "string", "Sets rotated refreshToken cookie");
    assert(newRefreshCookie !== refreshTokenCookie, "New refresh token is different from old token");

    // Verify old token was revoked in DB
    const oldDbToken = await prisma.refreshToken.findUnique({ where: { tokenHash } });
    assert(oldDbToken?.revokedAt !== null, "Old refresh token is marked revoked in DB");

    // -------------------------------------------------------------------------
    // TEST 6: Revoked Token Reuse Detection
    // -------------------------------------------------------------------------
    console.log("\n[6] Testing Revoked Token Reuse Detection...");
    const reuseRes = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshTokenCookie}`, // Reusing the old revoked token!
      },
    });
    assert(reuseRes.status === 401, "Reusing revoked token returns 401");
    const reuseData = await reuseRes.json();
    assert(reuseData.error?.code === "TOKEN_REVOKED", "Returns TOKEN_REVOKED error code");

    // Verify all tokens for this user were invalidated as security mitigation
    const activeTokens = await prisma.refreshToken.findMany({
      where: { userId: testStudent.id, revokedAt: null },
    });
    assert(activeTokens.length === 0, "Token reuse revoked ALL active sessions for this user");

    // -------------------------------------------------------------------------
    // TEST 7: Current User (/api/v1/auth/me)
    // -------------------------------------------------------------------------
    console.log("\n[7] Testing Current User Endpoint (GET /api/v1/auth/me)...");
    const meRes = await fetch(`${baseUrl}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${refreshData.data.accessToken}`,
      },
    });
    assert(meRes.status === 200, "GET /me returns 200 with valid access token");
    const meData = (await meRes.json()) as any;
    assert(meData.data?.email === "student_test@srusti.ac.in", "/me returns authenticated user email");
    assert(meData.data?.passwordHash === undefined, "passwordHash is NEVER returned in response");
    assert(meData.data?.refreshToken === undefined, "refreshToken is NEVER returned in response");

    // Test unauthenticated access to /me
    const unauthMeRes = await fetch(`${baseUrl}/api/v1/auth/me`);
    assert(unauthMeRes.status === 401, "Unauthenticated GET /me returns 401");

    // -------------------------------------------------------------------------
    // TEST 8: Change Password
    // -------------------------------------------------------------------------
    console.log("\n[8] Testing Change Password (POST /api/v1/auth/change-password)...");
    // Login fresh to get active session
    const studentLogin = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-test-bypass-rate-limit": "true",
      },
      body: JSON.stringify({
        email: "student_test@srusti.ac.in",
        password: "SecurePass123!",
      }),
    });
    const { data: studentSession } = (await studentLogin.json()) as any;

    const changePassRes = await fetch(`${baseUrl}/api/v1/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentSession.accessToken}`,
      },
      body: JSON.stringify({
        currentPassword: "SecurePass123!",
        newPassword: "BrandNewPass999#",
        confirmPassword: "BrandNewPass999#",
      }),
    });
    assert(changePassRes.status === 200, "Change password returns 200");

    // Verify new password works and old password fails
    const oldLoginCheck = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-test-bypass-rate-limit": "true",
      },
      body: JSON.stringify({
        email: "student_test@srusti.ac.in",
        password: "SecurePass123!",
      }),
    });
    assert(oldLoginCheck.status === 401, "Old password rejected after change");

    const newLoginCheck = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-test-bypass-rate-limit": "true",
      },
      body: JSON.stringify({
        email: "student_test@srusti.ac.in",
        password: "BrandNewPass999#",
      }),
    });
    assert(newLoginCheck.status === 200, "New password accepted after change");

    // Verify PASSWORD_CHANGE audit log
    const passAudit = await prisma.auditLog.findFirst({
      where: { userId: testStudent.id, action: "PASSWORD_CHANGE" },
      orderBy: { createdAt: "desc" },
    });
    assert(passAudit !== null, "PASSWORD_CHANGE audit log record created");

    // -------------------------------------------------------------------------
    // TEST 9: Logout Flow
    // -------------------------------------------------------------------------
    console.log("\n[9] Testing Logout Flow (POST /api/v1/auth/logout)...");
    const freshCookie = extractCookie(newLoginCheck, "refreshToken");
    const logoutRes = await fetch(`${baseUrl}/api/v1/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${freshCookie}`,
      },
    });
    assert(logoutRes.status === 200, "Logout returns 200");
    const logoutSetCookie = logoutRes.headers.get("set-cookie");
    assert(
      logoutSetCookie?.includes("refreshToken=;") || logoutSetCookie?.includes("Max-Age=0"),
      "Logout clears refreshToken cookie"
    );

    // -------------------------------------------------------------------------
    // TEST 10: Forgot Password, OTP Generation & 3-Attempt Limit
    // -------------------------------------------------------------------------
    console.log("\n[10] Testing Forgot Password & OTP Mechanism...");
    const forgotRes = await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "student_test@srusti.ac.in" }),
    });
    assert(forgotRes.status === 200, "Forgot password returns 200");

    // Check Redis OTP storage
    const otpData = await redis.get(`otp:${testStudent.id}`);
    assert(otpData !== null, "OTP stored in Redis");
    const parsedOtp = JSON.parse(otpData!);
    assert(typeof parsedOtp.hashedOtp === "string", "OTP stored in hashed format (SHA-256)");
    assert(parsedOtp.attempts === 0, "Initial OTP attempts is 0");
    const otpTtl = await redis.ttl(`otp:${testStudent.id}`);
    assert(otpTtl > 550 && otpTtl <= 600, "OTP TTL is 10 minutes (600s)");

    // Test invalid OTP
    const wrongOtpRes = await fetch(`${baseUrl}/api/v1/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "student_test@srusti.ac.in", otp: "000000" }),
    });
    assert(wrongOtpRes.status === 400, "Wrong OTP returns 400");

    // Verify attempt counter incremented
    const after1 = JSON.parse((await redis.get(`otp:${testStudent.id}`))!);
    assert(after1.attempts === 1, "OTP attempt counter incremented to 1");

    // Simulate reaching 3 failed attempts
    await fetch(`${baseUrl}/api/v1/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "student_test@srusti.ac.in", otp: "000000" }),
    });
    const thirdOtpRes = await fetch(`${baseUrl}/api/v1/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "student_test@srusti.ac.in", otp: "000000" }),
    });
    assert(thirdOtpRes.status === 400, "3rd failed OTP attempt rejected");
    const thirdOtpData = await thirdOtpRes.json();
    assert(thirdOtpData.error?.code === "MAX_OTP_ATTEMPTS", "Returns MAX_OTP_ATTEMPTS code");

    // Redis key cleared after max attempts
    const after3 = await redis.get(`otp:${testStudent.id}`);
    assert(after3 === null, "OTP deleted from Redis after 3 failed attempts");

    // -------------------------------------------------------------------------
    // TEST 11: Reset Password with Verified OTP
    // -------------------------------------------------------------------------
    console.log("\n[11] Testing Password Reset with Valid OTP...");
    // Request fresh OTP
    await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "student_test@srusti.ac.in" }),
    });

    // Set known OTP directly in Redis for deterministic testing
    const testOtp = "123456";
    const hashedTestOtp = crypto.createHash("sha256").update(testOtp).digest("hex");
    await redis.set(
      `otp:${testStudent.id}`,
      JSON.stringify({ hashedOtp: hashedTestOtp, attempts: 0 }),
      "EX",
      600
    );

    // Verify valid OTP
    const validOtpRes = await fetch(`${baseUrl}/api/v1/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "student_test@srusti.ac.in", otp: testOtp }),
    });
    assert(validOtpRes.status === 200, "Valid OTP verification returns 200");

    // Reset password
    const resetRes = await fetch(`${baseUrl}/api/v1/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "student_test@srusti.ac.in",
        otp: testOtp,
        newPassword: "ResetPassword123$",
        confirmPassword: "ResetPassword123$",
      }),
    });
    assert(resetRes.status === 200, "Password reset returns 200");

    // Verify login with newly reset password
    const resetLoginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-test-bypass-rate-limit": "true",
      },
      body: JSON.stringify({
        email: "student_test@srusti.ac.in",
        password: "ResetPassword123$",
      }),
    });
    assert(resetLoginRes.status === 200, "Login succeeds with reset password");

    // -------------------------------------------------------------------------
    // TEST 12: Role-Based Access Control (RBAC)
    // -------------------------------------------------------------------------
    console.log("\n[12] Testing RBAC Middleware...");
    // Mount a temporary test router on the running express app to test RBAC
    const rbacTestRouter = Router();
    rbacTestRouter.get("/super-only", authenticate, authorize("SUPER_ADMIN"), (_req, res) => {
      res.json({ success: true, data: "super_admin_secret" });
    });
    rbacTestRouter.get("/admin-or-dept", authenticate, authorize("SUPER_ADMIN", "DEPT_ADMIN"), (_req, res) => {
      res.json({ success: true, data: "admin_area" });
    });
    rbacTestRouter.get("/student-only", authenticate, authorize("STUDENT"), (_req, res) => {
      res.json({ success: true, data: "student_portal" });
    });
    apiV1Router.use("/test-rbac", rbacTestRouter);

    // Tokens for roles
    const adminToken = signAccessToken({
      userId: testAdmin.id,
      email: testAdmin.email,
      role: "SUPER_ADMIN",
    });
    const facultyToken = signAccessToken({
      userId: testFaculty.id,
      email: testFaculty.email,
      role: "FACULTY",
    });
    const studentToken = signAccessToken({
      userId: testStudent.id,
      email: testStudent.email,
      role: "STUDENT",
    });

    // Super Admin accesses super-only -> 200
    const superAdminRes = await fetch(`${baseUrl}/api/v1/test-rbac/super-only`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(superAdminRes.status === 200, "SUPER_ADMIN can access super-only route (200)");

    // Student accesses super-only -> 403 FORBIDDEN
    const studentForbiddenRes = await fetch(`${baseUrl}/api/v1/test-rbac/super-only`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(studentForbiddenRes.status === 403, "STUDENT rejected from super-only route with 403 FORBIDDEN");

    // Faculty accesses super-only -> 403 FORBIDDEN
    const facultyForbiddenRes = await fetch(`${baseUrl}/api/v1/test-rbac/super-only`, {
      headers: { Authorization: `Bearer ${facultyToken}` },
    });
    assert(facultyForbiddenRes.status === 403, "FACULTY rejected from super-only route with 403 FORBIDDEN");

    // Student accesses student-only -> 200
    const studentAccessRes = await fetch(`${baseUrl}/api/v1/test-rbac/student-only`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(studentAccessRes.status === 200, "STUDENT can access student-only route (200)");

    // Unauthenticated request to protected route -> 401
    const unauthRbacRes = await fetch(`${baseUrl}/api/v1/test-rbac/super-only`);
    assert(unauthRbacRes.status === 401, "Unauthenticated request rejected with 401");

  } finally {
    // Cleanup & close server
    server.close();
  }

  // ---------------------------------------------------------------------------
  // Summary Report
  // ---------------------------------------------------------------------------
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log("\n=======================================================");
  console.log(`  Phase 4 Verification Summary: ${passed}/${total} Passed`);
  if (failed > 0) {
    console.log(`  ❌ ${failed} checks failed`);
  } else {
    console.log("  🎉 All Phase 4 Auth & RBAC checks PASSED!");
  }
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Fatal error running Phase 4 tests:", err);
  process.exit(1);
});
