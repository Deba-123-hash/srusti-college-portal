// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Placements Module Types
// =============================================================================

import { PlacementStatus } from "@prisma/client";

export interface CreatePlacementDriveDto {
  companyId: string;
  jobRole: string;
  ctcPackage: string;
  eligibleCourses: string; // Comma separated or text e.g. "MCA, BCA, MBA"
  minCgpa?: number;
  driveDate: string; // YYYY-MM-DD
  location: string;
  description: string;
  deadline: string; // YYYY-MM-DD
  isActive?: boolean;
}

export interface UpdatePlacementDriveDto {
  companyId?: string;
  jobRole?: string;
  ctcPackage?: string;
  eligibleCourses?: string;
  minCgpa?: number;
  driveDate?: string;
  location?: string;
  description?: string;
  deadline?: string;
  isActive?: boolean;
}

export interface DriveFilterParams {
  active?: boolean;
  course?: string;
  companyId?: string;
  date?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UpdateApplicationDto {
  status: PlacementStatus;
  notes?: string | null;
}

export interface ApplicationFilterParams {
  driveId?: string;
  status?: PlacementStatus;
  studentId?: string;
  page?: number;
  limit?: number;
}
