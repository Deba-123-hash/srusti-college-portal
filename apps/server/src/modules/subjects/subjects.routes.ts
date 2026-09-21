// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Subjects Module Routes
// =============================================================================

import { Router } from "express";
import { subjectsController } from "./subjects.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate";
import {
  createSubjectSchema,
  updateSubjectSchema,
  subjectParamsSchema,
  subjectQuerySchema,
} from "./subjects.schema";

const subjectsRoutes = Router();

subjectsRoutes.get(
  "/",
  validateQuery(subjectQuerySchema),
  subjectsController.getSubjects
);

subjectsRoutes.get(
  "/:id",
  validateParams(subjectParamsSchema),
  subjectsController.getSubjectById
);

subjectsRoutes.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateBody(createSubjectSchema),
  subjectsController.createSubject
);

subjectsRoutes.patch(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateParams(subjectParamsSchema),
  validateBody(updateSubjectSchema),
  subjectsController.updateSubject
);

subjectsRoutes.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateParams(subjectParamsSchema),
  subjectsController.deleteSubject
);

export { subjectsRoutes };
