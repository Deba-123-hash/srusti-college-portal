// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Inquiries Module Validation Schemas
// =============================================================================

import { z } from "zod";

export const createInquirySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  phone: z.string().trim().min(5, "Phone number is required").max(20),
  courseOfInterest: z.string().trim().optional().nullable(),
  message: z.string().trim().min(5, "Message must be at least 5 characters").max(1000),
  type: z.string().trim().optional(),
  source: z.string().trim().optional(),
});

export const updateInquirySchema = z.object({
  status: z.enum(["NEW", "IN_REVIEW", "CONTACTED", "CLOSED"]).optional(),
  isRead: z.boolean().optional(),
  notes: z.string().trim().max(1000).optional().nullable(),
});

export const inquiryParamsSchema = z.object({
  id: z.string().trim().min(1, "Inquiry ID is required"),
});

export const inquiryQuerySchema = z.object({
  type: z.string().trim().optional(),
  source: z.string().trim().optional(),
  status: z.enum(["NEW", "IN_REVIEW", "CONTACTED", "CLOSED"]).optional(),
  isRead: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? val === "true" : undefined)),
  search: z.string().trim().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});
