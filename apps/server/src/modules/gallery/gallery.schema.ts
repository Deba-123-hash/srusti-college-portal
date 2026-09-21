// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Gallery Module Validation Schemas
// =============================================================================

import { z } from "zod";

export const createGallerySchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(100),
  category: z.enum(["EVENTS", "CAMPUS", "CULTURAL", "SPORTS"]),
  imageUrl: z.string().trim().optional(),
  caption: z.string().trim().max(500).optional().nullable(),
});

export const updateGallerySchema = createGallerySchema.partial();

export const galleryParamsSchema = z.object({
  id: z.string().trim().min(1, "Gallery Item ID is required"),
});

export const galleryQuerySchema = z.object({
  category: z.enum(["EVENTS", "CAMPUS", "CULTURAL", "SPORTS"]).optional(),
  search: z.string().trim().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});
