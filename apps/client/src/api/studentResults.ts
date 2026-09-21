// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Student Results API Service Layer
// =============================================================================

import { api } from "../lib/api";
import { ApiResponse, PaginationMeta } from "@srusti/shared";

export interface StudentResult {
  id: string;
  studentId: string;
  subjectId: string;
  semester: number;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  grade: string;
  credits: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  subject: {
    id: string;
    name: string;
    code: string;
    semester: number;
    facultyId?: string | null;
  };
  student?: {
    id: string;
    regNo: string;
    currentSemester: number;
    user: {
      name: string;
      email: string;
    };
    course: {
      name: string;
      code: string | null;
    };
  };
}

export interface ResultsFilterParams {
  semester?: number;
  subjectId?: string;
  page?: number;
  limit?: number;
}

export const studentResultsApi = {
  getMyResults: async (params?: ResultsFilterParams): Promise<{ data: StudentResult[]; meta?: PaginationMeta }> => {
    const res = await api.get<ApiResponse<StudentResult[]>>("/results", { params });
    return {
      data: res.data.data,
      meta: res.data.meta,
    };
  },
};

export default studentResultsApi;
