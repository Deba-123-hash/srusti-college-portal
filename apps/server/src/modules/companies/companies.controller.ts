// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Companies Module Controller
// =============================================================================

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { companiesService } from "./companies.service";

export class CompaniesController {
  getCompanies = asyncHandler(async (req: Request, res: Response) => {
    const result = await companiesService.getCompanies(req.query);

    res.status(200).json({
      success: true,
      data: result.items,
      message: "Companies retrieved successfully",
      meta: result.meta,
    });
  });

  getCompanyById = asyncHandler(async (req: Request, res: Response) => {
    const company = await companiesService.getCompanyById(req.params.id);

    res.status(200).json({
      success: true,
      data: company,
      message: "Company details retrieved successfully",
    });
  });

  createCompany = asyncHandler(async (req: Request, res: Response) => {
    const company = await companiesService.createCompany(req.body);

    res.status(201).json({
      success: true,
      data: company,
      message: "Company created successfully",
    });
  });

  updateCompany = asyncHandler(async (req: Request, res: Response) => {
    const company = await companiesService.updateCompany(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: company,
      message: "Company updated successfully",
    });
  });

  deleteCompany = asyncHandler(async (req: Request, res: Response) => {
    await companiesService.deleteCompany(req.params.id);

    res.status(200).json({
      success: true,
      data: null,
      message: "Company deleted successfully",
    });
  });
}

export const companiesController = new CompaniesController();
