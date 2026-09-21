// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Centralized Error Handling Middleware
// =============================================================================

import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";
import { logger } from "../lib/logger";
import { env } from "../config/env";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let code = "INTERNAL_SERVER_ERROR";
  let message = "An unexpected error occurred. Please try again later.";
  let details: any = null;

  // 1. Handled ApiError instances
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details ?? null;
  }
  // 2. Zod validation errors
  else if (err instanceof ZodError || err?.name === "ZodError") {
    statusCode = 400;
    code = "VALIDATION_ERROR";
    message = "Request validation failed.";
    details = err.errors?.map((e: any) => ({
      field: e.path.join("."),
      message: e.message,
      code: e.code,
    })) || null;
  }
  // 3. Body-parser JSON syntax errors
  else if (
    (err instanceof SyntaxError && "body" in err) ||
    err?.type === "entity.parse.failed"
  ) {
    statusCode = 400;
    code = "MALFORMED_JSON";
    message = "Invalid JSON payload provided in request body.";
    details = null;
  }
  // 4. CORS rejection
  else if (
    err?.message?.includes("CORS") ||
    err?.name === "CorsError" ||
    err?.code === "CORS_NOT_ALLOWED"
  ) {
    statusCode = 403;
    code = "CORS_NOT_ALLOWED";
    message = err.message || "Origin not allowed by CORS policy.";
    details = null;
  }
  // 5. Prisma ORM errors
  else if (typeof err?.code === "string" && err.code.startsWith("P")) {
    switch (err.code) {
      case "P2002": {
        statusCode = 409;
        code = "CONFLICT";
        const fields = (err.meta?.target as string[]) || [];
        message = fields.length
          ? `Unique constraint violation on field: ${fields.join(", ")}`
          : "A record with this unique identifier already exists.";
        details = fields.length ? { fields } : null;
        break;
      }
      case "P2025": {
        statusCode = 404;
        code = "RESOURCE_NOT_FOUND";
        message = (err.meta?.cause as string) || "The requested record was not found.";
        details = null;
        break;
      }
      case "P2003": {
        statusCode = 400;
        code = "BAD_REQUEST";
        message = "Foreign key constraint failed.";
        details = null;
        break;
      }
      default: {
        statusCode = 500;
        code = "DATABASE_ERROR";
        message =
          env.NODE_ENV === "production"
            ? "A database error occurred."
            : err.message || "Prisma query failed.";
        details = null;
        break;
      }
    }
  }
  // 6. Generic Error with a status code
  else if (typeof err?.statusCode === "number" || typeof err?.status === "number") {
    statusCode = err.statusCode || err.status;
    code = err.code || "REQUEST_FAILED";
    message = err.message || "Request failed.";
    details = err.details || null;
  }
  // 7. Generic Error
  else if (err instanceof Error) {
    message =
      env.NODE_ENV === "production"
        ? "An unexpected error occurred. Please try again later."
        : err.message;
    details = env.NODE_ENV === "development" ? { stack: err.stack } : null;
  }

  // Structured Logging
  const logData = {
    statusCode,
    code,
    path: req.originalUrl,
    method: req.method,
    requestId: req.id,
    ip: req.ip || req.socket.remoteAddress,
  };

  if (statusCode >= 500) {
    logger.error(`[${statusCode}] ${code} - ${message}`, {
      ...logData,
      stack: err?.stack,
      rawError: err,
    });
  } else {
    logger.warn(`[${statusCode}] ${code} - ${message}`, logData);
  }

  // Ensure response has not already been sent
  if (res.headersSent) {
    return;
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
    },
  });
}
