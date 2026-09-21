import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app";
import { superAdminToken } from "../helpers/testTokens";

describe("Negative and Edge Cases Suite", () => {
  describe("Malformed, Missing, and Wrong Type Payloads", () => {
    it("should reject empty body with 422 validation error", async () => {
      const res = await request(app)
        .post("/api/v1/inquiries")
        .send({});

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should reject wrong data types (e.g. array where string expected)", async () => {
      const res = await request(app)
        .post("/api/v1/inquiries")
        .send({
          name: ["John", "Doe"],
          email: "valid@example.com",
          phone: "9876543210",
          message: "Test message",
        });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should reject oversized string field exceeding schema max", async () => {
      const hugeName = "A".repeat(250); // max is 100
      const res = await request(app)
        .post("/api/v1/inquiries")
        .send({
          name: hugeName,
          email: "valid@example.com",
          phone: "9876543210",
          message: "Test message",
        });

      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("SQL Injection Strings in Inputs", () => {
    const sqliPayloads = [
      "' OR '1'='1",
      "'; DROP TABLE \"User\"; --",
      "admin' --",
      "' UNION SELECT null, null, null --",
    ];

    sqliPayloads.forEach((payload, idx) => {
      it(`should safely handle SQLi payload #${idx + 1} without error or data breach`, async () => {
        const res = await request(app)
          .get("/api/v1/courses")
          .query({ search: payload });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      });
    });
  });

  describe("XSS Payloads in Text Inputs", () => {
    const xssPayloads = [
      "<script>alert('xss')</script>",
      "<img src=x onerror=alert(1)>",
      "<svg onload=alert(document.domain)>",
    ];

    xssPayloads.forEach((payload, idx) => {
      it(`should accept and store XSS payload #${idx + 1} as plain text without execution`, async () => {
        const res = await request(app)
          .post("/api/v1/inquiries")
          .send({
            name: "Security Tester",
            email: "tester@security.org",
            phone: "+919999988888",
            message: payload,
          });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.message).toBe(payload);
      });
    });
  });

  describe("Unicode, Emoji, and Odia Script Text Fields", () => {
    it("should safely store and retrieve Odia script and emoji in text fields", async () => {
      const odiaTitle = "ସୃଷ୍ଟି ଏକାଡେମୀ କ୍ୟାମ୍ପସ ସମାଚାର 🎓 🏛️";
      const odiaMessage = "ସ୍ୱାଗତମ୍! ଶିକ୍ଷା ଏବଂ ଅନୁସନ୍ଧାନର ଅଗ୍ରଣୀ ଅନୁଷ୍ଠାନ ।";

      const res = await request(app)
        .post("/api/v1/inquiries")
        .send({
          name: "ଅଭିଷେକ ମହାନ୍ତି",
          email: "abhishek.odia@example.com",
          phone: "9178000000",
          courseOfInterest: "Master of Computer Applications (MCA)",
          message: `${odiaTitle}: ${odiaMessage}`,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe("ଅଭିଷେକ ମହାନ୍ତି");
      expect(res.body.data.message).toContain(odiaTitle);
    });
  });

  describe("Pagination Boundaries", () => {
    it("should handle page 0, negative page, page beyond last gracefully", async () => {
      const resPage0 = await request(app).get("/api/v1/courses").query({ page: 0 });
      expect(resPage0.status).toBe(200);

      const resNeg = await request(app).get("/api/v1/courses").query({ page: -5 });
      expect(resNeg.status).toBe(200);

      const resBeyond = await request(app).get("/api/v1/courses").query({ page: 99999 });
      expect(resBeyond.status).toBe(200);
      expect(resBeyond.body.data).toEqual([]);
    });

    it("should handle limit 0 and limit 100 gracefully", async () => {
      const resLimit0 = await request(app).get("/api/v1/courses").query({ limit: 0 });
      expect(resLimit0.status).toBe(200);

      const resLimit100 = await request(app).get("/api/v1/courses").query({ limit: 100 });
      expect(resLimit100.status).toBe(200);
    });
  });
});
