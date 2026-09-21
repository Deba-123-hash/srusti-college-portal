// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Request Validation Middleware (Zod)
// =============================================================================

import { Request, Response, NextFunction } from "express";
import { ZodTypeAny, ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

function formatZodIssues(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

/**
 * Validates request body against a Zod schema.
 */
export function validateBody(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = formatZodIssues(error);
        return next(
          ApiError.unprocessable(
            issues[0]?.message || "Request body validation failed",
            "VALIDATION_ERROR",
            issues
          )
        );
      }
      next(error);
    }
  };
}

/**
 * Validates request query parameters against a Zod schema.
 */
export function validateQuery(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = formatZodIssues(error);
        return next(
          ApiError.unprocessable(
            issues[0]?.message || "Request query validation failed",
            "VALIDATION_ERROR",
            issues
          )
        );
      }
      next(error);
    }
  };
}

/**
 * Validates request route parameters against a Zod schema.
 */
export function validateParams(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = formatZodIssues(error);
        return next(
          ApiError.unprocessable(
            issues[0]?.message || "Request parameters validation failed",
            "VALIDATION_ERROR",
            issues
          )
        );
      }
      next(error);
    }
  };
}

/**
 * Unified request validator for body, query, and params.
 */
export function validateRequest(schemas: {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as any;
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as any;
      }
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = formatZodIssues(error);
        return next(
          ApiError.unprocessable(
            issues[0]?.message || "Validation failed",
            "VALIDATION_ERROR",
            issues
          )
        );
      }
      next(error);
    }
  };
}
