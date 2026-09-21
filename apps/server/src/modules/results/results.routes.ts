// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Results Module Routes
// =============================================================================

import { Router } from "express";
import { resultsController } from "./results.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate";
import {
  createResultSchema,
  updateResultSchema,
  publishResultsSchema,
  resultParamsSchema,
  resultQuerySchema,
} from "./results.schema";

const resultsRoutes = Router();

resultsRoutes.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN", "FACULTY", "STUDENT"),
  validateQuery(resultQuerySchema),
  resultsController.getResults
);

resultsRoutes.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN", "FACULTY", "STUDENT"),
  validateParams(resultParamsSchema),
  resultsController.getResultById
);

resultsRoutes.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN", "FACULTY"),
  validateBody(createResultSchema),
  resultsController.createResult
);

resultsRoutes.post(
  "/publish",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateBody(publishResultsSchema),
  resultsController.publishResults
);

resultsRoutes.patch(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN", "FACULTY"),
  validateParams(resultParamsSchema),
  validateBody(updateResultSchema),
  resultsController.updateResult
);

export { resultsRoutes };
