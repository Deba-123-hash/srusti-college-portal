// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Placements Module Controller
// =============================================================================

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { placementsService } from "./placements.service";

export class PlacementsController {
  // --- Drives ---

  getDrives = asyncHandler(async (req: Request, res: Response) => {
    const result = await placementsService.getDrives(req.query as any, req.user);

    res.status(200).json({
      success: true,
      data: result.items,
      message: "Placement drives retrieved successfully",
      meta: result.meta,
    });
  });

  getDriveById = asyncHandler(async (req: Request, res: Response) => {
    const drive = await placementsService.getDriveById(req.params.id, req.user);

    res.status(200).json({
      success: true,
      data: drive,
      message: "Placement drive details retrieved successfully",
    });
  });

  createDrive = asyncHandler(async (req: Request, res: Response) => {
    const drive = await placementsService.createDrive(req.body);

    res.status(201).json({
      success: true,
      data: drive,
      message: "Placement drive created successfully",
    });
  });

  updateDrive = asyncHandler(async (req: Request, res: Response) => {
    const drive = await placementsService.updateDrive(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: drive,
      message: "Placement drive updated successfully",
    });
  });

  deleteDrive = asyncHandler(async (req: Request, res: Response) => {
    await placementsService.deleteDrive(req.params.id);

    res.status(200).json({
      success: true,
      data: null,
      message: "Placement drive deleted successfully",
    });
  });

  // --- Applications ---

  applyToDrive = asyncHandler(async (req: Request, res: Response) => {
    const application = await placementsService.applyToDrive(
      req.params.driveId,
      req.user!.id
    );

    res.status(201).json({
      success: true,
      data: application,
      message: "Application submitted successfully",
    });
  });

  getApplications = asyncHandler(async (req: Request, res: Response) => {
    const result = await placementsService.getApplications(
      req.query as any,
      req.user!
    );

    res.status(200).json({
      success: true,
      data: result.items,
      message: "Placement applications retrieved successfully",
      meta: result.meta,
    });
  });

  getApplicationById = asyncHandler(async (req: Request, res: Response) => {
    const application = await placementsService.getApplicationById(
      req.params.id,
      req.user!
    );

    res.status(200).json({
      success: true,
      data: application,
      message: "Placement application details retrieved successfully",
    });
  });

  updateApplication = asyncHandler(async (req: Request, res: Response) => {
    const updated = await placementsService.updateApplication(
      req.params.id,
      req.body,
      req.user!
    );

    res.status(200).json({
      success: true,
      data: updated,
      message: "Application status updated successfully",
    });
  });

  getMyApplications = asyncHandler(async (req: Request, res: Response) => {
    const applications = await placementsService.getMyApplications(
      req.user!.id
    );

    res.status(200).json({
      success: true,
      data: applications,
      message: "Personal placement applications retrieved successfully",
    });
  });
}

export const placementsController = new PlacementsController();
