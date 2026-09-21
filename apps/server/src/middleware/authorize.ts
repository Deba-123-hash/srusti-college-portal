// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Role-Based Access Control (RBAC) Authorization Middleware
// =============================================================================

import { Request, Response, NextFunction } from "express";
import { UserRole } from "@srusti/shared";
import { ApiError } from "../utils/ApiError";

/**
 * Reusable RBAC authorization middleware.
 * Verifies that the authenticated user possesses one of the allowed roles.
 * Must run after authenticate middleware.
 *
 * Usage:
 *   authorize("SUPER_ADMIN")
 *   authorize("SUPER_ADMIN", "DEPT_ADMIN")
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(
        ApiError.unauthorized("Authentication required", "UNAUTHORIZED")
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          "Access denied: you do not have permission to perform this action",
          "FORBIDDEN"
        )
      );
    }

    next();
  };
}
