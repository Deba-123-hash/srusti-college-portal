// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Student Placements API Service Layer
// =============================================================================

import { api } from "../lib/api";
import { ApiResponse, PaginationMeta } from "@srusti/shared";
import { PlacementDrive } from "./placements";

export type PlacementStatus = "APPLIED" | "SHORTLISTED" | "INTERVIEW" | "SELECTED" | "REJECTED";

export interface StudentPlacementApplication {
  id: string;
  driveId: string;
  studentId: string;
  status: PlacementStatus;
  notes?: string | null;
  appliedAt: string;
  drive: PlacementDrive;
}

export const studentPlacementsApi = {
  getMyApplications: async (): Promise<StudentPlacementApplication[]> => {
    const res = await api.get<ApiResponse<StudentPlacementApplication[]>>("/placements/my-applications");
    return res.data.data;
  },

  applyToDrive: async (driveId: string): Promise<StudentPlacementApplication> => {
    const res = await api.post<ApiResponse<StudentPlacementApplication>>(`/placements/drives/${driveId}/apply`);
    return res.data.data;
  },

  getAvailableDrives: async (): Promise<PlacementDrive[]> => {
    const res = await api.get<ApiResponse<PlacementDrive[]>>("/placements/drives?active=true");
    return res.data.data;
  },
};

export default studentPlacementsApi;
