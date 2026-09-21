// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Students Module Controller
// =============================================================================

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { studentsService } from "./students.service";

export class StudentsController {
  getStudents = asyncHandler(async (req: Request, res: Response) => {
    const result = await studentsService.getStudents(req.query as any, req.user!);

    res.status(200).json({
      success: true,
      data: result.items,
      message: "Students retrieved successfully",
      meta: result.meta,
    });
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const student = await studentsService.getStudentByUserId(req.user!.id);

    res.status(200).json({
      success: true,
      data: student,
      message: "Personal student profile retrieved successfully",
    });
  });

  getStudentById = asyncHandler(async (req: Request, res: Response) => {
    const student = await studentsService.getStudentById(req.params.id, req.user!);

    res.status(200).json({
      success: true,
      data: student,
      message: "Student retrieved successfully",
    });
  });

  createStudent = asyncHandler(async (req: Request, res: Response) => {
    const student = await studentsService.createStudent(req.body, req.user!);

    res.status(201).json({
      success: true,
      data: student,
      message: "Student created successfully",
    });
  });

  updateStudent = asyncHandler(async (req: Request, res: Response) => {
    const student = await studentsService.updateStudent(
      req.params.id,
      req.body,
      req.user!
    );

    res.status(200).json({
      success: true,
      data: student,
      message: "Student updated successfully",
    });
  });

  deleteStudent = asyncHandler(async (req: Request, res: Response) => {
    await studentsService.deleteStudent(req.params.id, req.user!);

    res.status(200).json({
      success: true,
      data: null,
      message: "Student deleted successfully",
    });
  });
}

export const studentsController = new StudentsController();
