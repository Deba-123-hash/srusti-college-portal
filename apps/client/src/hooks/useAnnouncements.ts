// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// useAnnouncements Hook
// =============================================================================

import { useQuery } from "@tanstack/react-query";
import { announcementsApi, AnnouncementsQueryParams } from "../api/announcements";

export const useAnnouncements = (params?: AnnouncementsQueryParams) => {
  return useQuery({
    queryKey: ["announcements", params],
    queryFn: () => announcementsApi.getAnnouncements(params),
    staleTime: 2 * 60 * 1000,
  });
};

export default useAnnouncements;
