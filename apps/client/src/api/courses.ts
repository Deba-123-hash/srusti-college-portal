// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Courses API Service Layer
// =============================================================================

import { api } from "../lib/api";
import { ApiResponse, PaginationMeta } from "@srusti/shared";

export interface Course {
  id: string;
  name: string;
  slug: string;
  code?: string | null;
  departmentId: string;
  department?: {
    id: string;
    name: string;
    code: string;
    description?: string | null;
  };
  durationYears: number;
  eligibility: string;
  totalFees: number;
  description: string;
  syllabusUrl?: string | null;
  subjects?: Array<{
    id: string;
    name: string;
    code: string;
    semester: number;
    credits: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CoursesQueryParams {
  departmentId?: string;
  search?: string;
  page?: number | string;
  limit?: number | string;
}

export const coursesApi = {
  getCourses: async (params?: CoursesQueryParams): Promise<{ data: Course[]; meta?: PaginationMeta }> => {
    const res = await api.get<ApiResponse<Course[]>>("/courses", { params });
    return {
      data: res.data.data,
      meta: res.data.meta,
    };
  },

  getCourseBySlug: async (slug: string): Promise<Course> => {
    const res = await api.get<ApiResponse<Course>>(`/courses/slug/${encodeURIComponent(slug)}`);
    return res.data.data;
  },

  getCourseById: async (id: string): Promise<Course> => {
    const res = await api.get<ApiResponse<Course>>(`/courses/${id}`);
    return res.data.data;
  },
};

export default coursesApi;
