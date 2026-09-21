// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Courses Module Types
// =============================================================================

export interface CreateCourseDto {
  name: string;
  slug: string;
  code?: string | null;
  departmentId: string;
  durationYears: number;
  eligibility: string;
  totalFees: number;
  description: string;
  syllabusUrl?: string | null;
}

export interface UpdateCourseDto {
  name?: string;
  slug?: string;
  code?: string | null;
  departmentId?: string;
  durationYears?: number;
  eligibility?: string;
  totalFees?: number;
  description?: string;
  syllabusUrl?: string | null;
}

export interface CourseFilterParams {
  search?: string;
  departmentId?: string;
  page?: number;
  limit?: number;
}
