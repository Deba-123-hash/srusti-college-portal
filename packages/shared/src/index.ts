// ============================================================================
// Srusti Academy of Management and Technology — College Portal
// Shared Package: Constants, Envelope Types, and Global Schemas
// ============================================================================

/**
 * Standard API Version string used across client and server.
 */
export const API_VERSION = "v1";

/**
 * Institutional details
 */
export const COLLEGE_NAME = "Srusti Academy of Management and Technology";
export const COLLEGE_ADDRESS =
  "38/1, Chandaka Industrial Estate, Near Infocity, Patia, Bhubaneswar, Odisha 751024";

// ============================================================================
// Standard API Envelope Types
// ============================================================================

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface ApiErrorDetail {
  code?: string;
  message: string;
  field?: string;
  details?: any;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export * from "./auth";
