// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Student API Service Layer (Profile & Dashboard)
// =============================================================================

import { api } from "../lib/api";
import { ApiResponse } from "@srusti/shared";

export interface StudentDashboardData {
  student: {
    id: string;
    name: string;
    regNo: string;
    courseName: string;
    currentSemester: number;
    cgpa: number;
  };
  attendanceSummary: {
    totalClasses: number;
    present: number;
    percentage: number;
  };
  latestResults: Array<{
    id: string;
    semester: number;
    internalMarks: number;
    externalMarks: number;
    totalMarks: number;
    grade: string;
    credits: number;
    isPublished: boolean;
    subject: {
      code: string;
      name: string;
    };
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    eventDate: string;
    time: string;
    venue: string;
    category: string;
  }>;
  placementApplications: Array<{
    id: string;
    status: string;
    appliedAt: string;
    drive: {
      id: string;
      jobRole: string;
      ctcPackage: string;
      company: {
        name: string;
        logoUrl?: string | null;
      };
    };
  }>;
  unreadNotificationCount: number;
}

export interface StudentProfile {
  id: string;
  userId: string;
  regNo: string;
  departmentId: string;
  courseId: string;
  currentSemester: number;
  enrollmentYear: number;
  phone?: string | null;
  cgpa: number;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  course: {
    id: string;
    name: string;
    code: string | null;
    slug: string;
  };
  department: {
    id: string;
    name: string;
    code: string;
  };
}

export const studentApi = {
  getDashboard: async (): Promise<StudentDashboardData> => {
    const res = await api.get<ApiResponse<StudentDashboardData>>("/dashboard/student");
    return res.data.data;
  },

  getProfile: async (): Promise<StudentProfile> => {
    const res = await api.get<ApiResponse<StudentProfile>>("/students/me");
    return res.data.data;
  },
};

export default studentApi;
