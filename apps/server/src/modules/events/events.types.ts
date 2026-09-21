// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Events Module Types
// =============================================================================

export interface CreateEventDto {
  title: string;
  description: string;
  category: string;
  eventDate: string; // YYYY-MM-DD
  time: string;
  venue: string;
  capacity: number;
  bannerUrl?: string | null;
  isRegistrationOpen?: boolean;
  isPublished?: boolean;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  category?: string;
  eventDate?: string;
  time?: string;
  venue?: string;
  capacity?: number;
  bannerUrl?: string | null;
  isRegistrationOpen?: boolean;
  isPublished?: boolean;
}

export interface EventFilterParams {
  search?: string;
  category?: string;
  date?: string;
  isPublished?: boolean;
  page?: number;
  limit?: number;
}
