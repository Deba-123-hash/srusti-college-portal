// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Student Dashboard Hook
// =============================================================================

import { useQuery } from "@tanstack/react-query";
import { studentApi } from "../api/student";

export const STUDENT_DASHBOARD_QUERY_KEY = ["student", "dashboard"] as const;
export const STUDENT_PROFILE_QUERY_KEY = ["student", "profile"] as const;

export const useStudentDashboard = () => {
  return useQuery({
    queryKey: STUDENT_DASHBOARD_QUERY_KEY,
    queryFn: studentApi.getDashboard,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useStudentProfile = () => {
  return useQuery({
    queryKey: STUDENT_PROFILE_QUERY_KEY,
    queryFn: studentApi.getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
