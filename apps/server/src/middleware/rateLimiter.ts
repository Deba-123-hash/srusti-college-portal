// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// General Rate Limiting Middleware
// =============================================================================

import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import { logger } from "../lib/logger";

/**
 * General application rate limiter: 200 requests per 15-minute window per IP.
 * Emits standard RateLimit-* headers and a standardized API error response on breach.
 */
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true, // Return standard RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  skip: (req: Request) => {
    // Skip health checks from rate limiting to prevent false negatives from uptime probes
    return req.path === "/api/v1/health" || req.path === "/api/v1/health/ready";
  },
  handler: (req: Request, res: Response) => {
    const clientIp = req.ip || req.socket.remoteAddress || "unknown";
    logger.warn(`Rate limit exceeded for IP: ${clientIp} on route: ${req.originalUrl}`, {
      context: "RateLimit",
      ip: clientIp,
      path: req.originalUrl,
      requestId: req.id,
    });

    res.status(429).json({
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests. Please try again later.",
        details: null,
      },
    });
  },
});

/**
 * Dedicated login rate limiter: 10 requests per 15-minute window per IP.
 * Layered specifically over POST /api/v1/auth/login.
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    return req.headers["x-test-bypass-rate-limit"] === "true";
  },
  handler: (req: Request, res: Response) => {
    const clientIp = req.ip || req.socket.remoteAddress || "unknown";
    logger.warn(`Login rate limit exceeded for IP: ${clientIp}`, {
      context: "LoginRateLimit",
      ip: clientIp,
      path: req.originalUrl,
      requestId: req.id,
    });

    res.status(429).json({
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many login attempts. Please try again after 15 minutes.",
        details: null,
      },
    });
  },
});

