// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Inquiries Module Routes
// =============================================================================

import { Router } from "express";
import { inquiriesController } from "./inquiries.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate";
import {
  createInquirySchema,
  updateInquirySchema,
  inquiryParamsSchema,
  inquiryQuerySchema,
} from "./inquiries.schema";

const inquiriesRoutes = Router();

inquiriesRoutes.post(
  "/",
  validateBody(createInquirySchema),
  inquiriesController.createInquiry
);

inquiriesRoutes.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateQuery(inquiryQuerySchema),
  inquiriesController.getInquiries
);

inquiriesRoutes.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateParams(inquiryParamsSchema),
  inquiriesController.getInquiryById
);

inquiriesRoutes.patch(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateParams(inquiryParamsSchema),
  validateBody(updateInquirySchema),
  inquiriesController.updateInquiry
);

inquiriesRoutes.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateParams(inquiryParamsSchema),
  inquiriesController.deleteInquiry
);

export { inquiriesRoutes };
