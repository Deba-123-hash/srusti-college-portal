// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Dashboard Module Controller
// =============================================================================

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { dashboardService } from "./dashboard.service";

export class DashboardController {
  getAdminDashboard = asyncHandler(async (req: Request, res: Response) => {
    const data = await dashboardService.getAdminDashboard(req.user!);

    res.status(200).json({
      success: true,
      data,
      message: "Admin dashboard metrics retrieved successfully",
    });
  });

  getStudentDashboard = asyncHandler(async (req: Request, res: Response) => {
    const data = await dashboardService.getStudentDashboard(req.user!.id);

    res.status(200).json({
      success: true,
      data,
      message: "Student dashboard metrics retrieved successfully",
    });
  });

  getFacultyDashboard = asyncHandler(async (req: Request, res: Response) => {
    const data = await dashboardService.getFacultyDashboard(req.user!.id);

    res.status(200).json({
      success: true,
      data,
      message: "Faculty dashboard metrics retrieved successfully",
    });
  });
}

export const dashboardController = new DashboardController();
