// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Events API Service Layer
// =============================================================================

import { api } from "../lib/api";
import { ApiResponse, PaginationMeta } from "@srusti/shared";

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  eventDate: string;
  time: string;
  venue: string;
  capacity: number;
  bannerUrl?: string | null;
  isRegistrationOpen: boolean;
  isPublished: boolean;
  registeredCount?: number;
  isUserRegistered?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventsQueryParams {
  category?: string;
  search?: string;
  upcoming?: boolean | string;
  page?: number | string;
  limit?: number | string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  studentId: string;
  registeredAt: string;
  event: Event;
}

export const eventsApi = {
  getEvents: async (params?: EventsQueryParams): Promise<{ data: Event[]; meta?: PaginationMeta }> => {
    const res = await api.get<ApiResponse<Event[]>>("/events", { params });
    return {
      data: res.data.data,
      meta: res.data.meta,
    };
  },

  getMyRegistrations: async (): Promise<EventRegistration[]> => {
    const res = await api.get<ApiResponse<EventRegistration[]>>("/events/my-registrations");
    return res.data.data;
  },

  getEventById: async (id: string): Promise<Event> => {
    const res = await api.get<ApiResponse<Event>>(`/events/${id}`);
    return res.data.data;
  },

  registerForEvent: async (eventId: string): Promise<void> => {
    await api.post(`/events/${eventId}/register`);
  },

  cancelRegistration: async (eventId: string): Promise<void> => {
    await api.delete(`/events/${eventId}/register`);
  },
};

export default eventsApi;
