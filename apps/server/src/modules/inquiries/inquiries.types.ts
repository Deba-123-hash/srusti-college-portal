// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Inquiries Module Types
// =============================================================================

import { InquiryStatus } from "@prisma/client";

export interface CreateInquiryDto {
  name: string;
  email: string;
  phone: string;
  courseOfInterest?: string | null;
  message: string;
  type?: string;
  source?: string; // alias for type
}

export interface UpdateInquiryDto {
  status?: InquiryStatus;
  isRead?: boolean;
  notes?: string | null;
}

export interface InquiryFilterParams {
  type?: string;
  status?: InquiryStatus;
  isRead?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
