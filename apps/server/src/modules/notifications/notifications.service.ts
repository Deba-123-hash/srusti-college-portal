// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Notifications Module Service (User Isolation & Notification Management)
// =============================================================================

import { notificationsRepository } from "./notifications.repository";
import { NotificationFilterParams } from "./notifications.types";
import { parsePagination, buildPaginationMeta } from "../../utils/pagination";
import { ApiError } from "../../utils/ApiError";
import { Prisma } from "@prisma/client";

export class NotificationsService {
  async getMyNotifications(query: NotificationFilterParams, userId: string) {
    const { page, limit, skip, take } = parsePagination(query);

    // Strict user isolation
    const where: Prisma.NotificationWhereInput = {
      userId,
    };

    if (query.unreadOnly) {
      where.isRead = false;
    }

    const [items, total, unreadCount] = await Promise.all([
      notificationsRepository.findMany({ where, skip, take }),
      notificationsRepository.count(where),
      notificationsRepository.countUnread(userId),
    ]);

    return {
      items,
      unreadCount,
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async markAsRead(id: string, userId: string) {
    const notification = await notificationsRepository.findById(id);
    if (!notification || notification.userId !== userId) {
      throw ApiError.notFound("Notification not found", "NOTIFICATION_NOT_FOUND");
    }

    return notificationsRepository.markAsRead(id);
  }

  async markAllAsRead(userId: string) {
    const result = await notificationsRepository.markAllAsRead(userId);
    return {
      updatedCount: result.count,
    };
  }
}

export const notificationsService = new NotificationsService();
