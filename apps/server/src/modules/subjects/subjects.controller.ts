// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Subjects Module Controller
// =============================================================================

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { subjectsService } from "./subjects.service";

export class SubjectsController {
  getSubjects = asyncHandler(async (req: Request, res: Response) => {
    const result = await subjectsService.getSubjects(req.query as any);

    res.status(200).json({
      success: true,
      data: result.items,
      message: "Subjects retrieved successfully",
      meta: result.meta,
    });
  });

  getSubjectById = asyncHandler(async (req: Request, res: Response) => {
    const subject = await subjectsService.getSubjectById(req.params.id);

    res.status(200).json({
      success: true,
      data: subject,
      message: "Subject retrieved successfully",
    });
  });

  createSubject = asyncHandler(async (req: Request, res: Response) => {
    const subject = await subjectsService.createSubject(req.body, req.user!);

    res.status(201).json({
      success: true,
      data: subject,
      message: "Subject created successfully",
    });
  });

  updateSubject = asyncHandler(async (req: Request, res: Response) => {
    const subject = await subjectsService.updateSubject(
      req.params.id,
      req.body,
      req.user!
    );

    res.status(200).json({
      success: true,
      data: subject,
      message: "Subject updated successfully",
    });
  });

  deleteSubject = asyncHandler(async (req: Request, res: Response) => {
    await subjectsService.deleteSubject(req.params.id, req.user!);

    res.status(200).json({
      success: true,
      data: null,
      message: "Subject deleted successfully",
    });
  });
}

export const subjectsController = new SubjectsController();
