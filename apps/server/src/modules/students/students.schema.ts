// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Students Module Validation Schemas
// =============================================================================

import { z } from "zod";

export const createStudentSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .default("Student@123"),
  regNo: z
    .string()
    .trim()
    .min(3, "Enrollment/Registration number must be at least 3 characters")
    .max(30)
    .toUpperCase(),
  departmentId: z.string().trim().min(1, "Department ID is required"),
  courseId: z.string().trim().min(1, "Course ID is required"),
  currentSemester: z.number().int().min(1).max(12).optional().default(1),
  enrollmentYear: z
    .number()
    .int()
    .min(2000)
    .max(2100)
    .optional()
    .default(new Date().getFullYear()),
  phone: z.string().trim().max(20).optional().nullable(),
  cgpa: z.number().min(0).max(10).optional().default(0.0),
});

export const updateStudentSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().max(20).optional().nullable(),
  currentSemester: z.number().int().min(1).max(12).optional(),
  cgpa: z.number().min(0).max(10).optional(),
  departmentId: z.string().trim().min(1).optional(),
  courseId: z.string().trim().min(1).optional(),
});

export const studentParamsSchema = z.object({
  id: z.string().trim().min(1, "Student ID is required"),
});

export const studentQuerySchema = z.object({
  search: z.string().trim().optional(),
  regNo: z.string().trim().optional(),
  departmentId: z.string().trim().optional(),
  courseId: z.string().trim().optional(),
  semester: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  page: z.string().optional(),
  limit: z.string().optional(),
});
