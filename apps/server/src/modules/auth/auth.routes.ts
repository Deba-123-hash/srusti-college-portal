// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Auth Module Routes
// =============================================================================

import { Router } from "express";
import { authController } from "./auth.controller";
import {
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from "./auth.schema";
import { validateBody } from "../../middleware/validate";
import { authenticate } from "../../middleware/authenticate";
import { loginRateLimiter } from "../../middleware/rateLimiter";

const router = Router();

// Public routes
router.post(
  "/login",
  loginRateLimiter,
  validateBody(loginSchema),
  authController.login
);

router.post("/refresh", authController.refresh);

router.post("/logout", authController.logout);

router.post(
  "/forgot-password",
  validateBody(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  "/verify-otp",
  validateBody(verifyOtpSchema),
  authController.verifyOtp
);

router.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  authController.resetPassword
);

// Protected routes (require valid RS256 Bearer access token)
router.get("/me", authenticate, authController.getMe);

router.post(
  "/change-password",
  authenticate,
  validateBody(changePasswordSchema),
  authController.changePassword
);

export const authRoutes = router;
