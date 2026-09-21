// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Attendance Module Validation Schemas
// =============================================================================

import { z } from "zod";

export const attendanceRecordItemSchema = z.object({
  studentId: z.string().trim().min(1, "Student ID is required"),
  subjectId: z.string().trim().min(1, "Subject ID is required"),
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be formatted as YYYY-MM-DD"),
  status: z.enum(["PRESENT", "ABSENT", "LATE"]),
  remarks: z.string().trim().max(250).optional().nullable(),
});

export const createAttendanceSchema = z.union([
  attendanceRecordItemSchema,
  z.object({
    records: z
      .array(attendanceRecordItemSchema)
      .min(1, "At least one attendance record is required"),
  }),
  z.array(attendanceRecordItemSchema).min(1),
]);

export const updateAttendanceSchema = z.object({
  status: z.enum(["PRESENT", "ABSENT", "LATE"]).optional(),
  remarks: z.string().trim().max(250).optional().nullable(),
});

export const attendanceParamsSchema = z.object({
  id: z.string().trim().min(1, "Attendance ID is required"),
});

export const attendanceSummaryParamsSchema = z.object({
  studentId: z.string().trim().min(1, "Student ID is required"),
});

export const attendanceQuerySchema = z.object({
  studentId: z.string().trim().optional(),
  subjectId: z.string().trim().optional(),
  date: z.string().trim().optional(),
  dateFrom: z.string().trim().optional(),
  dateTo: z.string().trim().optional(),
  semester: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  page: z.string().optional(),
  limit: z.string().optional(),
});
