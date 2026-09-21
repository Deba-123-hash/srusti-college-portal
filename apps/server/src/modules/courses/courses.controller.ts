// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Courses Module Controller
// =============================================================================

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { coursesService } from "./courses.service";

export class CoursesController {
  getCourses = asyncHandler(async (req: Request, res: Response) => {
    const result = await coursesService.getCourses(req.query);

    res.status(200).json({
      success: true,
      data: result.items,
      message: "Courses retrieved successfully",
      meta: result.meta,
    });
  });

  getCourseById = asyncHandler(async (req: Request, res: Response) => {
    const course = await coursesService.getCourseById(req.params.id);

    res.status(200).json({
      success: true,
      data: course,
      message: "Course retrieved successfully",
    });
  });

  getCourseBySlug = asyncHandler(async (req: Request, res: Response) => {
    const course = await coursesService.getCourseBySlug(req.params.slug);

    res.status(200).json({
      success: true,
      data: course,
      message: "Course retrieved successfully",
    });
  });

  createCourse = asyncHandler(async (req: Request, res: Response) => {
    if (!req.body.slug) {
      req.body.slug = (req.body.code || req.body.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    const course = await coursesService.createCourse(req.body, req.user!);

    res.status(201).json({
      success: true,
      data: course,
      message: "Course created successfully",
    });
  });

  updateCourse = asyncHandler(async (req: Request, res: Response) => {
    const course = await coursesService.updateCourse(
      req.params.id,
      req.body,
      req.user!
    );

    res.status(200).json({
      success: true,
      data: course,
      message: "Course updated successfully",
    });
  });

  deleteCourse = asyncHandler(async (req: Request, res: Response) => {
    await coursesService.deleteCourse(req.params.id, req.user!);

    res.status(200).json({
      success: true,
      data: null,
      message: "Course deleted successfully",
    });
  });
}

export const coursesController = new CoursesController();
