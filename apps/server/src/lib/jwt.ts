// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// JWT Utilities (RS256 Asymmetric Key Signing & Verification)
// =============================================================================

import fs from "fs";
import path from "path";
import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { JwtAccessTokenPayload } from "@srusti/shared";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { logger } from "./logger";

// ---------------------------------------------------------------------------
// Key Retrieval Helpers
// ---------------------------------------------------------------------------

function formatPem(key: string): string {
  // If base64 encoded, decode it
  if (!key.includes("-----BEGIN") && /^[A-Za-z0-9+/=]+$/.test(key.trim())) {
    try {
      const decoded = Buffer.from(key.trim(), "base64").toString("utf-8");
      if (decoded.includes("-----BEGIN")) {
        return decoded;
      }
    } catch {
      // Fall through if decode fails
    }
  }

  // If escaped with literal \n, replace with real newlines
  if (key.includes("\\n")) {
    return key.replace(/\\n/g, "\n");
  }

  return key;
}

let privateKeyCache: string | null = null;
let publicKeyCache: string | null = null;

export function getPrivateKey(): string {
  if (privateKeyCache) return privateKeyCache;

  if (env.JWT_PRIVATE_KEY) {
    privateKeyCache = formatPem(env.JWT_PRIVATE_KEY);
    return privateKeyCache;
  }

  // Fallback to local keys directory if configured
  const localKeyPath = path.resolve(__dirname, "../../keys/private.pem");
  if (fs.existsSync(localKeyPath)) {
    privateKeyCache = fs.readFileSync(localKeyPath, "utf-8");
    return privateKeyCache;
  }

  throw new Error("RS256 JWT private key not configured in environment or keys directory");
}

export function getPublicKey(): string {
  if (publicKeyCache) return publicKeyCache;

  if (env.JWT_PUBLIC_KEY) {
    publicKeyCache = formatPem(env.JWT_PUBLIC_KEY);
    return publicKeyCache;
  }

  // Fallback to local keys directory if configured
  const localKeyPath = path.resolve(__dirname, "../../keys/public.pem");
  if (fs.existsSync(localKeyPath)) {
    publicKeyCache = fs.readFileSync(localKeyPath, "utf-8");
    return publicKeyCache;
  }

  throw new Error("RS256 JWT public key not configured in environment or keys directory");
}

// ---------------------------------------------------------------------------
// RS256 Token Operations
// ---------------------------------------------------------------------------

/**
 * Sign an asymmetric RS256 JWT access token (short-lived, 15 minutes default).
 */
export function signAccessToken(
  payload: Omit<JwtAccessTokenPayload, "iat" | "exp">,
  expiresIn = env.JWT_ACCESS_EXPIRES_IN || "15m"
): string {
  const privateKey = getPrivateKey();
  const options: SignOptions = {
    algorithm: "RS256",
    expiresIn: expiresIn as any,
  };

  return jwt.sign(payload, privateKey, options);
}

/**
 * Verify an asymmetric RS256 JWT access token using the public key.
 */
export function verifyAccessToken(token: string): JwtAccessTokenPayload {
  const publicKey = getPublicKey();
  const options: VerifyOptions = {
    algorithms: ["RS256"],
  };

  try {
    const decoded = jwt.verify(token, publicKey, options) as JwtAccessTokenPayload;
    return decoded;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw ApiError.unauthorized("Access token has expired", "TOKEN_EXPIRED");
    }
    if (err.name === "JsonWebTokenError") {
      throw ApiError.unauthorized("Invalid access token", "INVALID_TOKEN");
    }
    throw ApiError.unauthorized("Authentication failed", "UNAUTHORIZED");
  }
}
