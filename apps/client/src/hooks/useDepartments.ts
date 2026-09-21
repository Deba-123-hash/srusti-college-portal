// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// useDepartments Hook
// =============================================================================

import { useQuery } from "@tanstack/react-query";
import { departmentsApi } from "../api/departments";

export const useDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => departmentsApi.getDepartments(),
    staleTime: 15 * 60 * 1000,
  });
};

export default useDepartments;
