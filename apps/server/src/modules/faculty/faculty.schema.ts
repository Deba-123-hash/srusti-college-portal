// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Faculty Module Validation Schemas
// =============================================================================

import { z } from "zod";

export const createFacultySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .default("Faculty@123"),
  departmentId: z.string().trim().min(1, "Department ID is required"),
  designation: z.string().trim().min(2, "Designation is required").max(100),
  phone: z.string().trim().max(20).optional().nullable(),
  bio: z.string().trim().max(1000).optional().nullable(),
  photoUrl: z.string().trim().optional().nullable(),
  subjectIds: z.array(z.string().trim()).optional(),
});

export const updateFacultySchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  designation: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().max(20).optional().nullable(),
  bio: z.string().trim().max(1000).optional().nullable(),
  photoUrl: z.string().trim().optional().nullable(),
  departmentId: z.string().trim().min(1).optional(),
  subjectIds: z.array(z.string().trim()).optional(),
});

export const facultyParamsSchema = z.object({
  id: z.string().trim().min(1, "Faculty ID is required"),
});

export const facultyQuerySchema = z.object({
  search: z.string().trim().optional(),
  departmentId: z.string().trim().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});
