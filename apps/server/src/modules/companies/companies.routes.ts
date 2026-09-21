// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Companies Module Routes
// =============================================================================

import { Router } from "express";
import { companiesController } from "./companies.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate";
import {
  createCompanySchema,
  updateCompanySchema,
  companyParamsSchema,
  companyQuerySchema,
} from "./companies.schema";

const companiesRoutes = Router();

companiesRoutes.get(
  "/",
  validateQuery(companyQuerySchema),
  companiesController.getCompanies
);

companiesRoutes.get(
  "/:id",
  validateParams(companyParamsSchema),
  companiesController.getCompanyById
);

companiesRoutes.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateBody(createCompanySchema),
  companiesController.createCompany
);

companiesRoutes.patch(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateParams(companyParamsSchema),
  validateBody(updateCompanySchema),
  companiesController.updateCompany
);

companiesRoutes.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateParams(companyParamsSchema),
  companiesController.deleteCompany
);

export { companiesRoutes };
