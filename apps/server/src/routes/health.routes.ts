// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Health & Readiness Probes
// =============================================================================

import { Router, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../lib/prisma";
import { redis, isRedisConnected } from "../lib/redis";
import { logger } from "../lib/logger";

const router = Router();

/**
 * Liveness Probe: GET /api/v1/health
 * Simple check that the Express event loop is responsive.
 */
router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: {
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
      message: "API is healthy",
    });
  })
);

/**
 * Readiness Probe: GET /api/v1/health/ready
 * Checks deep readiness including database connectivity and redis caching status.
 */
router.get(
  "/ready",
  asyncHandler(async (_req: Request, res: Response) => {
    let dbStatus = "disconnected";
    let redisStatus = "disconnected";
    let isReady = true;

    // 1. Probe PostgreSQL via Prisma
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = "connected";
    } catch (err: any) {
      dbStatus = "error";
      isReady = false;
      logger.warn("Readiness probe: Database unreachable", {
        context: "Health",
        error: err?.message || err,
      });
    }

    // 2. Probe Redis
    try {
      if (isRedisConnected && redis.status === "ready") {
        await redis.ping();
        redisStatus = "connected";
      } else {
        redisStatus = "disconnected";
      }
    } catch (err: any) {
      redisStatus = "error";
      logger.warn("Readiness probe: Redis ping failed", {
        context: "Health",
        error: err?.message || err,
      });
    }

    const payload = {
      status: isReady ? "ready" : "degraded",
      timestamp: new Date().toISOString(),
      database: dbStatus,
      redis: redisStatus,
    };

    if (!isReady) {
      return res.status(503).json({
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Core services are not ready to accept traffic.",
          details: payload,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: payload,
      message: "Service is ready",
    });
  })
);

export const healthRoutes = router;
