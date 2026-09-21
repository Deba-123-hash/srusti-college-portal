// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Auth Module Types & Interfaces
// =============================================================================

import {
  AuthUser,
  LoginInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  VerifyOtpInput,
  ResetPasswordInput,
} from "@srusti/shared";

export type {
  LoginInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  VerifyOtpInput,
  ResetPasswordInput,
};

export interface AuthSessionResult {
  user: AuthUser;
  accessToken: string;
  rawRefreshToken: string;
}

export interface RefreshSessionResult {
  accessToken: string;
  rawRefreshToken: string;
}
