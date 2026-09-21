// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Dashboard Module Repository (Prisma Aggregations & Metrics)
// =============================================================================

import { prisma } from "../../lib/prisma";

export class DashboardRepository {
  // --- Admin Metrics ---

  async getAdminStats(departmentId?: string | null) {
    const studentWhere = departmentId ? { departmentId } : {};
    const facultyWhere = departmentId ? { departmentId } : {};
    const courseWhere = departmentId ? { departmentId } : {};

    const [
      studentCount,
      facultyCount,
      courseCount,
      eventCount,
      placementDriveCount,
      pendingInquiryCount,
    ] = await Promise.all([
      prisma.student.count({ where: studentWhere }),
      prisma.faculty.count({ where: facultyWhere }),
      prisma.course.count({ where: courseWhere }),
      prisma.event.count({ where: { isPublished: true } }),
      prisma.placementDrive.count({ where: { isActive: true } }),
      prisma.inquiry.count({ where: { isRead: false } }),
    ]);

    return {
      studentCount,
      facultyCount,
      courseCount,
      eventCount,
      placementDriveCount,
      pendingInquiryCount,
    };
  }

  async getRecentAnnouncements(limit = 5) {
    return prisma.announcement.findMany({
      where: {
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
  }

  async getUpcomingEvents(limit = 5) {
    const today = new Date().toISOString().split("T")[0];
    return prisma.event.findMany({
      where: {
        isPublished: true,
        eventDate: { gte: today },
      },
      orderBy: { eventDate: "asc" },
      take: limit,
    });
  }

  async getRecentAuditLogs(limit = 5) {
    return prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });
  }

  // --- Student Metrics ---

  async getStudentProfile(userId: string) {
    return prisma.student.findUnique({
      where: { userId },
      include: {
        user: { select: { name: true } },
        course: { select: { name: true } },
      },
    });
  }

  async getStudentAttendanceSummary(studentId: string) {
    const records = await prisma.attendanceRecord.findMany({
      where: { studentId },
    });

    const totalClasses = records.length;
    const present = records.filter(
      (r) => r.status === "PRESENT" || r.status === "LATE"
    ).length;
    const percentage =
      totalClasses > 0
        ? Math.round((present / totalClasses) * 10000) / 100
        : 0;

    return {
      totalClasses,
      present,
      percentage,
    };
  }

  async getStudentLatestResults(studentId: string, limit = 6) {
    return prisma.result.findMany({
      where: {
        studentId,
        isPublished: true,
      },
      include: {
        subject: {
          select: { code: true, name: true },
        },
      },
      orderBy: [{ semester: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
  }

  async getStudentApplications(studentId: string, limit = 5) {
    return prisma.placementApplication.findMany({
      where: { studentId },
      include: {
        drive: {
          include: {
            company: {
              select: { name: true, logoUrl: true },
            },
          },
        },
      },
      orderBy: { appliedAt: "desc" },
      take: limit,
    });
  }

  async getUnreadNotificationCount(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  // --- Faculty Metrics ---

  async getFacultyProfile(userId: string) {
    return prisma.faculty.findUnique({
      where: { userId },
      include: {
        user: { select: { name: true } },
        department: { select: { name: true } },
        subjects: {
          include: {
            course: { select: { name: true, code: true } },
            _count: { select: { attendanceRecords: true, results: true } },
          },
        },
      },
    });
  }

  async getFacultyRecentAttendance(facultyId: string, limit = 5) {
    return prisma.attendanceRecord.findMany({
      where: {
        subject: { facultyId },
      },
      include: {
        student: {
          include: {
            user: { select: { name: true } },
          },
        },
        subject: {
          select: { code: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async getFacultyRecentResults(facultyId: string, limit = 5) {
    return prisma.result.findMany({
      where: {
        subject: { facultyId },
      },
      include: {
        student: {
          include: {
            user: { select: { name: true } },
          },
        },
        subject: {
          select: { code: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}

export const dashboardRepository = new DashboardRepository();
