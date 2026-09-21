// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Standardized 404 Unmatched Route Middleware
// =============================================================================

import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

/**
 * Catches any unhandled routes at the end of the middleware chain
 * and generates a standardized ROUTE_NOT_FOUND ApiError.
 */
export function notFoundHandler(
  _req: Request,
  _res: Response,
  next: NextFunction
): void {
  next(
    new ApiError(
      404,
      "The requested endpoint does not exist.",
      "ROUTE_NOT_FOUND"
    )
  );
}
