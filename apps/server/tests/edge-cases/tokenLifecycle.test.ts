import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { hashPassword } from "../../src/lib/password";

describe("Dedicated Token Lifecycle & Rotation Test Suite", () => {
  const credentials = {
    email: "lifecycle_test@srusti.ac.in",
    password: "LifecyclePass123!",
  };

  beforeAll(async () => {
    const passwordHash = await hashPassword(credentials.password);
    await prisma.user.upsert({
      where: { email: credentials.email },
      update: { passwordHash, status: "ACTIVE" },
      create: {
        email: credentials.email,
        name: "Lifecycle Test User",
        passwordHash,
        role: "STUDENT",
        status: "ACTIVE",
      },
    });
  });

  it("Full Auth Lifecycle: Login -> Access Expiry Simulation -> Silent Refresh -> Rotation -> Logout", async () => {
    // 1. Initial Login
    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send(credentials);

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.data.accessToken).toBeDefined();

    const cookies = loginRes.headers["set-cookie"];
    expect(cookies).toBeDefined();
    const refreshCookie = cookies[0];
    expect(refreshCookie).toContain("refreshToken=");
    expect(refreshCookie).toContain("HttpOnly");

    const originalAccessToken = loginRes.body.data.accessToken;

    // 2. Access protected endpoint with access token
    const meRes1 = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${originalAccessToken}`);

    expect(meRes1.status).toBe(200);
    expect(meRes1.body.data.email).toBe(credentials.email);

    // 3. Perform Token Refresh using httpOnly cookie
    const refreshRes = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", refreshCookie);

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.success).toBe(true);
    expect(refreshRes.body.data.accessToken).toBeDefined();

    const newAccessToken = refreshRes.body.data.accessToken;
    expect(newAccessToken).not.toBe(originalAccessToken);

    const newCookies = refreshRes.headers["set-cookie"];
    expect(newCookies).toBeDefined();
    const rotatedRefreshCookie = newCookies[0];

    // 4. Verify new access token works
    const meRes2 = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${newAccessToken}`);

    expect(meRes2.status).toBe(200);
    expect(meRes2.body.data.email).toBe(credentials.email);

    // 5. Token Reuse Detection: attempting to reuse old refreshCookie MUST fail
    const replayRes = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", refreshCookie);

    // Should reject because old token was rotated/revoked
    expect(replayRes.status).toBe(401);

    // 6. User Logout
    const logoutRes = await request(app)
      .post("/api/v1/auth/logout")
      .set("Cookie", rotatedRefreshCookie);

    expect(logoutRes.status).toBe(200);

    // 7. Verify refresh session revoked after logout
    const afterLogoutRefresh = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", rotatedRefreshCookie);

    expect(afterLogoutRefresh.status).toBe(401);
  });
});
