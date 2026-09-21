// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Student Notifications Hook
// =============================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi, NotificationQueryParams } from "../api/notifications";
import { useToast } from "./useToast";
import { parseApiError } from "../utils/apiError";

export const STUDENT_NOTIFICATIONS_KEY = ["student", "notifications"] as const;

export const useStudentNotifications = (params?: NotificationQueryParams) => {
  return useQuery({
    queryKey: [...STUDENT_NOTIFICATIONS_KEY, params],
    queryFn: () => notificationsApi.getMyNotifications(params),
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: ["student", "dashboard"] });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      toast.success("All notifications marked as read.");
      queryClient.invalidateQueries({ queryKey: STUDENT_NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: ["student", "dashboard"] });
    },
    onError: (err) => {
      toast.error(parseApiError(err).message);
    },
  });
};
