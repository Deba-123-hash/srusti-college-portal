// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Announcements Module Types
// =============================================================================

export interface CreateAnnouncementDto {
  title: string;
  content: string;
  category?: string;
  isPinned?: boolean;
  expiresAt?: string | null;
}

export interface UpdateAnnouncementDto {
  title?: string;
  content?: string;
  category?: string;
  isPinned?: boolean;
  expiresAt?: string | null;
}

export interface AnnouncementFilterParams {
  search?: string;
  category?: string;
  pinnedOnly?: boolean;
  includeExpired?: boolean;
  page?: number;
  limit?: number;
}
