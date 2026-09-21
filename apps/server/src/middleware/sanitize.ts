// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Prototype Pollution Defense & Request Sanitization Middleware
// =============================================================================

import { Request, Response, NextFunction } from "express";

const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Recursively cleans an object to strip prototype pollution vectors.
 */
function cleanObject(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = cleanObject(obj[i]);
    }
    return obj;
  }

  for (const key of Object.keys(obj)) {
    if (DANGEROUS_KEYS.has(key)) {
      delete obj[key];
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      obj[key] = cleanObject(obj[key]);
    }
  }

  return obj;
}

/**
 * Middleware that defends against prototype pollution by sanitizing
 * req.body, req.query, and req.params in-place.
 */
export function sanitizeMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (req.body && typeof req.body === "object") {
    cleanObject(req.body);
  }
  if (req.query && typeof req.query === "object") {
    cleanObject(req.query);
  }
  if (req.params && typeof req.params === "object") {
    cleanObject(req.params);
  }
  next();
}
