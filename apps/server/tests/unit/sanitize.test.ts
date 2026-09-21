import { describe, it, expect } from "vitest";
import { sanitizeMiddleware } from "../../src/middleware/sanitize";
import { Request, Response } from "express";

describe("Unit: Prototype Pollution Defense & Request Sanitization", () => {
  const runSanitize = (req: Partial<Request>) => {
    let nextCalled = false;
    sanitizeMiddleware(req as Request, {} as Response, () => {
      nextCalled = true;
    });
    return nextCalled;
  };

  it("should strip __proto__ from request body", () => {
    const maliciousPayload = JSON.parse('{"name":"Test Student","__proto__":{"polluted":true},"nested":{"__proto__":{"evil":123}}}');
    const req = { body: maliciousPayload, query: {}, params: {} };

    const called = runSanitize(req);
    expect(called).toBe(true);
    expect(req.body.name).toBe("Test Student");
    expect(req.body.__proto__.polluted).toBeUndefined();
    expect((Object.prototype as any).polluted).toBeUndefined();
    expect((Object.prototype as any).evil).toBeUndefined();
  });

  it("should strip constructor and prototype keys from body", () => {
    const req = {
      body: {
        title: "Annual Sports 2026",
        constructor: "exploit",
        prototype: "exploit",
        validArray: [{ constructor: "bad", title: "Item 1" }],
      },
      query: {},
      params: {},
    };

    runSanitize(req);
    expect(req.body.title).toBe("Annual Sports 2026");
    expect((req.body as any).constructor).not.toBe("exploit");
    expect((req.body as any).prototype).toBeUndefined();
    expect((req.body.validArray[0] as any).constructor).not.toBe("bad");
    expect(req.body.validArray[0].title).toBe("Item 1");
  });

  it("should preserve legitimate Unicode and Odia script data unchanged", () => {
    const odiaText = "ସୃଷ୍ଟି ଏକାଡେମୀ ଅଫ୍ ମ୍ୟାନେଜମେଣ୍ଟ ଆଣ୍ଡ ଟେକ୍ନୋଲୋଜି";
    const req = {
      body: {
        institution: odiaText,
        address: "Chandaka Industrial Estate, Patia, Bhubaneswar 751024 🏛️",
        marks: [95, 88.5, 92],
      },
      query: { search: "କମ୍ପ୍ୟୁଟର" },
      params: { id: "sr-2024-001" },
    };

    runSanitize(req);
    expect(req.body.institution).toBe(odiaText);
    expect(req.body.address).toContain("🏛️");
    expect(req.body.marks).toEqual([95, 88.5, 92]);
    expect(req.query.search).toBe("କମ୍ପ୍ୟୁଟର");
  });
});
