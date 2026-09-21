// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Dashboard Module Service (Role-Aware Metrics Assembly)
// =============================================================================

import { dashboardRepository } from "./dashboard.repository";
import {
  AdminDashboardData,
  StudentDashboardData,
  FacultyDashboardData,
} from "./dashboard.types";
import { ApiError } from "../../utils/ApiError";
import { AuthenticatedUserPayload } from "../../middleware/authenticate";

export class DashboardService {
  async getAdminDashboard(user: AuthenticatedUserPayload): Promise<AdminDashboardData> {
    const departmentScope =
      user.role === "DEPT_ADMIN" ? user.departmentId || null : null;

    const [stats, recentAnnouncements, upcomingEvents, recentAuditLogs] =
      await Promise.all([
        dashboardRepository.getAdminStats(departmentScope),
        dashboardRepository.getRecentAnnouncements(5),
        dashboardRepository.getUpcomingEvents(5),
        user.role === "SUPER_ADMIN"
          ? dashboardRepository.getRecentAuditLogs(5)
          : Promise.resolve([]),
      ]);

    return {
      stats,
      recentAnnouncements,
      upcomingEvents,
      ...(user.role === "SUPER_ADMIN" && { recentAuditLogs }),
    };
  }

  async getStudentDashboard(userId: string): Promise<StudentDashboardData> {
    const student = await dashboardRepository.getStudentProfile(userId);
    if (!student) {
      throw ApiError.notFound("Student profile not found", "STUDENT_NOT_FOUND");
    }

    const [
      attendanceSummary,
      latestResults,
      upcomingEvents,
      placementApplications,
      unreadNotificationCount,
    ] = await Promise.all([
      dashboardRepository.getStudentAttendanceSummary(student.id),
      dashboardRepository.getStudentLatestResults(student.id, 5),
      dashboardRepository.getUpcomingEvents(4),
      dashboardRepository.getStudentApplications(student.id, 5),
      dashboardRepository.getUnreadNotificationCount(userId),
    ]);

    return {
      student: {
        id: student.id,
        name: student.user.name,
        regNo: student.regNo,
        courseName: student.course.name,
        currentSemester: student.currentSemester,
        cgpa: student.cgpa,
      },
      attendanceSummary,
      latestResults,
      upcomingEvents,
      placementApplications,
      unreadNotificationCount,
    };
  }

  async getFacultyDashboard(userId: string): Promise<FacultyDashboardData> {
    const faculty = await dashboardRepository.getFacultyProfile(userId);
    if (!faculty) {
      throw ApiError.notFound("Faculty profile not found", "FACULTY_NOT_FOUND");
    }

    const [recentAttendanceActivity, recentResultsEntered] = await Promise.all([
      dashboardRepository.getFacultyRecentAttendance(faculty.id, 5),
      dashboardRepository.getFacultyRecentResults(faculty.id, 5),
    ]);

    return {
      faculty: {
        id: faculty.id,
        name: faculty.user.name,
        designation: faculty.designation,
        departmentName: faculty.department.name,
      },
      assignedSubjects: faculty.subjects,
      totalStudentsTaught: faculty.subjects.length * 40, // estimated batch size
      recentAttendanceActivity,
      recentResultsEntered,
    };
  }
}

export const dashboardService = new DashboardService();
