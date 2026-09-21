// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Attendance Module Routes
// =============================================================================

import { Router } from "express";
import { attendanceController } from "./attendance.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate";
import {
  createAttendanceSchema,
  updateAttendanceSchema,
  attendanceParamsSchema,
  attendanceSummaryParamsSchema,
  attendanceQuerySchema,
} from "./attendance.schema";

const attendanceRoutes = Router();

attendanceRoutes.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN", "FACULTY", "STUDENT"),
  validateQuery(attendanceQuerySchema),
  attendanceController.getAttendance
);

attendanceRoutes.get(
  "/me/summary",
  authenticate,
  authorize("STUDENT"),
  attendanceController.getMySummary
);

attendanceRoutes.get(
  "/summary/:studentId",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN", "FACULTY", "STUDENT"),
  validateParams(attendanceSummaryParamsSchema),
  attendanceController.getStudentSummary
);

attendanceRoutes.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN", "FACULTY", "STUDENT"),
  validateParams(attendanceParamsSchema),
  attendanceController.getAttendanceById
);

attendanceRoutes.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN", "FACULTY"),
  validateBody(createAttendanceSchema),
  attendanceController.createAttendance
);

attendanceRoutes.patch(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN", "FACULTY"),
  validateParams(attendanceParamsSchema),
  validateBody(updateAttendanceSchema),
  attendanceController.updateAttendance
);

export { attendanceRoutes };
