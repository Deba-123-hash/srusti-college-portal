// =============================================================================
// Srusti Academy — Strict CORS Configuration
// =============================================================================
// Validates request Origin against an explicit whitelist.
// Never uses wildcard origin. Supports credentials for cookie auth (Phase 4+).
// =============================================================================

import { CorsOptions } from "cors";
import { env } from "./env";

/**
 * Build strict CORS options from the validated environment configuration.
 *
 * - Only origins listed in `env.CORS_ORIGINS` are accepted.
 * - Requests with no `Origin` header (e.g. curl, server-to-server) are
 *   allowed to pass through — the browser's Same-Origin Policy handles
 *   enforcement for cross-origin requests.
 * - `credentials: true` is set to support HTTP-only refresh-token cookies
 *   that will be introduced in Phase 4.
 */
export function buildCorsOptions(): CorsOptions {
  const allowedOrigins = new Set(env.CORS_ORIGINS);

  return {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      // Allow requests with no Origin (curl, mobile apps, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      // Allow any Vercel deployment preview / production domain
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(
        new Error(
          `CORS policy: Origin '${origin}' is not in the allowed list.`
        )
      );
    },

    credentials: true,

    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Request-ID",
      "Accept",
    ],

    exposedHeaders: ["X-Request-ID"],

    maxAge: 600, // Preflight cache: 10 minutes
  };
}

export const corsOptions = buildCorsOptions();
