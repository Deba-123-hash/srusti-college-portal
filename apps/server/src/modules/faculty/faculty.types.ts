// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Faculty Module Types
// =============================================================================

export interface CreateFacultyDto {
  name: string;
  email: string;
  password?: string;
  departmentId: string;
  designation: string;
  phone?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  subjectIds?: string[];
}

export interface UpdateFacultyDto {
  name?: string;
  designation?: string;
  phone?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  departmentId?: string;
  subjectIds?: string[];
}

export interface FacultyFilterParams {
  search?: string;
  departmentId?: string;
  page?: number;
  limit?: number;
}
