// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Shared Auth Validation Schemas & Types
// =============================================================================

import { z } from "zod";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const UserRoleEnum = z.enum([
  "SUPER_ADMIN",
  "DEPT_ADMIN",
  "FACULTY",
  "STUDENT",
]);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const UserStatusEnum = z.enum(["ACTIVE", "INACTIVE", "LOCKED"]);
export type UserStatus = z.infer<typeof UserStatusEnum>;

// ---------------------------------------------------------------------------
// Common Regex / Field Schemas
// ---------------------------------------------------------------------------

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address format")
  .trim()
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must not exceed 100 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~])/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  );

export const otpSchema = z
  .string()
  .length(6, "OTP must be exactly 6 digits")
  .regex(/^\d{6}$/, "OTP must consist of digits only");

// ---------------------------------------------------------------------------
// Request Schemas
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password do not match",
    path: ["confirmPassword"],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export const resetPasswordSchema = z
  .object({
    email: emailSchema,
    otp: otpSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password do not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ---------------------------------------------------------------------------
// Safe User & Token Interfaces
// ---------------------------------------------------------------------------

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  departmentId?: string | null;
  lastLoginAt?: string | Date | null;
}

export interface JwtAccessTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  departmentId?: string | null;
  iat?: number;
  exp?: number;
}

export interface LoginResponseData {
  user: AuthUser;
  accessToken: string;
}

export interface RefreshResponseData {
  accessToken: string;
}
