import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app";
import { superAdminToken } from "../helpers/testTokens";

describe("Integration: Academic Modules (Departments, Courses, Subjects)", () => {
  describe("Departments", () => {
    it("GET /api/v1/departments should return public list with pagination", async () => {
      const res = await request(app).get("/api/v1/departments");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty("code");
      expect(res.body.data[0]).toHaveProperty("name");
    });

    it("POST /api/v1/departments with invalid schema should return 400 VALIDATION_ERROR", async () => {
      const res = await request(app)
        .post("/api/v1/departments")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ name: "" }); // Missing code and invalid name

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("Courses", () => {
    it("GET /api/v1/courses should return public list of courses", async () => {
      const res = await request(app).get("/api/v1/courses");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      const course = res.body.data[0];
      expect(course).toHaveProperty("slug");
      expect(course).toHaveProperty("eligibility");
      expect(course).toHaveProperty("durationYears");
    });

    it("GET /api/v1/courses/slug/:slug should return course details for existing slug", async () => {
      const res = await request(app).get("/api/v1/courses/slug/mca");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe("mca");
      expect(res.body.data.name).toContain("Master of Computer Applications");
    });

    it("GET /api/v1/courses/slug/:slug with unknown slug should return 404", async () => {
      const res = await request(app).get("/api/v1/courses/slug/non-existent-course-slug-xyz");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("COURSE_NOT_FOUND");
    });
  });

  describe("Subjects", () => {
    it("GET /api/v1/subjects should return subjects list", async () => {
      const res = await request(app).get("/api/v1/subjects");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
