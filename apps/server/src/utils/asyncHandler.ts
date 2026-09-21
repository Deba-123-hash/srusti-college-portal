// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Async Controller & Middleware Wrapper
// =============================================================================

import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

/**
 * Wraps an async route handler to catch any rejected promises and pass the error to next().
 * Eliminates repetitive try/catch blocks across controllers.
 */
export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
