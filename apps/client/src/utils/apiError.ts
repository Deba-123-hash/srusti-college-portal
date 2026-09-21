// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Standardized API Error Parser & Normalizer
// =============================================================================

import { AxiosError } from "axios";
import { ApiErrorResponse } from "@srusti/shared";

export interface NormalizedError {
  code: string;
  message: string;
  details?: unknown;
  status?: number;
}

/**
 * Parses Axios and generic errors into a clean, user-friendly NormalizedError object.
 */
export function parseApiError(error: unknown, fallbackMessage = "An unexpected error occurred. Please try again."): NormalizedError {
  if (!error) {
    return {
      code: "UNKNOWN_ERROR",
      message: fallbackMessage,
    };
  }

  // Handle Axios Error
  if (typeof error === "object" && error !== null && "isAxiosError" in error) {
    const axiosErr = error as AxiosError<ApiErrorResponse>;
    const status = axiosErr.response?.status;
    const responseData = axiosErr.response?.data;

    // Backend standardized ApiErrorResponse envelope
    if (responseData && typeof responseData === "object" && "error" in responseData) {
      return {
        code: responseData.error.code || `HTTP_${status || "UNKNOWN"}`,
        message: responseData.error.message || fallbackMessage,
        details: responseData.error.details,
        status,
      };
    }

    // Network / Offline error
    if (axiosErr.code === "ERR_NETWORK" || !axiosErr.response) {
      return {
        code: "NETWORK_ERROR",
        message: "Unable to connect to the portal server. Please verify your internet connection.",
        status: 0,
      };
    }

    // Standard HTTP status fallbacks
    if (status === 400) {
      return { code: "BAD_REQUEST", message: "Invalid request parameters.", status };
    }
    if (status === 401) {
      return { code: "UNAUTHORIZED", message: "Your session has expired. Please sign in again.", status };
    }
    if (status === 403) {
      return { code: "FORBIDDEN", message: "You do not have permission to perform this action.", status };
    }
    if (status === 404) {
      return { code: "NOT_FOUND", message: "The requested resource could not be found.", status };
    }
    if (status && status >= 500) {
      return { code: "SERVER_ERROR", message: "A server-side error occurred. Our technical team has been alerted.", status };
    }

    return {
      code: `HTTP_${status || "ERROR"}`,
      message: axiosErr.message || fallbackMessage,
      status,
    };
  }

  // Standard Error instance
  if (error instanceof Error) {
    return {
      code: "ERROR",
      message: error.message || fallbackMessage,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: typeof error === "string" ? error : fallbackMessage,
  };
}

export default parseApiError;
