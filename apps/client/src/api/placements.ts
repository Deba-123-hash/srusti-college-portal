// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Placements & Companies API Service Layer
// =============================================================================

import { api } from "../lib/api";
import { ApiResponse, PaginationMeta } from "@srusti/shared";

export interface Company {
  id: string;
  name: string;
  website?: string | null;
  logoUrl?: string | null;
  industry: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlacementDrive {
  id: string;
  companyId: string;
  company: Company;
  jobRole: string;
  ctcPackage: string;
  eligibleCourses: string;
  minCgpa: number;
  driveDate: string;
  location: string;
  description: string;
  deadline: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlacementDrivesQueryParams {
  companyId?: string;
  search?: string;
  activeOnly?: boolean | string;
  page?: number | string;
  limit?: number | string;
}

export const placementsApi = {
  getPlacementDrives: async (
    params?: PlacementDrivesQueryParams
  ): Promise<{ data: PlacementDrive[]; meta?: PaginationMeta }> => {
    const res = await api.get<ApiResponse<PlacementDrive[]>>("/placements/drives", {
      params,
    });
    return {
      data: res.data.data,
      meta: res.data.meta,
    };
  },

  getDriveById: async (id: string): Promise<PlacementDrive> => {
    const res = await api.get<ApiResponse<PlacementDrive>>(`/placements/drives/${id}`);
    return res.data.data;
  },

  getCompanies: async (params?: { search?: string; page?: number | string; limit?: number | string }): Promise<{ data: Company[]; meta?: PaginationMeta }> => {
    const res = await api.get<ApiResponse<Company[]>>("/companies", { params });
    return {
      data: res.data.data,
      meta: res.data.meta,
    };
  },
};

export default placementsApi;
