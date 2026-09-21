// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Results Module Validation Schemas
// =============================================================================

import { z } from "zod";

export const createResultSchema = z.object({
  studentId: z.string().trim().min(1, "Student ID is required"),
  subjectId: z.string().trim().min(1, "Subject ID is required"),
  semester: z.number().int().min(1, "Semester must be at least 1").max(12),
  internalMarks: z.number().min(0, "Internal marks cannot be negative").max(100),
  externalMarks: z.number().min(0, "External marks cannot be negative").max(100),
  totalMarks: z.number().min(0).max(200).optional(),
  grade: z.string().trim().min(1, "Grade is required").max(5).toUpperCase(),
  credits: z.number().int().min(1).max(10).optional().default(3),
});

export const updateResultSchema = z.object({
  internalMarks: z.number().min(0).max(100).optional(),
  externalMarks: z.number().min(0).max(100).optional(),
  totalMarks: z.number().min(0).max(200).optional(),
  grade: z.string().trim().min(1).max(5).toUpperCase().optional(),
  credits: z.number().int().min(1).max(10).optional(),
  isPublished: z.boolean().optional(),
});

export const publishResultsSchema = z.object({
  subjectId: z.string().trim().optional(),
  semester: z.number().int().min(1).max(12).optional(),
  courseId: z.string().trim().optional(),
});

export const resultParamsSchema = z.object({
  id: z.string().trim().min(1, "Result ID is required"),
});

export const resultQuerySchema = z.object({
  studentId: z.string().trim().optional(),
  subjectId: z.string().trim().optional(),
  semester: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  isPublished: z
    .string()
    .optional()
    .transform((val) => (val ? val === "true" : undefined)),
  page: z.string().optional(),
  limit: z.string().optional(),
});
