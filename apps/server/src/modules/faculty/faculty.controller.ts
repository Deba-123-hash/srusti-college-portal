// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Faculty Module Controller
// =============================================================================

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { facultyService } from "./faculty.service";

export class FacultyController {
  getFaculty = asyncHandler(async (req: Request, res: Response) => {
    const result = await facultyService.getFaculty(req.query as any, req.user!);

    res.status(200).json({
      success: true,
      data: result.items,
      message: "Faculty retrieved successfully",
      meta: result.meta,
    });
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const faculty = await facultyService.getFacultyByUserId(req.user!.id);

    res.status(200).json({
      success: true,
      data: faculty,
      message: "Personal faculty profile retrieved successfully",
    });
  });

  getFacultyById = asyncHandler(async (req: Request, res: Response) => {
    const faculty = await facultyService.getFacultyById(req.params.id, req.user!);

    res.status(200).json({
      success: true,
      data: faculty,
      message: "Faculty retrieved successfully",
    });
  });

  createFaculty = asyncHandler(async (req: Request, res: Response) => {
    const faculty = await facultyService.createFaculty(req.body, req.user!);

    res.status(201).json({
      success: true,
      data: faculty,
      message: "Faculty created successfully",
    });
  });

  updateFaculty = asyncHandler(async (req: Request, res: Response) => {
    const faculty = await facultyService.updateFaculty(
      req.params.id,
      req.body,
      req.user!
    );

    res.status(200).json({
      success: true,
      data: faculty,
      message: "Faculty updated successfully",
    });
  });

  deleteFaculty = asyncHandler(async (req: Request, res: Response) => {
    await facultyService.deleteFaculty(req.params.id, req.user!);

    res.status(200).json({
      success: true,
      data: null,
      message: "Faculty deleted successfully",
    });
  });
}

export const facultyController = new FacultyController();
