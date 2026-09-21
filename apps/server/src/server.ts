// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// HTTP Server Entrypoint & Lifecycle Management
// =============================================================================

import express from "express";
import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { connectPrisma, disconnectPrisma } from "./lib/prisma";
import { connectRedis, disconnectRedis } from "./lib/redis";
import { healthRoutes } from "./routes/health.routes";

let isShuttingDown = false;

// Bind to 0.0.0.0 for network interface listener compatibility
const HOST = "0.0.0.0";
const PORT = env.PORT;
const HEALTH_PORT = env.HEALTH_PORT;

// Dedicated healthcheck express server
const healthApp = express();
healthApp.use("/api/v1/health", healthRoutes);
healthApp.use("/health", healthRoutes);
healthApp.use("/", healthRoutes);

const healthServer = healthApp.listen(HEALTH_PORT, HOST, () => {
  logger.info(
    `🏥 Dedicated Healthcheck Server listening on http://${HOST}:${HEALTH_PORT}/health`,
    {
      context: "HealthServer",
      port: HEALTH_PORT,
    }
  );
  logger.info(`Dedicated Readiness check: http://localhost:${HEALTH_PORT}/health/ready`, {
    context: "HealthServer",
  });
});

const server = app.listen(PORT, HOST, async () => {
  logger.info(
    `🚀 Srusti Academy College Portal API listening on http://${HOST}:${PORT}`,
    {
      context: "Server",
      port: PORT,
      environment: env.NODE_ENV,
    }
  );
  logger.info(`Health check: http://localhost:${PORT}/api/v1/health`, {
    context: "Server",
  });
  logger.info(`Readiness check: http://localhost:${PORT}/api/v1/health/ready`, {
    context: "Server",
  });

  // Connect infrastructure clients asynchronously
  try {
    await connectPrisma();
  } catch (err: any) {
    logger.warn(
      `Database connection failed at startup: ${err?.message || err}. Will retry via connection pool when needed.`,
      { context: "Startup" }
    );
  }

  try {
    await connectRedis();
  } catch (err: any) {
    logger.warn(
      `Redis connection failed at startup: ${err?.message || err}. Continuing without caching.`,
      { context: "Startup" }
    );
  }
});

/**
 * Idempotent graceful shutdown procedure.
 */
async function gracefulShutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    logger.warn(`Shutdown already in progress. Ignoring additional signal: ${signal}`, {
      context: "Server",
    });
    return;
  }
  isShuttingDown = true;

  logger.info(`${signal} received. Initiating graceful shutdown...`, {
    context: "Server",
    signal,
  });

  // Force termination if clean shutdown takes longer than 10 seconds
  const forceShutdownTimer = setTimeout(() => {
    logger.error("Graceful shutdown timed out (10s). Forcing process exit.", {
      context: "Server",
    });
    process.exit(1);
  }, 10000);

  // Prevent timeout timer from keeping Node event loop open if everything finishes early
  forceShutdownTimer.unref();

  // 1. Stop accepting new HTTP connections on health server
  healthServer.close((err) => {
    if (err) {
      logger.error("Error while closing health server", {
        context: "HealthServer",
        error: err?.message || err,
      });
    } else {
      logger.info("Health server closed to new connections.", { context: "HealthServer" });
    }
  });

  // 2. Stop accepting new HTTP connections on primary API server
  server.close(async (err) => {
    if (err) {
      logger.error("Error while closing HTTP server", {
        context: "Server",
        error: err?.message || err,
      });
    } else {
      logger.info("HTTP server closed to new connections.", { context: "Server" });
    }

    // 3. Disconnect Prisma
    await disconnectPrisma();

    // 4. Disconnect Redis
    await disconnectRedis();

    logger.info("Graceful shutdown completed successfully. Process exiting.", {
      context: "Server",
    });
    process.exit(0);
  });
}

// OS Signal handlers
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Process error handlers
process.on("unhandledRejection", (reason: any) => {
  logger.error("Unhandled Promise Rejection caught at process level", {
    context: "Process",
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
  });
});

process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception caught at process level", {
    context: "Process",
    error: error.message,
    stack: error.stack,
  });
  // As per Node.js best practices, exit on uncaughtException after logging
  gracefulShutdown("uncaughtException").finally(() => {
    process.exit(1);
  });
});

export default server;
