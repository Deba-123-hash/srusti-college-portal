// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Multer Upload & Image Processor Utility
// =============================================================================

import multer from "multer";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import { ApiError } from "../utils/ApiError";

// Memory storage for inspection & content sniffing before persistence
const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const uploadSingleImage = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        ApiError.badRequest(
          "Invalid file type. Only JPEG, PNG, and WebP images are permitted.",
          "INVALID_FILE_TYPE"
        )
      );
    }
    cb(null, true);
  },
}).single("image");

/**
 * Validates magic numbers (file signature) for buffer content sniffing.
 */
export function sniffImageSignature(buffer: Buffer): string | null {
  if (buffer.length < 4) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }

  // PNG: 89 50 4E 47
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "png";
  }

  // WebP: RIFF ... WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }

  return null;
}

/**
 * Saves file to local public/uploads directory or processes via Cloudinary if configured.
 */
export async function saveUploadedFile(file: Express.Multer.File): Promise<string> {
  const ext = sniffImageSignature(file.buffer);
  if (!ext) {
    throw ApiError.badRequest(
      "File content does not match genuine image signatures.",
      "SPOOFED_FILE_TYPE"
    );
  }

  const filename = `${crypto.randomUUID()}.${ext}`;

  // If Cloudinary env vars are set, could upload to Cloudinary.
  // Fallback to local static uploads directory:
  const uploadsDir = path.resolve(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, filename);
  await fs.promises.writeFile(filePath, file.buffer);

  return `/uploads/${filename}`;
}
