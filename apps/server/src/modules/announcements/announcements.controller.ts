// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Announcements Module Controller
// =============================================================================

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { announcementsService } from "./announcements.service";

export class AnnouncementsController {
  getAnnouncements = asyncHandler(async (req: Request, res: Response) => {
    const result = await announcementsService.getAnnouncements(req.query as any);

    res.status(200).json({
      success: true,
      data: result.items,
      message: "Announcements retrieved successfully",
      meta: result.meta,
    });
  });

  getAnnouncementById = asyncHandler(async (req: Request, res: Response) => {
    const announcement = await announcementsService.getAnnouncementById(
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: announcement,
      message: "Announcement retrieved successfully",
    });
  });

  createAnnouncement = asyncHandler(async (req: Request, res: Response) => {
    const announcement = await announcementsService.createAnnouncement(req.body);

    res.status(201).json({
      success: true,
      data: announcement,
      message: "Announcement created successfully",
    });
  });

  updateAnnouncement = asyncHandler(async (req: Request, res: Response) => {
    const updated = await announcementsService.updateAnnouncement(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: updated,
      message: "Announcement updated successfully",
    });
  });

  deleteAnnouncement = asyncHandler(async (req: Request, res: Response) => {
    await announcementsService.deleteAnnouncement(req.params.id);

    res.status(200).json({
      success: true,
      data: null,
      message: "Announcement deleted successfully",
    });
  });
}

export const announcementsController = new AnnouncementsController();
