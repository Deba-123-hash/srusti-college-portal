// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Gallery API Service Layer
// =============================================================================

import { api } from "../lib/api";
import { ApiResponse, PaginationMeta } from "@srusti/shared";

export type GalleryCategory = "CAMPUS" | "EVENTS" | "CULTURAL" | "SPORTS";

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  caption?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryQueryParams {
  category?: GalleryCategory | string;
  page?: number | string;
  limit?: number | string;
}

export const galleryApi = {
  getGallery: async (
    params?: GalleryQueryParams
  ): Promise<{ data: GalleryItem[]; meta?: PaginationMeta }> => {
    const res = await api.get<ApiResponse<GalleryItem[]>>("/gallery", {
      params,
    });
    return {
      data: res.data.data,
      meta: res.data.meta,
    };
  },

  getGalleryById: async (id: string): Promise<GalleryItem> => {
    const res = await api.get<ApiResponse<GalleryItem>>(`/gallery/${id}`);
    return res.data.data;
  },
};

export default galleryApi;
