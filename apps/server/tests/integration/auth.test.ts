import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app";
import { studentToken, expiredToken, tamperedToken } from "../helpers/testTokens";

describe("Integration: Auth Module Endpoints", () => {
  it("POST /api/v1/auth/login with invalid email format should return 422 validation error", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "invalid-email-address", password: "SomePassword123!" });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /api/v1/auth/login with wrong credentials should return 401 INVALID_CREDENTIALS", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "unknown_user_9999@srusti.ac.in", password: "WrongPassword123!" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("POST /api/v1/auth/refresh without cookie should return 401 UNAUTHORIZED", async () => {
    const res = await request(app).post("/api/v1/auth/refresh");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/v1/auth/me without token should return 401 UNAUTHORIZED", async () => {
    const res = await request(app).get("/api/v1/auth/me");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("GET /api/v1/auth/me with expired token should return 401 TOKEN_EXPIRED", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("TOKEN_EXPIRED");
  });

  it("GET /api/v1/auth/me with tampered signature should return 401 INVALID_TOKEN", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${tamperedToken}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("INVALID_TOKEN");
  });

  it("POST /api/v1/auth/logout should clear cookie and return success", async () => {
    const res = await request(app).post("/api/v1/auth/logout");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.headers["set-cookie"]).toBeDefined();
    // Cookie should be cleared with expires/maxAge 0
    const setCookie = res.headers["set-cookie"][0];
    expect(setCookie).toMatch(/refreshToken=/);
  });
});
