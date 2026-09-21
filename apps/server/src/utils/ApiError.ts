// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Typed Application Error Class
// =============================================================================

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: any;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    code = "INTERNAL_SERVER_ERROR",
    details: any = null,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  // --- Static Helper Factories ---

  public static badRequest(
    message = "Bad Request",
    code = "BAD_REQUEST",
    details: any = null
  ): ApiError {
    return new ApiError(400, message, code, details);
  }

  public static unauthorized(
    message = "Authentication required",
    code = "UNAUTHORIZED"
  ): ApiError {
    return new ApiError(401, message, code);
  }

  public static forbidden(
    message = "Access forbidden",
    code = "FORBIDDEN"
  ): ApiError {
    return new ApiError(403, message, code);
  }

  public static notFound(
    message = "Resource not found",
    code = "RESOURCE_NOT_FOUND"
  ): ApiError {
    return new ApiError(404, message, code);
  }

  public static conflict(
    message = "Resource conflict",
    code = "CONFLICT",
    details: any = null
  ): ApiError {
    return new ApiError(409, message, code, details);
  }

  public static unprocessable(
    message = "Unprocessable entity",
    code = "VALIDATION_ERROR",
    details: any = null
  ): ApiError {
    return new ApiError(422, message, code, details);
  }

  public static tooManyRequests(
    message = "Too many requests. Please try again later.",
    code = "RATE_LIMIT_EXCEEDED"
  ): ApiError {
    return new ApiError(429, message, code);
  }

  public static internal(
    message = "An unexpected error occurred. Please try again later.",
    code = "INTERNAL_SERVER_ERROR",
    details: any = null
  ): ApiError {
    return new ApiError(500, message, code, details, false);
  }

  public static serviceUnavailable(
    message = "Service temporarily unavailable. Please try again later.",
    code = "SERVICE_UNAVAILABLE"
  ): ApiError {
    return new ApiError(503, message, code, null, false);
  }
}
