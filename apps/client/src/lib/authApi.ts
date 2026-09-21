// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Dedicated Authentication API Service Layer
// =============================================================================

import { api } from "./api";
import {
  LoginInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  VerifyOtpInput,
  ResetPasswordInput,
  AuthUser,
  ApiResponse,
  LoginResponseData,
  RefreshResponseData,
} from "@srusti/shared";

let activeRefreshPromise: Promise<RefreshResponseData> | null = null;

export const authApi = {
  /**
   * Log in user and receive in-memory access token + httpOnly refresh cookie
   */
  login: async (credentials: LoginInput): Promise<LoginResponseData> => {
    const res = await api.post<ApiResponse<LoginResponseData>>(
      "/auth/login",
      credentials
    );
    return res.data.data;
  },

  /**
   * Log out user and revoke active refresh token session on backend
   */
  logout: async (): Promise<void> => {
    try {
      await api.post<ApiResponse<null>>("/auth/logout");
    } catch {
      // Ignore failure on logout to ensure local auth state is wiped
    }
  },

  /**
   * Silent token refresh using backend-managed httpOnly cookie
   */
  refresh: async (): Promise<RefreshResponseData> => {
    if (activeRefreshPromise) {
      return activeRefreshPromise;
    }
    activeRefreshPromise = (async () => {
      try {
        const res = await api.post<ApiResponse<RefreshResponseData>>("/auth/refresh");
        return res.data.data;
      } finally {
        activeRefreshPromise = null;
      }
    })();
    return activeRefreshPromise;
  },

  /**
   * Retrieve currently authenticated user profile
   */
  getCurrentUser: async (token?: string): Promise<AuthUser> => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
    const res = await api.get<ApiResponse<AuthUser>>("/auth/me", config);
    return res.data.data;
  },

  /**
   * Change password for logged-in user
   */
  changePassword: async (data: ChangePasswordInput): Promise<void> => {
    await api.post<ApiResponse<null>>("/auth/change-password", data);
  },

  /**
   * Request 6-digit OTP for password recovery
   */
  forgotPassword: async (data: ForgotPasswordInput): Promise<void> => {
    await api.post<ApiResponse<null>>("/auth/forgot-password", data);
  },

  /**
   * Verify recovery OTP code
   */
  verifyOtp: async (data: VerifyOtpInput): Promise<void> => {
    await api.post<ApiResponse<null>>("/auth/verify-otp", data);
  },

  /**
   * Reset password using verified OTP code
   */
  resetPassword: async (data: ResetPasswordInput): Promise<void> => {
    await api.post<ApiResponse<null>>("/auth/reset-password", data);
  },
};

export default authApi;
