// =============================================================================
// Srusti Academy — Centralized Environment Configuration
// =============================================================================
// All environment variables are read, validated, and typed here.
// No other module should access process.env directly.
// =============================================================================

import dotenv from "dotenv";
import { z } from "zod";

// Ensure environment variables from .env are loaded into process.env
dotenv.config();

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const envSchema = z.object({
  // Core
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().positive().default(8000),
  HEALTH_PORT: z.coerce.number().int().positive().default(8081),

  CLIENT_URL: z.string().url().default("http://localhost:3000"),

  // CORS — comma-separated origin whitelist
  CORS_ORIGINS: z
    .string()
    .default("http://localhost:3000,http://localhost:5173")
    .transform((val) =>
      val
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    ),

  // Infrastructure (required)
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),

  // JWT — required in production, optional in development (Phase 4+)
  JWT_PRIVATE_KEY: z.string().optional(),
  JWT_PUBLIC_KEY: z.string().optional(),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  // SMTP — optional until Phase 9
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().optional(),

  // Cloudinary — optional until Phase 8
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Validate & Export
// ---------------------------------------------------------------------------

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment configuration. The following issues were found:\n"
  );
  for (const issue of parsed.error.issues) {
    console.error(`  • ${issue.path.join(".")}: ${issue.message}`);
  }
  console.error(
    "\nPlease check your .env file and ensure all required variables are set."
  );
  process.exit(1);
}

export const env = parsed.data;

// Convenience flags
export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";
export const isTest = env.NODE_ENV === "test";

export type Env = z.infer<typeof envSchema>;
