import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app";

describe("Integration: Health & Readiness Endpoints", () => {
  it("GET /api/v1/health should return HTTP 200 with standard health shape", async () => {
    const res = await request(app).get("/api/v1/health");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("API is healthy");
    expect(res.body.data.status).toBe("ok");
    expect(typeof res.body.data.uptime).toBe("number");
    expect(res.headers["x-request-id"]).toBeDefined();
  });

  it("GET /api/v1/health/ready should return HTTP 200 with readiness details", async () => {
    const res = await request(app).get("/api/v1/health/ready");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("ready");
    expect(res.body.data.database).toBe("connected");
  });

  it("GET /api/v1/non-existent-route should return standardized HTTP 404", async () => {
    const res = await request(app).get("/api/v1/random-route-path");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("ROUTE_NOT_FOUND");
    expect(res.body.error.message).toBe("The requested endpoint does not exist.");
  });
});
