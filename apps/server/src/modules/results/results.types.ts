// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Results Module Types
// =============================================================================

export interface CreateResultDto {
  studentId: string;
  subjectId: string;
  semester: number;
  internalMarks: number;
  externalMarks: number;
  totalMarks?: number;
  grade: string;
  credits?: number;
}

export interface UpdateResultDto {
  internalMarks?: number;
  externalMarks?: number;
  totalMarks?: number;
  grade?: string;
  credits?: number;
  isPublished?: boolean;
}

export interface PublishResultsDto {
  subjectId?: string;
  semester?: number;
  courseId?: string;
}

export interface ResultFilterParams {
  studentId?: string;
  subjectId?: string;
  semester?: number;
  isPublished?: boolean;
  page?: number;
  limit?: number;
}
