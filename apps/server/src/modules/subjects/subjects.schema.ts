// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Subjects Module Validation Schemas
// =============================================================================

import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z.string().trim().min(2, "Subject name must be at least 2 characters").max(120),
  code: z
    .string()
    .trim()
    .min(2, "Subject code must be at least 2 characters")
    .max(20)
    .toUpperCase(),
  courseId: z.string().trim().min(1, "Course ID is required"),
  semester: z.number().int().min(1, "Semester must be at least 1").max(12),
  credits: z.number().int().min(1).max(10).optional().default(3),
  facultyId: z.string().trim().optional().nullable(),
});

export const updateSubjectSchema = createSubjectSchema.partial();

export const subjectParamsSchema = z.object({
  id: z.string().trim().min(1, "Subject ID is required"),
});

export const subjectQuerySchema = z.object({
  courseId: z.string().trim().optional(),
  semester: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  search: z.string().trim().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});
