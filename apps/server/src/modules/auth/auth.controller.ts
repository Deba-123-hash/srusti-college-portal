// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Auth Module Controller
// =============================================================================

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { authService } from "./auth.service";
import { isProduction } from "../../config/env";

const REFRESH_COOKIE_NAME = "refreshToken";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/api/v1/auth",
};

export class AuthController {
  /**
   * POST /api/v1/auth/login
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body, req.ip);

    res.cookie(REFRESH_COOKIE_NAME, result.rawRefreshToken, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
      message: "Login successful",
    });
  });

  /**
   * POST /api/v1/auth/refresh
   */
  refresh = asyncHandler(async (req: Request, res: Response) => {
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    const result = await authService.refresh(rawRefreshToken);

    res.cookie(REFRESH_COOKIE_NAME, result.rawRefreshToken, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
      },
      message: "Access token refreshed successfully",
    });
  });

  /**
   * POST /api/v1/auth/logout
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    await authService.logout(rawRefreshToken, req.user, req.ip);

    res.clearCookie(REFRESH_COOKIE_NAME, {
      ...COOKIE_OPTIONS,
      maxAge: 0,
    });

    res.status(200).json({
      success: true,
      data: null,
      message: "Logged out successfully",
    });
  });

  /**
   * GET /api/v1/auth/me
   */
  getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getMe(req.user!.id);

    res.status(200).json({
      success: true,
      data: user,
      message: "Authenticated user profile retrieved",
    });
  });

  /**
   * POST /api/v1/auth/change-password
   */
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    await authService.changePassword(req.user!.id, req.body, req.ip);

    // Clear refresh cookie so client re-authenticates
    res.clearCookie(REFRESH_COOKIE_NAME, {
      ...COOKIE_OPTIONS,
      maxAge: 0,
    });

    res.status(200).json({
      success: true,
      data: null,
      message: "Password changed successfully. Please log in with your new password.",
    });
  });

  /**
   * POST /api/v1/auth/forgot-password
   */
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.forgotPassword(req.body);

    res.status(200).json({
      success: true,
      data: result?.devOtp ? { devOtp: result.devOtp } : null,
      message:
        "If an account with that email exists, a password reset verification code has been dispatched.",
    });
  });

  /**
   * POST /api/v1/auth/verify-otp
   */
  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.verifyOtp(req.body);

    res.status(200).json({
      success: true,
      data: result,
      message: "Verification code successfully verified",
    });
  });

  /**
   * POST /api/v1/auth/reset-password
   */
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    await authService.resetPassword(req.body, req.ip);

    res.clearCookie(REFRESH_COOKIE_NAME, {
      ...COOKIE_OPTIONS,
      maxAge: 0,
    });

    res.status(200).json({
      success: true,
      data: null,
      message: "Password reset successfully. You may now log in with your new password.",
    });
  });
}

export const authController = new AuthController();
