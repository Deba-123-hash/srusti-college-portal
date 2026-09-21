// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Announcements Module Validation Schemas
// =============================================================================

import { z } from "zod";

export const createAnnouncementSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(150),
  content: z.string().trim().min(5, "Content must be at least 5 characters"),
  category: z.string().trim().min(2).max(50).optional().default("General"),
  isPinned: z.boolean().optional().default(false),
  expiresAt: z.string().trim().optional().nullable(),
});

export const updateAnnouncementSchema = createAnnouncementSchema.partial();

export const announcementParamsSchema = z.object({
  id: z.string().trim().min(1, "Announcement ID is required"),
});

export const announcementQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  pinnedOnly: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? val === "true" : undefined)),
  includeExpired: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? val === "true" : undefined)),
  page: z.string().optional(),
  limit: z.string().optional(),
});
