// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Inquiries Module Controller
// =============================================================================

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { inquiriesService } from "./inquiries.service";

export class InquiriesController {
  getInquiries = asyncHandler(async (req: Request, res: Response) => {
    const result = await inquiriesService.getInquiries(req.query as any);

    res.status(200).json({
      success: true,
      data: result.items,
      message: "Inquiries retrieved successfully",
      meta: result.meta,
    });
  });

  getInquiryById = asyncHandler(async (req: Request, res: Response) => {
    const inquiry = await inquiriesService.getInquiryById(req.params.id);

    res.status(200).json({
      success: true,
      data: inquiry,
      message: "Inquiry retrieved successfully",
    });
  });

  createInquiry = asyncHandler(async (req: Request, res: Response) => {
    const inquiry = await inquiriesService.createInquiry(req.body);

    res.status(201).json({
      success: true,
      data: inquiry,
      message: "Inquiry submitted successfully. We will get back to you soon.",
    });
  });

  updateInquiry = asyncHandler(async (req: Request, res: Response) => {
    const updated = await inquiriesService.updateInquiry(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: updated,
      message: "Inquiry updated successfully",
    });
  });

  deleteInquiry = asyncHandler(async (req: Request, res: Response) => {
    await inquiriesService.deleteInquiry(req.params.id);

    res.status(200).json({
      success: true,
      data: null,
      message: "Inquiry deleted successfully",
    });
  });
}

export const inquiriesController = new InquiriesController();
