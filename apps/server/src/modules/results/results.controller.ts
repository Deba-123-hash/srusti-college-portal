// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Results Module Controller
// =============================================================================

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { resultsService } from "./results.service";

export class ResultsController {
  getResults = asyncHandler(async (req: Request, res: Response) => {
    const result = await resultsService.getResults(req.query as any, req.user!);

    res.status(200).json({
      success: true,
      data: result.items,
      message: "Results retrieved successfully",
      meta: result.meta,
    });
  });

  getResultById = asyncHandler(async (req: Request, res: Response) => {
    const result = await resultsService.getResultById(req.params.id, req.user!);

    res.status(200).json({
      success: true,
      data: result,
      message: "Result retrieved successfully",
    });
  });

  createResult = asyncHandler(async (req: Request, res: Response) => {
    const result = await resultsService.createResult(req.body, req.user!);

    res.status(201).json({
      success: true,
      data: result,
      message: "Result recorded successfully",
    });
  });

  updateResult = asyncHandler(async (req: Request, res: Response) => {
    const updated = await resultsService.updateResult(
      req.params.id,
      req.body,
      req.user!
    );

    res.status(200).json({
      success: true,
      data: updated,
      message: "Result updated successfully",
    });
  });

  publishResults = asyncHandler(async (req: Request, res: Response) => {
    const result = await resultsService.publishResults(
      req.body,
      req.user!,
      req.ip
    );

    res.status(200).json({
      success: true,
      data: result,
      message: `${result.publishedCount} result(s) successfully published`,
    });
  });
}

export const resultsController = new ResultsController();
