// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// useCreateInquiry Mutation Hook
// =============================================================================

import { useMutation } from "@tanstack/react-query";
import { inquiriesApi, CreateInquiryInput } from "../api/inquiries";

export const useCreateInquiry = () => {
  return useMutation({
    mutationFn: (data: CreateInquiryInput) => inquiriesApi.createInquiry(data),
  });
};

export default useCreateInquiry;
