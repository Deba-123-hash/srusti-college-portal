// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Events Module Validation Schemas
// =============================================================================

import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().trim().min(2, "Event title must be at least 2 characters").max(150),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  category: z.string().trim().min(2, "Category is required").max(50),
  eventDate: z.string().trim().min(4, "Event date is required"),
  time: z.string().trim().min(2, "Event time is required"),
  venue: z.string().trim().min(2, "Venue/location is required"),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
  bannerUrl: z.string().trim().optional().nullable(),
  isRegistrationOpen: z.boolean().optional().default(true),
  isPublished: z.boolean().optional().default(true),
});

export const updateEventSchema = createEventSchema.partial();

export const eventParamsSchema = z.object({
  id: z.string().trim().min(1, "Event ID is required"),
});

export const eventRegistrationParamsSchema = z.object({
  eventId: z.string().trim().min(1, "Event ID is required"),
});

export const eventQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  date: z.string().trim().optional(),
  isPublished: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? val === "true" : undefined)),
  page: z.string().optional(),
  limit: z.string().optional(),
});
