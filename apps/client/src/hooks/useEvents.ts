// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// useEvents & useEvent Hooks
// =============================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi, EventsQueryParams } from "../api/events";

export const useEvents = (params?: EventsQueryParams) => {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => eventsApi.getEvents(params),
    staleTime: 3 * 60 * 1000,
  });
};

export const useEventById = (id: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => eventsApi.getEventById(id),
    enabled: Boolean(id),
    staleTime: 3 * 60 * 1000,
  });
};

export const useRegisterEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventsApi.registerForEvent(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export default useEvents;
