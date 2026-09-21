// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Gallery Module Types
// =============================================================================

import { GalleryCategory } from "@prisma/client";

export interface CreateGalleryItemDto {
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  caption?: string | null;
}

export interface UpdateGalleryItemDto {
  title?: string;
  category?: GalleryCategory;
  imageUrl?: string;
  caption?: string | null;
}

export interface GalleryFilterParams {
  category?: GalleryCategory;
  search?: string;
  page?: number;
  limit?: number;
}
