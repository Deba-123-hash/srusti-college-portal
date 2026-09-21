// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Companies Module Validation Schemas
// =============================================================================

import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().trim().min(2, "Company name must be at least 2 characters").max(100),
  website: z.string().trim().optional().nullable(),
  logoUrl: z.string().trim().optional().nullable(),
  industry: z.string().trim().min(2, "Industry is required").max(100),
  description: z.string().trim().max(1000).optional().nullable(),
});

export const updateCompanySchema = createCompanySchema.partial();

export const companyParamsSchema = z.object({
  id: z.string().trim().min(1, "Company ID is required"),
});

export const companyQuerySchema = z.object({
  search: z.string().trim().optional(),
  industry: z.string().trim().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});
