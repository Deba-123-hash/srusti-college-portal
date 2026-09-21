// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Notifications API Service Layer
// =============================================================================

import { api } from "../lib/api";
import { ApiResponse, PaginationMeta } from "@srusti/shared";

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationQueryParams {
  unreadOnly?: boolean;
  page?: number;
  limit?: number;
}

export const notificationsApi = {
  getMyNotifications: async (params?: NotificationQueryParams): Promise<{ data: NotificationItem[]; meta?: PaginationMeta }> => {
    const res = await api.get<ApiResponse<NotificationItem[]>>("/notifications", { params });
    return {
      data: res.data.data,
      meta: res.data.meta,
    };
  },

  markAsRead: async (id: string): Promise<NotificationItem> => {
    const res = await api.patch<ApiResponse<NotificationItem>>(`/notifications/${id}/read`);
    return res.data.data;
  },

  markAllAsRead: async (): Promise<{ updatedCount: number }> => {
    const res = await api.patch<ApiResponse<{ updatedCount: number }>>("/notifications/read-all");
    return res.data.data;
  },
};

export default notificationsApi;
