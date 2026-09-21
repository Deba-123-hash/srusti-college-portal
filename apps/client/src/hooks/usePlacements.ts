// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// usePlacements & useCompanies Hooks
// =============================================================================

import { useQuery } from "@tanstack/react-query";
import { placementsApi, PlacementDrivesQueryParams } from "../api/placements";

export const usePlacementDrives = (params?: PlacementDrivesQueryParams) => {
  return useQuery({
    queryKey: ["placement-drives", params],
    queryFn: () => placementsApi.getPlacementDrives(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePlacementDriveById = (id: string) => {
  return useQuery({
    queryKey: ["placement-drive", id],
    queryFn: () => placementsApi.getDriveById(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCompanies = (params?: { search?: string; page?: number | string; limit?: number | string }) => {
  return useQuery({
    queryKey: ["companies", params],
    queryFn: () => placementsApi.getCompanies(params),
    staleTime: 10 * 60 * 1000,
  });
};

export default usePlacementDrives;
