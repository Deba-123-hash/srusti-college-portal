// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Student Attendance Hook
// =============================================================================

import { useQuery } from "@tanstack/react-query";
import { studentAttendanceApi, AttendanceFilterParams } from "../api/studentAttendance";

export const STUDENT_ATTENDANCE_SUMMARY_KEY = ["student", "attendance", "summary"] as const;
export const STUDENT_ATTENDANCE_RECORDS_KEY = ["student", "attendance", "records"] as const;

export const useStudentAttendanceSummary = () => {
  return useQuery({
    queryKey: STUDENT_ATTENDANCE_SUMMARY_KEY,
    queryFn: studentAttendanceApi.getMySummary,
    staleTime: 1000 * 60 * 3,
  });
};

export const useStudentAttendanceRecords = (params?: AttendanceFilterParams) => {
  return useQuery({
    queryKey: [...STUDENT_ATTENDANCE_RECORDS_KEY, params],
    queryFn: () => studentAttendanceApi.getMyRecords(params),
    staleTime: 1000 * 60 * 2,
  });
};
