// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Prisma Client Singleton & Lifecycle Management
// =============================================================================

import { PrismaClient } from "@prisma/client";
import { env } from "../config/env";
import { logger } from "./logger";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development"
        ? [
            { emit: "event", level: "query" },
            { emit: "stdout", level: "error" },
            { emit: "stdout", level: "warn" },
          ]
        : [{ emit: "stdout", level: "error" }],
  });

if (env.NODE_ENV === "development") {
  globalForPrisma.prisma = prisma;

  // Optional: log queries in verbose debug mode if desired
  (prisma as any).$on?.("query", (e: any) => {
    logger.debug(`Prisma Query: ${e.query} [Params: ${e.params}] [Duration: ${e.duration}ms]`, {
      context: "Prisma",
    });
  });
}

/**
 * Verifies database connectivity.
 */
export async function connectPrisma(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info("Successfully connected to PostgreSQL database via Prisma.", {
      context: "Database",
    });
  } catch (error: any) {
    logger.error("Failed to connect to PostgreSQL database via Prisma", {
      context: "Database",
      error: error?.message || error,
    });
    throw error;
  }
}

/**
 * Safely disconnects the Prisma client during graceful shutdown.
 */
export async function disconnectPrisma(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info("Disconnected Prisma client from PostgreSQL database.", {
      context: "Database",
    });
  } catch (error: any) {
    logger.error("Error disconnecting Prisma client", {
      context: "Database",
      error: error?.message || error,
    });
  }
}
