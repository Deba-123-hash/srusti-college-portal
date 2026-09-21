import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword, dummyComparePassword } from "../../src/lib/password";

describe("Unit: Password Security Utilities (bcrypt cost 12)", () => {
  it("should hash a plaintext password with bcrypt cost 12", async () => {
    const plain = "SuperSecret123!";
    const hash = await hashPassword(plain);

    expect(typeof hash).toBe("string");
    // bcrypt hash format: $2b$12$... or $2a$12$...
    expect(hash.startsWith("$2b$12$") || hash.startsWith("$2a$12$")).toBe(true);
  });

  it("should return true when comparing correct password", async () => {
    const plain = "CorrectHorseBatteryStaple!";
    const hash = await hashPassword(plain);

    const isMatch = await comparePassword(plain, hash);
    expect(isMatch).toBe(true);
  });

  it("should return false when comparing incorrect password", async () => {
    const plain = "ValidPassword123!";
    const hash = await hashPassword(plain);

    const isMatch = await comparePassword("WrongPassword456!", hash);
    expect(isMatch).toBe(false);
  });

  it("should perform dummy constant-time comparison without throwing", async () => {
    await expect(dummyComparePassword("NonExistentUserPassword")).resolves.toBeUndefined();
  });
});
