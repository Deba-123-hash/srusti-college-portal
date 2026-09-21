// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Placements Module Routes
// =============================================================================

import { Router, Request, Response, NextFunction } from "express";
import { placementsController } from "./placements.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate";
import {
  createPlacementDriveSchema,
  updatePlacementDriveSchema,
  driveParamsSchema,
  applyDriveParamsSchema,
  applicationParamsSchema,
  updateApplicationSchema,
  driveQuerySchema,
  applicationQuerySchema,
} from "./placements.schema";
import { verifyAccessToken } from "../../lib/jwt";

function optionalAuthenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const payload = verifyAccessToken(token);
      req.user = {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
        departmentId: payload.departmentId,
      };
    } catch {
      // Continue without user
    }
  }
  next();
}

const placementsRoutes = Router();

// --- Drives ---

placementsRoutes.get(
  "/drives",
  optionalAuthenticate,
  validateQuery(driveQuerySchema),
  placementsController.getDrives
);

placementsRoutes.get(
  "/drives/:id",
  optionalAuthenticate,
  validateParams(driveParamsSchema),
  placementsController.getDriveById
);

placementsRoutes.post(
  "/drives",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateBody(createPlacementDriveSchema),
  placementsController.createDrive
);

placementsRoutes.patch(
  "/drives/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateParams(driveParamsSchema),
  validateBody(updatePlacementDriveSchema),
  placementsController.updateDrive
);

placementsRoutes.delete(
  "/drives/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateParams(driveParamsSchema),
  placementsController.deleteDrive
);

// --- Applications ---

placementsRoutes.post(
  "/drives/:driveId/apply",
  authenticate,
  authorize("STUDENT"),
  validateParams(applyDriveParamsSchema),
  placementsController.applyToDrive
);

placementsRoutes.get(
  "/my-applications",
  authenticate,
  authorize("STUDENT"),
  placementsController.getMyApplications
);

placementsRoutes.get(
  "/applications",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateQuery(applicationQuerySchema),
  placementsController.getApplications
);

placementsRoutes.get(
  "/applications/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN", "STUDENT"),
  validateParams(applicationParamsSchema),
  placementsController.getApplicationById
);

placementsRoutes.patch(
  "/applications/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateParams(applicationParamsSchema),
  validateBody(updateApplicationSchema),
  placementsController.updateApplication
);

export { placementsRoutes };
