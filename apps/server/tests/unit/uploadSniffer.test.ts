import { describe, it, expect } from "vitest";
import { sniffImageSignature } from "../../src/lib/upload";

describe("Unit: Upload Security & File Content Sniffer", () => {
  it("should recognize genuine JPEG file signature (FF D8 FF)", () => {
    const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);
    const format = sniffImageSignature(jpegBuffer);
    expect(format).toBe("jpg");
  });

  it("should recognize genuine PNG file signature (89 50 4E 47)", () => {
    const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const format = sniffImageSignature(pngBuffer);
    expect(format).toBe("png");
  });

  it("should recognize genuine WebP file signature (RIFF...WEBP)", () => {
    const webpBuffer = Buffer.from("RIFF1234WEBPVP8 ");
    const format = sniffImageSignature(webpBuffer);
    expect(format).toBe("webp");
  });

  it("should reject plain text or script content spoofed as image", () => {
    const textBuffer = Buffer.from("<script>alert('XSS')</script>");
    const format = sniffImageSignature(textBuffer);
    expect(format).toBeNull();
  });

  it("should reject executable or binary content (e.g. MZ header)", () => {
    const exeBuffer = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00]);
    const format = sniffImageSignature(exeBuffer);
    expect(format).toBeNull();
  });

  it("should return null for empty or truncated buffer", () => {
    const emptyBuffer = Buffer.alloc(0);
    const format = sniffImageSignature(emptyBuffer);
    expect(format).toBeNull();
  });
});
