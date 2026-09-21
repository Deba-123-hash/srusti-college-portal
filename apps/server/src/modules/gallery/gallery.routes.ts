// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Gallery Module Routes
// =============================================================================

import { Router } from "express";
import { galleryController } from "./gallery.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate";
import {
  createGallerySchema,
  updateGallerySchema,
  galleryParamsSchema,
  galleryQuerySchema,
} from "./gallery.schema";
import { uploadSingleImage } from "../../lib/upload";

const galleryRoutes = Router();

galleryRoutes.get(
  "/",
  validateQuery(galleryQuerySchema),
  galleryController.getGallery
);

galleryRoutes.get(
  "/:id",
  validateParams(galleryParamsSchema),
  galleryController.getGalleryById
);

galleryRoutes.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  uploadSingleImage,
  validateBody(createGallerySchema),
  galleryController.createGalleryItem
);

galleryRoutes.patch(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  uploadSingleImage,
  validateParams(galleryParamsSchema),
  validateBody(updateGallerySchema),
  galleryController.updateGalleryItem
);

galleryRoutes.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateParams(galleryParamsSchema),
  galleryController.deleteGalleryItem
);

export { galleryRoutes };
