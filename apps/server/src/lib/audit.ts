// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Centralized Audit Logging Service
// =============================================================================

import { prisma } from "./prisma";
import { logger } from "./logger";

export interface CreateAuditLogParams {
  userId?: string | null;
  role: string;
  action: string;
  targetResource: string;
  details?: string | null;
  ipAddress?: string | null;
}

/**
 * Creates an append-only audit log entry for security and administrative compliance.
 * Never throws an unhandled error so it does not block the primary operation,
 * but logs errors if the audit write fails.
 */
export async function logAuditEvent(params: CreateAuditLogParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        role: params.role,
        action: params.action,
        targetResource: params.targetResource,
        details: params.details || null,
        ipAddress: params.ipAddress || null,
      },
    });
  } catch (error) {
    logger.error("Failed to write audit log entry:", {
      error,
      params,
    });
  }
}
