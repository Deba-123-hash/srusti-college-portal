// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Gallery Module Controller
// =============================================================================

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { galleryService } from "./gallery.service";

export class GalleryController {
  getGallery = asyncHandler(async (req: Request, res: Response) => {
    const result = await galleryService.getGallery(req.query as any);

    res.status(200).json({
      success: true,
      data: result.items,
      message: "Gallery items retrieved successfully",
      meta: result.meta,
    });
  });

  getGalleryById = asyncHandler(async (req: Request, res: Response) => {
    const item = await galleryService.getGalleryById(req.params.id);

    res.status(200).json({
      success: true,
      data: item,
      message: "Gallery item retrieved successfully",
    });
  });

  createGalleryItem = asyncHandler(async (req: Request, res: Response) => {
    const item = await galleryService.createGalleryItem(
      req.body,
      req.file
    );

    res.status(201).json({
      success: true,
      data: item,
      message: "Gallery item created successfully",
    });
  });

  updateGalleryItem = asyncHandler(async (req: Request, res: Response) => {
    const updated = await galleryService.updateGalleryItem(
      req.params.id,
      req.body,
      req.file
    );

    res.status(200).json({
      success: true,
      data: updated,
      message: "Gallery item updated successfully",
    });
  });

  deleteGalleryItem = asyncHandler(async (req: Request, res: Response) => {
    await galleryService.deleteGalleryItem(req.params.id);

    res.status(200).json({
      success: true,
      data: null,
      message: "Gallery item deleted successfully",
    });
  });
}

export const galleryController = new GalleryController();
