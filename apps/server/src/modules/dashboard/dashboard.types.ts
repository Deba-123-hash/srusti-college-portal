// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Dashboard Module Types
// =============================================================================

export interface AdminDashboardData {
  stats: {
    studentCount: number;
    facultyCount: number;
    courseCount: number;
    eventCount: number;
    placementDriveCount: number;
    pendingInquiryCount: number;
  };
  recentAnnouncements: any[];
  upcomingEvents: any[];
  recentAuditLogs?: any[];
}

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
  latestResults: any[];
  upcomingEvents: any[];
  placementApplications: any[];
  unreadNotificationCount: number;
}

export interface FacultyDashboardData {
  faculty: {
    id: string;
    name: string;
    designation: string;
    departmentName: string;
  };
  assignedSubjects: any[];
  totalStudentsTaught: number;
  recentAttendanceActivity: any[];
  recentResultsEntered: any[];
}
