// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Placements Module Validation Schemas
// =============================================================================

import { z } from "zod";

export const createPlacementDriveSchema = z.object({
  companyId: z.string().trim().min(1, "Company ID is required"),
  jobRole: z.string().trim().min(2, "Job role must be at least 2 characters").max(100),
  ctcPackage: z.string().trim().min(2, "CTC package is required").max(50),
  eligibleCourses: z.string().trim().min(2, "Eligible courses are required").max(200),
  minCgpa: z.number().min(0).max(10).optional().default(6.0),
  driveDate: z.string().trim().min(4, "Drive date is required"),
  location: z.string().trim().min(2, "Location is required").max(100),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  deadline: z.string().trim().min(4, "Registration deadline is required"),
  isActive: z.boolean().optional().default(true),
});

export const updatePlacementDriveSchema = createPlacementDriveSchema.partial();

export const driveParamsSchema = z.object({
  id: z.string().trim().min(1, "Drive ID is required"),
});

export const applyDriveParamsSchema = z.object({
  driveId: z.string().trim().min(1, "Drive ID is required"),
});

export const applicationParamsSchema = z.object({
  id: z.string().trim().min(1, "Application ID is required"),
});

export const updateApplicationSchema = z.object({
  status: z.enum(["APPLIED", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED"]),
  notes: z.string().trim().max(500).optional().nullable(),
});

export const driveQuerySchema = z.object({
  active: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? val === "true" : undefined)),
  course: z.string().trim().optional(),
  companyId: z.string().trim().optional(),
  date: z.string().trim().optional(),
  search: z.string().trim().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const applicationQuerySchema = z.object({
  driveId: z.string().trim().optional(),
  status: z
    .enum(["APPLIED", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED"])
    .optional(),
  studentId: z.string().trim().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});
