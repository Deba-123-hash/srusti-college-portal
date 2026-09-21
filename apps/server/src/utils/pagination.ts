// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Centralized Pagination Utility
// =============================================================================

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const MIN_LIMIT = 1;

/**
 * Parses and sanitizes page and limit query parameters.
 * Enforces safe boundaries (min 1, max 100).
 */
export function parsePagination(query: {
  page?: any;
  limit?: any;
}): PaginationParams {
  let page = parseInt(String(query.page), 10);
  if (isNaN(page) || page < 1) {
    page = DEFAULT_PAGE;
  }

  let limit = parseInt(String(query.limit), 10);
  if (isNaN(limit) || limit < MIN_LIMIT) {
    limit = DEFAULT_LIMIT;
  } else if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    take: limit,
  };
}

/**
 * Builds the standard meta response envelope for paginated queries.
 */
export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}
