// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Dashboard Module Routes
// =============================================================================

import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";

const dashboardRoutes = Router();

dashboardRoutes.get(
  "/admin",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  dashboardController.getAdminDashboard
);

dashboardRoutes.get(
  "/student",
  authenticate,
  authorize("STUDENT"),
  dashboardController.getStudentDashboard
);

dashboardRoutes.get(
  "/faculty",
  authenticate,
  authorize("FACULTY"),
  dashboardController.getFacultyDashboard
);

export { dashboardRoutes };
