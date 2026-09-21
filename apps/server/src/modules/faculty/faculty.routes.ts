// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Faculty Module Routes
// =============================================================================

import { Router } from "express";
import { facultyController } from "./faculty.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate";
import {
  createFacultySchema,
  updateFacultySchema,
  facultyParamsSchema,
  facultyQuerySchema,
} from "./faculty.schema";

const facultyRoutes = Router();

facultyRoutes.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN", "FACULTY"),
  validateQuery(facultyQuerySchema),
  facultyController.getFaculty
);

facultyRoutes.get(
  "/me",
  authenticate,
  authorize("FACULTY"),
  facultyController.getMe
);

facultyRoutes.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN", "FACULTY"),
  validateParams(facultyParamsSchema),
  facultyController.getFacultyById
);

facultyRoutes.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateBody(createFacultySchema),
  facultyController.createFaculty
);

facultyRoutes.patch(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN", "FACULTY"),
  validateParams(facultyParamsSchema),
  validateBody(updateFacultySchema),
  facultyController.updateFaculty
);

facultyRoutes.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateParams(facultyParamsSchema),
  facultyController.deleteFaculty
);

export { facultyRoutes };
