// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Notifications Module Controller
// =============================================================================

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { notificationsService } from "./notifications.service";

export class NotificationsController {
  getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
    const result = await notificationsService.getMyNotifications(
      req.query as any,
      req.user!.id
    );

    res.status(200).json({
      success: true,
      data: {
        notifications: result.items,
        unreadCount: result.unreadCount,
      },
      message: "Notifications retrieved successfully",
      meta: result.meta,
    });
  });

  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const updated = await notificationsService.markAsRead(
      req.params.id,
      req.user!.id
    );

    res.status(200).json({
      success: true,
      data: updated,
      message: "Notification marked as read",
    });
  });

  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    const result = await notificationsService.markAllAsRead(req.user!.id);

    res.status(200).json({
      success: true,
      data: result,
      message: "All notifications marked as read",
    });
  });
}

export const notificationsController = new NotificationsController();
