// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Student Results Hook
// =============================================================================

import { useQuery } from "@tanstack/react-query";
import { studentResultsApi, ResultsFilterParams } from "../api/studentResults";

export const STUDENT_RESULTS_KEY = ["student", "results"] as const;

export const useStudentResults = (params?: ResultsFilterParams) => {
  return useQuery({
    queryKey: [...STUDENT_RESULTS_KEY, params],
    queryFn: () => studentResultsApi.getMyResults(params),
    staleTime: 1000 * 60 * 5,
  });
};
