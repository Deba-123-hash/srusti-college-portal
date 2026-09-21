// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Notifications Module Validation Schemas
// =============================================================================

import { z } from "zod";

export const notificationParamsSchema = z.object({
  id: z.string().trim().min(1, "Notification ID is required"),
});

export const notificationQuerySchema = z.object({
  unreadOnly: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? val === "true" : undefined)),
  page: z.string().optional(),
  limit: z.string().optional(),
});
