// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Centralized Winston Logger & HTTP Logging Stream
// =============================================================================

import winston from "winston";
import { env } from "../config/env";

const SENSITIVE_KEYS = [
  "password",
  "passwordhash",
  "token",
  "accesstoken",
  "refreshtoken",
  "secret",
  "authorization",
  "cookie",
  "otp",
  "privatekey",
  "database_url",
  "redis_url",
  "databaseurl",
  "redisurl",
];

/**
 * Deeply sanitizes sensitive fields in log metadata to prevent accidental leaks.
 */
function sanitizeMeta(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeMeta(item));
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase().replace(/[-_]/g, "");
    if (SENSITIVE_KEYS.some((s) => lowerKey.includes(s))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object") {
      sanitized[key] = sanitizeMeta(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

const redactFormat = winston.format((info) => {
  for (const key of Object.keys(info)) {
    if (key !== "level") {
      info[key] = sanitizeMeta(info[key]);
    }
  }
  return info;
});

const isDev = env.NODE_ENV === "development";

export const logger = winston.createLogger({
  level: isDev ? "debug" : "info",
  format: winston.format.combine(
    redactFormat(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    isDev
      ? winston.format.combine(
          winston.format.colorize(),
          winston.format.printf((info) => {
            const { timestamp, level, message, requestId, stack, ...meta } =
              info as any;
            const reqIdStr = requestId ? ` [${requestId}]` : "";
            const metaStr =
              Object.keys(meta).length > 0
                ? `\n  ${JSON.stringify(meta, null, 2)}`
                : "";
            const stackStr = stack ? `\n  ${stack}` : "";
            return `[${timestamp}] ${level}${reqIdStr}: ${message}${metaStr}${stackStr}`;
          })
        )
      : winston.format.json()
  ),
  defaultMeta: { service: "srusti-portal-server" },
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
  exitOnError: false,
});

/**
 * Stream adapter for Morgan HTTP access logging.
 * Feeds HTTP request logs cleanly through the Winston logger at info level.
 */
export const morganStream = {
  write: (message: string) => {
    logger.info(message.trim(), { context: "HTTP" });
  },
};
