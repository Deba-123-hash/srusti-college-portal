// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Announcements API Service Layer
// =============================================================================

import { api } from "../lib/api";
import { ApiResponse, PaginationMeta } from "@srusti/shared";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementsQueryParams {
  category?: string;
  search?: string;
  page?: number | string;
  limit?: number | string;
}

export const announcementsApi = {
  getAnnouncements: async (
    params?: AnnouncementsQueryParams
  ): Promise<{ data: Announcement[]; meta?: PaginationMeta }> => {
    const res = await api.get<ApiResponse<Announcement[]>>("/announcements", {
      params,
    });
    return {
      data: res.data.data,
      meta: res.data.meta,
    };
  },

  getAnnouncementById: async (id: string): Promise<Announcement> => {
    const res = await api.get<ApiResponse<Announcement>>(`/announcements/${id}`);
    return res.data.data;
  },
};

export default announcementsApi;
