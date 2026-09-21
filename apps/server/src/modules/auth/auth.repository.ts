// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Auth Module Repository (Prisma Data Access)
// =============================================================================

import { prisma } from "../../lib/prisma";

export class AuthRepository {
  /**
   * Find a user by email, including related profile records for department resolution.
   */
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        adminProfile: true,
        faculty: true,
        student: true,
      },
    });
  }

  /**
   * Find a user by ID, including related profile records.
   */
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        adminProfile: true,
        faculty: true,
        student: true,
      },
    });
  }

  /**
   * Update the user's last login timestamp.
   */
  async updateLastLogin(id: string) {
    return prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  /**
   * Update the user's hashed password.
   */
  async updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }

  /**
   * Store a new hashed refresh token.
   */
  async createRefreshToken(userId: string, tokenHash: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  /**
   * Find a refresh token record by its SHA-256 hash.
   */
  async findRefreshTokenByHash(tokenHash: string) {
    return prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: {
            adminProfile: true,
            faculty: true,
            student: true,
          },
        },
      },
    });
  }

  /**
   * Revoke a single refresh token.
   */
  async revokeRefreshToken(id: string) {
    return prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Revoke all active refresh tokens for a user (used upon password change/reset).
   */
  async revokeAllUserRefreshTokens(userId: string) {
    return prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Append-only audit logging for security events.
   * Never stores sensitive fields, passwords, or tokens.
   */
  async createAuditLog(data: {
    userId?: string;
    role: string;
    action: string;
    targetResource: string;
    details?: string;
    ipAddress?: string;
  }) {
    return prisma.auditLog.create({
      data: {
        userId: data.userId || null,
        role: data.role,
        action: data.action,
        targetResource: data.targetResource,
        details: data.details || null,
        ipAddress: data.ipAddress || null,
      },
    });
  }
}

export const authRepository = new AuthRepository();
