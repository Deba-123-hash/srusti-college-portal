// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Notifications Module Repository (Prisma Data Access)
// =============================================================================

import { prisma } from "../../lib/prisma";
import { Prisma } from "@prisma/client";

export class NotificationsRepository {
  async findMany(params: {
    where: Prisma.NotificationWhereInput;
    skip: number;
    take: number;
  }) {
    return prisma.notification.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
  }

  async count(where: Prisma.NotificationWhereInput) {
    return prisma.notification.count({ where });
  }

  async findById(id: string) {
    return prisma.notification.findUnique({
      where: { id },
    });
  }

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  async countUnread(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }
}

export const notificationsRepository = new NotificationsRepository();
