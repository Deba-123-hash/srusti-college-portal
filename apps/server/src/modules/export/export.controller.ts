// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Admin Data Export Controller
// =============================================================================

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { exportService } from "./export.service";

export class ExportController {
  exportResource = asyncHandler(async (req: Request, res: Response) => {
    const format = String(req.query.format || "json").toLowerCase();
    const result = await exportService.exportResource(
      req.params.resource,
      format,
      req.user!,
      req.ip
    );

    if (result.isCsv) {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${result.filename}"`
      );
      return res.status(200).send(result.data);
    }

    res.status(200).json({
      success: true,
      data: result.data,
      message: `Export data for ${req.params.resource} generated successfully`,
    });
  });
}

export const exportController = new ExportController();
