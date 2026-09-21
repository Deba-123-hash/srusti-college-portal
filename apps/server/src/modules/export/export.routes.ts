// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Admin Data Export Routes
// =============================================================================

import { Router } from "express";
import { exportController } from "./export.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";

const exportRoutes = Router();

exportRoutes.get(
  "/:resource",
  authenticate,
  authorize("SUPER_ADMIN"),
  exportController.exportResource
);

export { exportRoutes };
