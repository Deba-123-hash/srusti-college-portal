// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Inquiries API Service Layer
// =============================================================================

import { api } from "../lib/api";
import { ApiResponse } from "@srusti/shared";

export interface CreateInquiryInput {
  name: string;
  email: string;
  phone: string;
  courseOfInterest?: string | null;
  message: string;
  type?: string; // "ADMISSION" | "CONTACT" | "GENERAL"
  source?: string;
}

export interface InquiryResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseOfInterest?: string | null;
  message: string;
  type: string;
  status: string;
  createdAt: string;
}

export const inquiriesApi = {
  createInquiry: async (data: CreateInquiryInput): Promise<InquiryResponse> => {
    const res = await api.post<ApiResponse<InquiryResponse>>("/inquiries", data);
    return res.data.data;
  },
};

export default inquiriesApi;
