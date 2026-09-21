// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Departments Module Routes
// =============================================================================

import { Router } from "express";
import { departmentsController } from "./departments.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  departmentParamsSchema,
  departmentQuerySchema,
} from "./departments.schema";

const departmentsRoutes = Router();

departmentsRoutes.get(
  "/",
  validateQuery(departmentQuerySchema),
  departmentsController.getDepartments
);

departmentsRoutes.get(
  "/:id",
  validateParams(departmentParamsSchema),
  departmentsController.getDepartmentById
);

departmentsRoutes.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN"),
  validateBody(createDepartmentSchema),
  departmentsController.createDepartment
);

departmentsRoutes.patch(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  validateParams(departmentParamsSchema),
  validateBody(updateDepartmentSchema),
  departmentsController.updateDepartment
);

departmentsRoutes.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  validateParams(departmentParamsSchema),
  departmentsController.deleteDepartment
);

export { departmentsRoutes };
