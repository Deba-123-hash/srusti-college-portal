// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Notifications Module Routes
// =============================================================================

import { Router } from "express";
import { notificationsController } from "./notifications.controller";
import { authenticate } from "../../middleware/authenticate";
import {
  validateParams,
  validateQuery,
} from "../../middleware/validate";
import {
  notificationParamsSchema,
  notificationQuerySchema,
} from "./notifications.schema";

const notificationsRoutes = Router();

notificationsRoutes.get(
  "/",
  authenticate,
  validateQuery(notificationQuerySchema),
  notificationsController.getMyNotifications
);

notificationsRoutes.patch(
  "/read-all",
  authenticate,
  notificationsController.markAllAsRead
);

notificationsRoutes.patch(
  "/:id/read",
  authenticate,
  validateParams(notificationParamsSchema),
  notificationsController.markAsRead
);

export { notificationsRoutes };
