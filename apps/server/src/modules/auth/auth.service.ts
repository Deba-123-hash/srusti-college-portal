// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Auth Module Service (Business Logic & Security Workflows)
// =============================================================================

import crypto from "crypto";
import { AuthUser, UserRole } from "@srusti/shared";
import { authRepository } from "./auth.repository";
import {
  LoginInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  VerifyOtpInput,
  ResetPasswordInput,
  AuthSessionResult,
  RefreshSessionResult,
} from "./auth.types";
import { signAccessToken } from "../../lib/jwt";
import {
  hashPassword,
  comparePassword,
  dummyComparePassword,
} from "../../lib/password";
import { redis } from "../../lib/redis";
import { sendMail } from "../../lib/mailer";
import { ApiError } from "../../utils/ApiError";
import { logger } from "../../lib/logger";

// ---------------------------------------------------------------------------
// Security & Token Helpers
// ---------------------------------------------------------------------------

function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

function generateRawToken(): string {
  return crypto.randomBytes(40).toString("hex");
}

function hashOtp(rawOtp: string): string {
  return crypto.createHash("sha256").update(rawOtp).digest("hex");
}

function resolveDepartmentId(user: any): string | null {
  return (
    user.adminProfile?.departmentId ||
    user.faculty?.departmentId ||
    user.student?.departmentId ||
    null
  );
}

function toSafeUser(user: any): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
    status: user.status,
    departmentId: resolveDepartmentId(user),
    lastLoginAt: user.lastLoginAt,
  };
}

export class AuthService {
  /**
   * User Login Flow:
   * 1. Rate limiter & input validation (middleware)
   * 2. Email lookup & timing-safe fallback
   * 3. Redis account lockout check before bcrypt
   * 4. User active status check
   * 5. Password verification (bcrypt cost 12)
   * 6. Failed attempt counter tracking & 30-min lockout trigger at 5 fails
   * 7. Issue RS256 access token (15m) + hashed refresh token (7d)
   * 8. Update lastLoginAt & write LOGIN audit log
   */
  async login(input: LoginInput, ipAddress?: string): Promise<AuthSessionResult> {
    const user = await authRepository.findByEmail(input.email);

    if (!user) {
      // Execute dummy compare to prevent timing-based user enumeration
      await dummyComparePassword(input.password);
      throw ApiError.unauthorized("Invalid email or password", "INVALID_CREDENTIALS");
    }

    // Step 2: Check Redis account lockout flag BEFORE bcrypt computation
    const lockoutKey = `lockout:${user.id}`;
    const isLocked = await redis.get(lockoutKey);
    if (isLocked) {
      throw ApiError.unauthorized(
        "Account is temporarily locked due to multiple failed login attempts. Please try again after 30 minutes.",
        "ACCOUNT_LOCKED"
      );
    }

    // Step 3: Check database status
    if (user.status === "LOCKED") {
      throw ApiError.unauthorized(
        "Account is locked. Please contact the portal administrator.",
        "ACCOUNT_LOCKED"
      );
    }
    if (user.status === "INACTIVE") {
      throw ApiError.unauthorized(
        "Account is inactive. Please contact the portal administrator.",
        "ACCOUNT_INACTIVE"
      );
    }

    // Step 4: Compare bcrypt password hash
    const isPasswordValid = await comparePassword(input.password, user.passwordHash);

    if (!isPasswordValid) {
      // Increment failed attempt counter in Redis
      const failedKey = `failed_attempts:${user.id}`;
      const failedAttempts = await redis.incr(failedKey);

      if (failedAttempts === 1) {
        // Set 30-minute expiry on the failure tracking window
        await redis.expire(failedKey, 1800);
      }

      if (failedAttempts >= 5) {
        // Lock account for 30 minutes
        await redis.set(lockoutKey, "locked", "EX", 1800);
        await redis.del(failedKey);

        logger.warn(`Account locked due to 5 consecutive failed attempts: userId=${user.id}`);
        throw ApiError.unauthorized(
          "Account is temporarily locked due to multiple failed login attempts. Please try again after 30 minutes.",
          "ACCOUNT_LOCKED"
        );
      }

      throw ApiError.unauthorized("Invalid email or password", "INVALID_CREDENTIALS");
    }

    // Login successful: reset failed attempt counter
    await redis.del(`failed_attempts:${user.id}`);

    // Update lastLoginAt
    await authRepository.updateLastLogin(user.id);

    // Issue RS256 access token
    const departmentId = resolveDepartmentId(user);
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
      departmentId,
    });

    // Generate & hash refresh token
    const rawRefreshToken = generateRawToken();
    const tokenHash = hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await authRepository.createRefreshToken(user.id, tokenHash, expiresAt);

    // Create LOGIN audit log
    await authRepository.createAuditLog({
      userId: user.id,
      role: user.role,
      action: "LOGIN",
      targetResource: `User:${user.id}`,
      ipAddress,
    });

    return {
      user: toSafeUser(user),
      accessToken,
      rawRefreshToken,
    };
  }

  /**
   * Refresh Token Rotation Flow:
   * 1. Hash incoming cookie token
   * 2. Find record in PostgreSQL
   * 3. Detect token reuse: if already revoked, revoke ALL tokens for user
   * 4. Check expiry
   * 5. Revoke old token & issue new RS256 access token + new refresh token
   */
  async refresh(rawRefreshToken?: string): Promise<RefreshSessionResult> {
    if (!rawRefreshToken) {
      throw ApiError.unauthorized("Refresh token required", "UNAUTHORIZED");
    }

    const tokenHash = hashToken(rawRefreshToken);
    const tokenRecord = await authRepository.findRefreshTokenByHash(tokenHash);

    if (!tokenRecord) {
      throw ApiError.unauthorized("Invalid refresh token", "INVALID_TOKEN");
    }

    // Reuse detection: if token is already revoked, someone may have stolen it
    if (tokenRecord.revokedAt !== null) {
      logger.warn(`Revoked refresh token reuse detected for userId=${tokenRecord.userId}. Revoking all sessions.`);
      await authRepository.revokeAllUserRefreshTokens(tokenRecord.userId);
      throw ApiError.unauthorized(
        "Invalid session state detected. Please log in again.",
        "TOKEN_REVOKED"
      );
    }

    // Check expiry
    if (tokenRecord.expiresAt < new Date()) {
      await authRepository.revokeRefreshToken(tokenRecord.id);
      throw ApiError.unauthorized("Refresh token has expired. Please log in again.", "TOKEN_EXPIRED");
    }

    // Rotate: revoke old token
    await authRepository.revokeRefreshToken(tokenRecord.id);

    // Issue new RS256 access token
    const departmentId = resolveDepartmentId(tokenRecord.user);
    const accessToken = signAccessToken({
      userId: tokenRecord.user.id,
      email: tokenRecord.user.email,
      role: tokenRecord.user.role as UserRole,
      departmentId,
    });

    // Issue and persist new refresh token
    const newRawRefreshToken = generateRawToken();
    const newTokenHash = hashToken(newRawRefreshToken);
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await authRepository.createRefreshToken(
      tokenRecord.user.id,
      newTokenHash,
      newExpiresAt
    );

    return {
      accessToken,
      rawRefreshToken: newRawRefreshToken,
    };
  }

  /**
   * User Logout Flow:
   * 1. Revoke refresh token in database
   * 2. Create LOGOUT audit log
   */
  async logout(
    rawRefreshToken?: string,
    userPayload?: { id: string; role: string },
    ipAddress?: string
  ): Promise<void> {
    if (rawRefreshToken) {
      const tokenHash = hashToken(rawRefreshToken);
      const tokenRecord = await authRepository.findRefreshTokenByHash(tokenHash);
      if (tokenRecord && !tokenRecord.revokedAt) {
        await authRepository.revokeRefreshToken(tokenRecord.id);
      }
    }

    if (userPayload) {
      await authRepository.createAuditLog({
        userId: userPayload.id,
        role: userPayload.role,
        action: "LOGOUT",
        targetResource: `User:${userPayload.id}`,
        ipAddress,
      });
    }
  }

  /**
   * Current Authenticated User profile retrieval
   */
  async getMe(userId: string): Promise<AuthUser> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound("User profile not found", "USER_NOT_FOUND");
    }
    return toSafeUser(user);
  }

  /**
   * Change Password Flow:
   * 1. Verify current password
   * 2. Hash new password with bcrypt 12
   * 3. Invalidate all active refresh sessions
   * 4. Create PASSWORD_CHANGE audit log
   */
  async changePassword(
    userId: string,
    input: ChangePasswordInput,
    ipAddress?: string
  ): Promise<void> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound("User not found", "USER_NOT_FOUND");
    }

    const isCurrentValid = await comparePassword(input.currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      throw ApiError.badRequest("Current password is incorrect", "INVALID_CURRENT_PASSWORD");
    }

    const newHash = await hashPassword(input.newPassword);
    await authRepository.updatePassword(user.id, newHash);

    // Invalidate all active refresh sessions
    await authRepository.revokeAllUserRefreshTokens(user.id);

    // Audit log
    await authRepository.createAuditLog({
      userId: user.id,
      role: user.role,
      action: "PASSWORD_CHANGE",
      targetResource: `User:${user.id}`,
      details: "Password changed by authenticated user",
      ipAddress,
    });
  }

  /**
   * Forgot Password Flow:
   * 1. Validate email & find user
   * 2. Generate 6-digit crypto OTP (crypto.randomInt)
   * 3. Hash OTP before storing in Redis (10m TTL, max 3 attempts)
   * 4. Dispatch transactional email
   * 5. Return generic success message (avoid user enumeration)
   */
  async forgotPassword(input: ForgotPasswordInput): Promise<{ devOtp?: string } | void> {
    const user = await authRepository.findByEmail(input.email);

    if (!user || user.status !== "ACTIVE") {
      // Return safely without leaking account existence
      return;
    }

    // Generate 6-digit cryptographically secure OTP
    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = hashOtp(rawOtp);

    // Store in Redis with 10-minute TTL and attempts counter
    const redisKey = `otp:${user.id}`;
    await redis.set(
      redisKey,
      JSON.stringify({ hashedOtp, attempts: 0 }),
      "EX",
      600 // 10 minutes
    );

    // Send transactional email
    await sendMail({
      to: user.email,
      subject: "Password Reset Verification Code - Srusti Academy",
      text: `Hello ${user.name},\n\nYour 6-digit verification code is: ${rawOtp}\n\nThis code will expire in 10 minutes. If you did not request this, please ignore this email.`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0b2b82; margin-top: 0;">Srusti Academy Portal</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>We received a request to reset your password. Use the verification code below to proceed:</p>
          <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-radius: 6px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #0b2b82;">
            ${rawOtp}
          </div>
          <p style="color: #64748b; font-size: 13px; margin-top: 20px;">
            This verification code is valid for <strong>10 minutes</strong> and can only be used 3 times.
          </p>
        </div>
      `,
    });

    if (process.env.NODE_ENV !== "production") {
      return { devOtp: rawOtp };
    }
  }

  /**
   * Verify OTP Flow:
   * 1. Validate email and check Redis otp:{userId}
   * 2. Enforce 3-attempt limit
   * 3. Compare SHA-256 hash
   */
  async verifyOtp(input: VerifyOtpInput): Promise<{ verified: boolean }> {
    const user = await authRepository.findByEmail(input.email);
    if (!user) {
      throw ApiError.badRequest("Invalid or expired verification code", "INVALID_OTP");
    }

    const redisKey = `otp:${user.id}`;
    const rawData = await redis.get(redisKey);

    if (!rawData) {
      throw ApiError.badRequest(
        "Verification code has expired or does not exist. Please request a new code.",
        "OTP_EXPIRED"
      );
    }

    const { hashedOtp, attempts } = JSON.parse(rawData);

    if (attempts >= 3) {
      await redis.del(redisKey);
      throw ApiError.badRequest(
        "Maximum verification attempts exceeded. Please request a new code.",
        "MAX_OTP_ATTEMPTS"
      );
    }

    const submittedHash = hashOtp(input.otp);

    if (submittedHash !== hashedOtp) {
      const nextAttempts = attempts + 1;
      const ttl = await redis.ttl(redisKey);
      if (nextAttempts >= 3) {
        await redis.del(redisKey);
        throw ApiError.badRequest(
          "Maximum verification attempts exceeded. Please request a new code.",
          "MAX_OTP_ATTEMPTS"
        );
      } else {
        await redis.set(
          redisKey,
          JSON.stringify({ hashedOtp, attempts: nextAttempts }),
          "EX",
          ttl > 0 ? ttl : 600
        );
      }

      throw ApiError.badRequest("Invalid verification code", "INVALID_OTP");
    }

    // Store a temporary verified session flag in Redis (10 minutes)
    await redis.set(`otp_verified:${user.id}`, "verified", "EX", 600);

    return { verified: true };
  }

  /**
   * Reset Password Flow:
   * 1. Validate email & verify OTP or otp_verified flag
   * 2. Hash new password with bcrypt cost 12
   * 3. Update database
   * 4. Invalidate all active refresh sessions
   * 5. Clear Redis OTP keys & write PASSWORD_CHANGE audit log
   */
  async resetPassword(
    input: ResetPasswordInput,
    ipAddress?: string
  ): Promise<void> {
    const user = await authRepository.findByEmail(input.email);
    if (!user) {
      throw ApiError.badRequest("Invalid or expired password reset request", "INVALID_RESET");
    }

    // Verify either direct OTP or pre-verified flag
    const verifiedFlag = await redis.get(`otp_verified:${user.id}`);

    if (!verifiedFlag) {
      // Check direct OTP in Redis
      const redisKey = `otp:${user.id}`;
      const rawData = await redis.get(redisKey);

      if (!rawData) {
        throw ApiError.badRequest(
          "Verification code has expired or is invalid. Please request a new code.",
          "OTP_EXPIRED"
        );
      }

      const { hashedOtp, attempts } = JSON.parse(rawData);

      if (attempts >= 3) {
        await redis.del(redisKey);
        throw ApiError.badRequest(
          "Maximum verification attempts exceeded. Please request a new code.",
          "MAX_OTP_ATTEMPTS"
        );
      }

      const submittedHash = hashOtp(input.otp);
      if (submittedHash !== hashedOtp) {
        const nextAttempts = attempts + 1;
        const ttl = await redis.ttl(redisKey);
        if (nextAttempts >= 3) {
          await redis.del(redisKey);
          throw ApiError.badRequest(
            "Maximum verification attempts exceeded. Please request a new code.",
            "MAX_OTP_ATTEMPTS"
          );
        } else {
          await redis.set(
            redisKey,
            JSON.stringify({ hashedOtp, attempts: nextAttempts }),
            "EX",
            ttl > 0 ? ttl : 600
          );
        }
        throw ApiError.badRequest("Invalid verification code", "INVALID_OTP");
      }
    }

    // Hash new password with bcrypt 12
    const newHash = await hashPassword(input.newPassword);
    await authRepository.updatePassword(user.id, newHash);

    // Invalidate all active refresh sessions
    await authRepository.revokeAllUserRefreshTokens(user.id);

    // Clean up Redis OTP keys
    await redis.del(`otp:${user.id}`);
    await redis.del(`otp_verified:${user.id}`);

    // Audit log
    await authRepository.createAuditLog({
      userId: user.id,
      role: user.role,
      action: "PASSWORD_CHANGE",
      targetResource: `User:${user.id}`,
      details: "Password reset via verified OTP",
      ipAddress,
    });
  }
}

export const authService = new AuthService();
