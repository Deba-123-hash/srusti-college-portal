// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Student Placements Hook
// =============================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentPlacementsApi } from "../api/studentPlacements";
import { useToast } from "./useToast";
import { parseApiError } from "../utils/apiError";

export const STUDENT_PLACEMENTS_APPLICATIONS_KEY = ["student", "placements", "applications"] as const;
export const STUDENT_PLACEMENTS_DRIVES_KEY = ["student", "placements", "drives"] as const;

export const useStudentApplications = () => {
  return useQuery({
    queryKey: STUDENT_PLACEMENTS_APPLICATIONS_KEY,
    queryFn: studentPlacementsApi.getMyApplications,
    staleTime: 1000 * 60 * 2,
  });
};

export const useAvailableDrives = () => {
  return useQuery({
    queryKey: STUDENT_PLACEMENTS_DRIVES_KEY,
    queryFn: studentPlacementsApi.getAvailableDrives,
    staleTime: 1000 * 60 * 3,
  });
};

export const useApplyToDrive = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (driveId: string) => studentPlacementsApi.applyToDrive(driveId),
    onSuccess: () => {
      toast.success("Application submitted successfully for this campus drive.");
      queryClient.invalidateQueries({ queryKey: STUDENT_PLACEMENTS_APPLICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: ["student", "dashboard"] });
    },
    onError: (err) => {
      const errorMsg = parseApiError(err);
      toast.error(errorMsg.message);
    },
  });
};
