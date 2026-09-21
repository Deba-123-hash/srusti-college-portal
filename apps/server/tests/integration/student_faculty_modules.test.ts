import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app";
import { superAdminToken, studentToken, facultyToken } from "../helpers/testTokens";

describe("Integration: Student, Faculty, Attendance, and Results Modules", () => {
  describe("Students API", () => {
    it("GET /api/v1/students should require authorization", async () => {
      const unauth = await request(app).get("/api/v1/students");
      expect(unauth.status).toBe(401);

      const auth = await request(app)
        .get("/api/v1/students")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(auth.status).toBe(200);
      expect(auth.body.success).toBe(true);
      expect(Array.isArray(auth.body.data)).toBe(true);
    });

    it("GET /api/v1/students/me should require STUDENT role", async () => {
      const res = await request(app)
        .get("/api/v1/students/me")
        .set("Authorization", `Bearer ${facultyToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe("Faculty API", () => {
    it("GET /api/v1/faculty should return faculty list for authenticated users", async () => {
      const res = await request(app)
        .get("/api/v1/faculty")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("Attendance API", () => {
    it("GET /api/v1/attendance should return attendance records for authenticated roles", async () => {
      const res = await request(app)
        .get("/api/v1/attendance")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("POST /api/v1/attendance should reject unauthorized STUDENT role with 403", async () => {
      const res = await request(app)
        .post("/api/v1/attendance")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          studentId: "student-1",
          subjectId: "subject-1",
          date: "2026-09-18",
          status: "PRESENT",
        });

      expect(res.status).toBe(403);
    });
  });

  describe("Results API", () => {
    it("GET /api/v1/results should return results for authenticated roles", async () => {
      const res = await request(app)
        .get("/api/v1/results")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("POST /api/v1/results/publish should reject non-admin roles with 403", async () => {
      const res = await request(app)
        .post("/api/v1/results/publish")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ semester: 1 });

      expect(res.status).toBe(403);
    });
  });
});
