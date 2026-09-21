// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Departments Module Controller
// =============================================================================

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { departmentsService } from "./departments.service";

export class DepartmentsController {
  getDepartments = asyncHandler(async (req: Request, res: Response) => {
    const result = await departmentsService.getDepartments(req.query);

    res.status(200).json({
      success: true,
      data: result.items,
      message: "Departments retrieved successfully",
      meta: result.meta,
    });
  });

  getDepartmentById = asyncHandler(async (req: Request, res: Response) => {
    const department = await departmentsService.getDepartmentById(req.params.id);

    res.status(200).json({
      success: true,
      data: department,
      message: "Department retrieved successfully",
    });
  });

  createDepartment = asyncHandler(async (req: Request, res: Response) => {
    const department = await departmentsService.createDepartment(req.body);

    res.status(201).json({
      success: true,
      data: department,
      message: "Department created successfully",
    });
  });

  updateDepartment = asyncHandler(async (req: Request, res: Response) => {
    const department = await departmentsService.updateDepartment(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: department,
      message: "Department updated successfully",
    });
  });

  deleteDepartment = asyncHandler(async (req: Request, res: Response) => {
    await departmentsService.deleteDepartment(req.params.id);

    res.status(200).json({
      success: true,
      data: null,
      message: "Department deleted successfully",
    });
  });
}

export const departmentsController = new DepartmentsController();
