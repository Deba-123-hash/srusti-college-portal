// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// useCourses & useCourse Hooks
// =============================================================================

import { useQuery } from "@tanstack/react-query";
import { coursesApi, CoursesQueryParams } from "../api/courses";

export const useCourses = (params?: CoursesQueryParams) => {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => coursesApi.getCourses(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCourseBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["course", slug],
    queryFn: () => coursesApi.getCourseBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCourseById = (id: string) => {
  return useQuery({
    queryKey: ["course", "id", id],
    queryFn: () => coursesApi.getCourseById(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
};

export default useCourses;
