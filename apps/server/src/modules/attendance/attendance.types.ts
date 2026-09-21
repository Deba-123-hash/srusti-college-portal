// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Attendance Module Types
// =============================================================================

import { AttendanceStatus } from "@prisma/client";

export interface AttendanceEntryDto {
  studentId: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string | null;
}

export interface UpdateAttendanceDto {
  status?: AttendanceStatus;
  remarks?: string | null;
}

export interface AttendanceFilterParams {
  studentId?: string;
  subjectId?: string;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  semester?: number;
  page?: number;
  limit?: number;
}

export interface SubjectAttendanceSummary {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export interface StudentAttendanceSummary {
  studentId: string;
  studentName: string;
  regNo: string;
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  attendancePercentage: number;
  subjectWise: SubjectAttendanceSummary[];
}
