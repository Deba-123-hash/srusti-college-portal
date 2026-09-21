// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Students Module Routes
// =============================================================================

import { Router } from "express";
import { studentsController } from "./students.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate";
import {
  createStudentSchema,
  updateStudentSchema,
  studentParamsSchema,
  studentQuerySchema,
} from "./students.schema";

const studentsRoutes = Router();

studentsRoutes.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN", "FACULTY", "STUDENT"),
  validateQuery(studentQuerySchema),
  studentsController.getStudents
);

studentsRoutes.get(
  "/me",
  authenticate,
  authorize("STUDENT"),
  studentsController.getMe
);

studentsRoutes.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN", "FACULTY", "STUDENT"),
  validateParams(studentParamsSchema),
  studentsController.getStudentById
);

studentsRoutes.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateBody(createStudentSchema),
  studentsController.createStudent
);

studentsRoutes.patch(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN", "STUDENT"),
  validateParams(studentParamsSchema),
  validateBody(updateStudentSchema),
  studentsController.updateStudent
);

studentsRoutes.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateParams(studentParamsSchema),
  studentsController.deleteStudent
);

export { studentsRoutes };
