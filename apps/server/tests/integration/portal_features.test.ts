import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app";
import { superAdminToken, studentToken } from "../helpers/testTokens";

describe("Integration: Portal Feature Modules", () => {
  describe("Events", () => {
    it("GET /api/v1/events should return public list of events", async () => {
      const res = await request(app).get("/api/v1/events");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("POST /api/v1/events should reject non-admin with 403", async () => {
      const res = await request(app)
        .post("/api/v1/events")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          title: "Hackathon",
          description: "Coding competition",
          category: "Tech",
          eventDate: "2026-10-15",
          time: "10:00 AM",
          venue: "Auditorium",
          capacity: 100,
        });

      expect(res.status).toBe(403);
    });
  });

  describe("Placements & Companies", () => {
    it("GET /api/v1/placements/drives should return placement drives list", async () => {
      const res = await request(app).get("/api/v1/placements/drives");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("GET /api/v1/companies should return company profiles list", async () => {
      const res = await request(app).get("/api/v1/companies");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("Announcements", () => {
    it("GET /api/v1/announcements should return active announcements", async () => {
      const res = await request(app).get("/api/v1/announcements");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("Gallery", () => {
    it("GET /api/v1/gallery should return campus gallery items", async () => {
      const res = await request(app).get("/api/v1/gallery");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("Inquiries", () => {
    it("POST /api/v1/inquiries should accept public inquiry submission", async () => {
      const res = await request(app)
        .post("/api/v1/inquiries")
        .send({
          name: "Alok Patnaik",
          email: "alok.patnaik@example.com",
          phone: "+919876543210",
          courseOfInterest: "MCA",
          message: "Interested in admission details for MCA 2026-2028 batch.",
          type: "ADMISSION",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.name).toBe("Alok Patnaik");
    });

    it("GET /api/v1/inquiries should reject unauthorized access", async () => {
      const res = await request(app).get("/api/v1/inquiries");
      expect(res.status).toBe(401);
    });
  });

  describe("Dashboard & Export", () => {
    it("GET /api/v1/dashboard/admin should return full analytics payload for admin", async () => {
      const res = await request(app)
        .get("/api/v1/dashboard/admin")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("stats");
      expect(res.body.data).toHaveProperty("upcomingEvents");
      expect(res.body.data).toHaveProperty("recentAnnouncements");
    });

    it("GET /api/v1/admin/export/students should export student records", async () => {
      const res = await request(app)
        .get("/api/v1/admin/export/students")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
