// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Student Events Hook
// =============================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi, EventsQueryParams } from "../api/events";
import { useToast } from "./useToast";
import { parseApiError } from "../utils/apiError";

export const STUDENT_EVENT_REGISTRATIONS_KEY = ["student", "events", "registrations"] as const;
export const STUDENT_EVENTS_KEY = ["student", "events", "list"] as const;

export const useStudentEvents = (params?: EventsQueryParams) => {
  return useQuery({
    queryKey: [...STUDENT_EVENTS_KEY, params],
    queryFn: () => eventsApi.getEvents(params),
    staleTime: 1000 * 60 * 2,
  });
};

export const useStudentRegistrations = () => {
  return useQuery({
    queryKey: STUDENT_EVENT_REGISTRATIONS_KEY,
    queryFn: eventsApi.getMyRegistrations,
    staleTime: 1000 * 60 * 2,
  });
};

export const useRegisterForEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (eventId: string) => eventsApi.registerForEvent(eventId),
    onSuccess: () => {
      toast.success("Successfully registered for the event!");
      queryClient.invalidateQueries({ queryKey: STUDENT_EVENT_REGISTRATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: STUDENT_EVENTS_KEY });
      queryClient.invalidateQueries({ queryKey: ["student", "dashboard"] });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

export const useCancelEventRegistration = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (eventId: string) => eventsApi.cancelRegistration(eventId),
    onSuccess: () => {
      toast.info("Event registration cancelled.");
      queryClient.invalidateQueries({ queryKey: STUDENT_EVENT_REGISTRATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: STUDENT_EVENTS_KEY });
      queryClient.invalidateQueries({ queryKey: ["student", "dashboard"] });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};
