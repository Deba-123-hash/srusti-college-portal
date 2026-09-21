// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Announcements Module Routes
// =============================================================================

import { Router } from "express";
import { announcementsController } from "./announcements.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate";
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
  announcementParamsSchema,
  announcementQuerySchema,
} from "./announcements.schema";

const announcementsRoutes = Router();

announcementsRoutes.get(
  "/",
  validateQuery(announcementQuerySchema),
  announcementsController.getAnnouncements
);

announcementsRoutes.get(
  "/:id",
  validateParams(announcementParamsSchema),
  announcementsController.getAnnouncementById
);

announcementsRoutes.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateBody(createAnnouncementSchema),
  announcementsController.createAnnouncement
);

announcementsRoutes.patch(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateParams(announcementParamsSchema),
  validateBody(updateAnnouncementSchema),
  announcementsController.updateAnnouncement
);

announcementsRoutes.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateParams(announcementParamsSchema),
  announcementsController.deleteAnnouncement
);

export { announcementsRoutes };
