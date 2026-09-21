// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Departments API Service Layer
// =============================================================================

import { api } from "../lib/api";
import { ApiResponse, PaginationMeta } from "@srusti/shared";

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const departmentsApi = {
  getDepartments: async (): Promise<{ data: Department[]; meta?: PaginationMeta }> => {
    const res = await api.get<ApiResponse<Department[]>>("/departments");
    return {
      data: res.data.data,
      meta: res.data.meta,
    };
  },
};

export default departmentsApi;
