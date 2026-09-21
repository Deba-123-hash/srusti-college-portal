// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Student Attendance API Service Layer
// =============================================================================

import { api } from "../lib/api";
import { ApiResponse, PaginationMeta } from "@srusti/shared";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

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

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string | null;
  createdAt: string;
  subject: {
    id: string;
    name: string;
    code: string;
    semester: number;
  };
}

export interface AttendanceFilterParams {
  subjectId?: string;
  semester?: number;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export const studentAttendanceApi = {
  getMySummary: async (): Promise<StudentAttendanceSummary> => {
    const res = await api.get<ApiResponse<StudentAttendanceSummary>>("/attendance/me/summary");
    return res.data.data;
  },

  getMyRecords: async (params?: AttendanceFilterParams): Promise<{ data: AttendanceRecord[]; meta?: PaginationMeta }> => {
    const res = await api.get<ApiResponse<AttendanceRecord[]>>("/attendance", { params });
    return {
      data: res.data.data,
      meta: res.data.meta,
    };
  },
};

export default studentAttendanceApi;
