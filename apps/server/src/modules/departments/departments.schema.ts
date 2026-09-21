// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Departments Module Validation Schemas
// =============================================================================

import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().trim().min(2, "Department name must be at least 2 characters").max(100),
  code: z
    .string()
    .trim()
    .min(2, "Department code must be at least 2 characters")
    .max(10)
    .toUpperCase(),
  description: z.string().trim().max(500).optional().nullable(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export const departmentParamsSchema = z.object({
  id: z.string().trim().min(1, "Department ID is required"),
});

export const departmentQuerySchema = z.object({
  search: z.string().trim().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});
