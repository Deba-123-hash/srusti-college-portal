import { describe, it, expect } from "vitest";
import { signAccessToken, verifyAccessToken } from "../../src/lib/jwt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

describe("Unit: JWT RS256 Token Utilities", () => {
  const mockPayload = {
    userId: "usr-test-12345",
    email: "student@srusti.ac.in",
    role: "STUDENT" as const,
    departmentId: "dept-mca-1",
  };

  it("should sign a valid RS256 JWT access token", () => {
    const token = signAccessToken(mockPayload);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);
  });

  it("should verify and decode valid token payload", () => {
    const token = signAccessToken(mockPayload);
    const decoded = verifyAccessToken(token);

    expect(decoded.userId).toBe(mockPayload.userId);
    expect(decoded.email).toBe(mockPayload.email);
    expect(decoded.role).toBe(mockPayload.role);
    expect(decoded.departmentId).toBe(mockPayload.departmentId);
    expect(decoded.exp).toBeDefined();
    expect(decoded.iat).toBeDefined();
  });

  it("should reject an expired token with TOKEN_EXPIRED", () => {
    // Generate token with -1 second expiration
    const expiredToken = signAccessToken(mockPayload, "-1s");
    expect(() => verifyAccessToken(expiredToken)).toThrowError(/expired/i);
  });

  it("should reject a tampered token signature with INVALID_TOKEN", () => {
    const token = signAccessToken(mockPayload);
    const parts = token.split(".");
    // Tamper with signature
    parts[2] = parts[2].substring(0, parts[2].length - 4) + "XXXX";
    const tampered = parts.join(".");

    expect(() => verifyAccessToken(tampered)).toThrowError(/invalid/i);
  });

  it("should reject token signed with an unauthorized foreign private key", () => {
    // Generate arbitrary RSA keypair
    const { privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });

    const foreignToken = jwt.sign(mockPayload, privateKey, {
      algorithm: "RS256",
      expiresIn: "15m",
    });

    expect(() => verifyAccessToken(foreignToken)).toThrowError();
  });
});
