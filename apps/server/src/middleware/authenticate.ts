// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// JWT Authentication Middleware (RS256 Bearer Token Verification)
// =============================================================================

import { Request, Response, NextFunction } from "express";
import { UserRole } from "@srusti/shared";
import { verifyAccessToken } from "../lib/jwt";
import { ApiError } from "../utils/ApiError";

export interface AuthenticatedUserPayload {
  id: string;
  email: string;
  role: UserRole;
  departmentId?: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserPayload;
    }
  }
}

/**
 * Middleware that validates the RS256 Bearer access token from Authorization header.
 * Attaches decoded user payload to req.user.
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Authentication token required", "UNAUTHORIZED"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(ApiError.unauthorized("Malformed authorization header", "UNAUTHORIZED"));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      departmentId: payload.departmentId,
    };
    next();
  } catch (error) {
    next(error);
  }
}
