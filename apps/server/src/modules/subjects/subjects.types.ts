// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Subjects Module Types
// =============================================================================

export interface CreateSubjectDto {
  name: string;
  code: string;
  courseId: string;
  semester: number;
  credits?: number;
  facultyId?: string | null;
}

export interface UpdateSubjectDto {
  name?: string;
  code?: string;
  courseId?: string;
  semester?: number;
  credits?: number;
  facultyId?: string | null;
}

export interface SubjectFilterParams {
  courseId?: string;
  semester?: number;
  search?: string;
  page?: number;
  limit?: number;
}
