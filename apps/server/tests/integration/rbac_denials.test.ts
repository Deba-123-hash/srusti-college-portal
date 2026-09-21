import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app";
import {
  superAdminToken,
  deptAdminToken,
  facultyToken,
  studentToken,
} from "../helpers/testTokens";

describe("Integration: RBAC Authorization & Denial Paths", () => {
  // Test 1: Department creation requires SUPER_ADMIN
  describe("POST /api/v1/departments (SUPER_ADMIN only)", () => {
    it("should reject anonymous requests with 401 UNAUTHORIZED", async () => {
      const res = await request(app)
        .post("/api/v1/departments")
        .send({ name: "Unauthorized Dept", code: "UNAUTH" });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    it("should reject STUDENT with 403 FORBIDDEN", async () => {
      const res = await request(app)
        .post("/api/v1/departments")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ name: "Unauthorized Dept", code: "UNAUTH" });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    it("should reject FACULTY with 403 FORBIDDEN", async () => {
      const res = await request(app)
        .post("/api/v1/departments")
        .set("Authorization", `Bearer ${facultyToken}`)
        .send({ name: "Unauthorized Dept", code: "UNAUTH" });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    it("should reject DEPT_ADMIN with 403 FORBIDDEN", async () => {
      const res = await request(app)
        .post("/api/v1/departments")
        .set("Authorization", `Bearer ${deptAdminToken}`)
        .send({ name: "Unauthorized Dept", code: "UNAUTH" });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });
  });

  // Test 2: Course Creation requires SUPER_ADMIN or DEPT_ADMIN
  describe("POST /api/v1/courses (SUPER_ADMIN, DEPT_ADMIN)", () => {
    it("should reject STUDENT with 403 FORBIDDEN", async () => {
      const res = await request(app)
        .post("/api/v1/courses")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ name: "New Course", slug: "new-course" });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    it("should reject FACULTY with 403 FORBIDDEN", async () => {
      const res = await request(app)
        .post("/api/v1/courses")
        .set("Authorization", `Bearer ${facultyToken}`)
        .send({ name: "New Course", slug: "new-course" });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });
  });

  // Test 3: Student Attendance Summary requires STUDENT
  describe("GET /api/v1/attendance/me/summary (STUDENT only)", () => {
    it("should reject anonymous requests with 401 UNAUTHORIZED", async () => {
      const res = await request(app).get("/api/v1/attendance/me/summary");
      expect(res.status).toBe(401);
    });

    it("should reject FACULTY with 403 FORBIDDEN", async () => {
      const res = await request(app)
        .get("/api/v1/attendance/me/summary")
        .set("Authorization", `Bearer ${facultyToken}`);

      expect(res.status).toBe(403);
    });

    it("should reject SUPER_ADMIN with 403 FORBIDDEN", async () => {
      const res = await request(app)
        .get("/api/v1/attendance/me/summary")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(res.status).toBe(403);
    });
  });

  // Test 4: Admin Dashboard requires SUPER_ADMIN or DEPT_ADMIN
  describe("GET /api/v1/dashboard/admin (Admin roles only)", () => {
    it("should reject STUDENT with 403 FORBIDDEN", async () => {
      const res = await request(app)
        .get("/api/v1/dashboard/admin")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
    });

    it("should reject FACULTY with 403 FORBIDDEN", async () => {
      const res = await request(app)
        .get("/api/v1/dashboard/admin")
        .set("Authorization", `Bearer ${facultyToken}`);

      expect(res.status).toBe(403);
    });
  });
});
