// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Courses Module Routes
// =============================================================================

import { Router } from "express";
import { coursesController } from "./courses.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate";
import {
  createCourseSchema,
  updateCourseSchema,
  courseParamsSchema,
  courseSlugParamsSchema,
  courseQuerySchema,
} from "./courses.schema";

const coursesRoutes = Router();

coursesRoutes.get(
  "/",
  validateQuery(courseQuerySchema),
  coursesController.getCourses
);

coursesRoutes.get(
  "/slug/:slug",
  validateParams(courseSlugParamsSchema),
  coursesController.getCourseBySlug
);

coursesRoutes.get(
  "/:id",
  validateParams(courseParamsSchema),
  coursesController.getCourseById
);

coursesRoutes.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateBody(createCourseSchema),
  coursesController.createCourse
);

coursesRoutes.patch(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateParams(courseParamsSchema),
  validateBody(updateCourseSchema),
  coursesController.updateCourse
);

coursesRoutes.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateParams(courseParamsSchema),
  coursesController.deleteCourse
);

export { coursesRoutes };
