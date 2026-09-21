// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Students Module Types
// =============================================================================

export interface CreateStudentDto {
  name: string;
  email: string;
  password?: string;
  regNo: string;
  departmentId: string;
  courseId: string;
  currentSemester?: number;
  enrollmentYear?: number;
  phone?: string | null;
  cgpa?: number;
}

export interface UpdateStudentDto {
  name?: string;
  phone?: string | null;
  currentSemester?: number;
  cgpa?: number;
  departmentId?: string;
  courseId?: string;
}

export interface StudentFilterParams {
  search?: string;
  regNo?: string;
  departmentId?: string;
  courseId?: string;
  semester?: number;
  page?: number;
  limit?: number;
}
