// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Attendance Module Controller
// =============================================================================

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { attendanceService } from "./attendance.service";
import { attendanceRepository } from "./attendance.repository";
import { ApiError } from "../../utils/ApiError";

export class AttendanceController {
  getAttendance = asyncHandler(async (req: Request, res: Response) => {
    const result = await attendanceService.getAttendance(
      req.query as any,
      req.user!
    );

    res.status(200).json({
      success: true,
      data: result.items,
      message: "Attendance records retrieved successfully",
      meta: result.meta,
    });
  });

  getAttendanceById = asyncHandler(async (req: Request, res: Response) => {
    const record = await attendanceService.getAttendanceById(
      req.params.id,
      req.user!
    );

    res.status(200).json({
      success: true,
      data: record,
      message: "Attendance record retrieved successfully",
    });
  });

  createAttendance = asyncHandler(async (req: Request, res: Response) => {
    const result = await attendanceService.createAttendance(req.body, req.user!);

    res.status(201).json({
      success: true,
      data: result,
      message: "Attendance recorded successfully",
    });
  });

  updateAttendance = asyncHandler(async (req: Request, res: Response) => {
    const updated = await attendanceService.updateAttendance(
      req.params.id,
      req.body,
      req.user!
    );

    res.status(200).json({
      success: true,
      data: updated,
      message: "Attendance record updated successfully",
    });
  });

  getStudentSummary = asyncHandler(async (req: Request, res: Response) => {
    const summary = await attendanceService.getStudentSummary(
      req.params.studentId,
      req.user!
    );

    res.status(200).json({
      success: true,
      data: summary,
      message: "Student attendance summary retrieved successfully",
    });
  });

  getMySummary = asyncHandler(async (req: Request, res: Response) => {
    const student = await attendanceRepository.findStudentByUserId(req.user!.id);
    if (!student) {
      throw ApiError.notFound("Student profile not found", "STUDENT_NOT_FOUND");
    }

    const summary = await attendanceService.getStudentSummary(
      student.id,
      req.user!
    );

    res.status(200).json({
      success: true,
      data: summary,
      message: "Attendance summary retrieved successfully",
    });
  });
}

export const attendanceController = new AttendanceController();
