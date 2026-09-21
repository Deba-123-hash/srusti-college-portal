// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Courses Module Validation Schemas
// =============================================================================

import { z } from "zod";

export const createCourseSchema = z.object({
  name: z.string().trim().min(2, "Course name must be at least 2 characters").max(150),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(100)
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens")
    .optional(),
  code: z.string().trim().min(2).max(20).toUpperCase().optional().nullable(),
  departmentId: z.string().trim().min(1, "Department ID is required"),
  durationYears: z.number().int().min(1, "Duration must be at least 1 year").max(6),
  eligibility: z.string().trim().min(2, "Eligibility criteria is required"),
  totalFees: z.number().min(0, "Total fees must be positive"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  syllabusUrl: z.string().trim().optional().nullable(),
});

export const updateCourseSchema = createCourseSchema.partial();

export const courseParamsSchema = z.object({
  id: z.string().trim().min(1, "Course ID is required"),
});

export const courseSlugParamsSchema = z.object({
  slug: z.string().trim().min(1, "Slug is required"),
});

export const courseQuerySchema = z.object({
  search: z.string().trim().optional(),
  departmentId: z.string().trim().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});
