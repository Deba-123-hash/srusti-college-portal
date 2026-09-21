// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Request ID & Correlation Tracking Middleware
// =============================================================================

import { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";

// Augment Express Request interface with correlation identifiers
declare global {
  namespace Express {
    interface Request {
      id?: string;
      requestId?: string;
    }
  }
}

/**
 * Middleware that extracts or generates a unique correlation ID (UUIDv4) for every request.
 * Sets the ID on the request object and exposes it on the response X-Request-ID header.
 */
export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const incomingId = req.header("x-request-id");
  const requestId =
    incomingId && incomingId.trim().length > 0 && incomingId.length <= 64
      ? incomingId.trim()
      : randomUUID();

  req.id = requestId;
  req.requestId = requestId;

  res.setHeader("X-Request-ID", requestId);

  next();
}
