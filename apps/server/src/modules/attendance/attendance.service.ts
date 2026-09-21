// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Attendance Module Service (Business Logic, Faculty Scoping & Analytics)
// =============================================================================

import { attendanceRepository } from "./attendance.repository";
import {
  AttendanceEntryDto,
  UpdateAttendanceDto,
  AttendanceFilterParams,
  StudentAttendanceSummary,
  SubjectAttendanceSummary,
} from "./attendance.types";
import { parsePagination, buildPaginationMeta } from "../../utils/pagination";
import { ApiError } from "../../utils/ApiError";
import { Prisma } from "@prisma/client";
import { AuthenticatedUserPayload } from "../../middleware/authenticate";

export class AttendanceService {
  async getAttendance(
    query: AttendanceFilterParams,
    user: AuthenticatedUserPayload
  ) {
    const { page, limit, skip, take } = parsePagination(query);

    const where: Prisma.AttendanceRecordWhereInput = {};

    // 1. RBAC: Role-based scoping
    if (user.role === "STUDENT") {
      const student = await attendanceRepository.findStudentByUserId(user.id);
      if (!student) {
        return { items: [], meta: buildPaginationMeta(1, 20, 0) };
      }
      where.studentId = student.id;
    } else if (user.role === "FACULTY") {
      const faculty = await attendanceRepository.findFacultyByUserId(user.id);
      if (!faculty) {
        return { items: [], meta: buildPaginationMeta(1, 20, 0) };
      }
      where.subject = { facultyId: faculty.id };
    } else if (user.role === "DEPT_ADMIN") {
      where.student = { departmentId: user.departmentId || "unassigned" };
    }

    // 2. Additional query filters
    if (query.studentId && user.role !== "STUDENT") {
      where.studentId = query.studentId;
    }
    if (query.subjectId) {
      where.subjectId = query.subjectId;
    }
    if (query.date) {
      where.date = query.date;
    } else if (query.dateFrom || query.dateTo) {
      where.date = {};
      if (query.dateFrom) where.date.gte = query.dateFrom;
      if (query.dateTo) where.date.lte = query.dateTo;
    }
    if (query.semester !== undefined) {
      where.subject = {
        ...(where.subject as any),
        semester: query.semester,
      };
    }

    const [items, total] = await Promise.all([
      attendanceRepository.findMany({ where, skip, take }),
      attendanceRepository.count(where),
    ]);

    return {
      items,
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async getAttendanceById(id: string, user: AuthenticatedUserPayload) {
    const record = await attendanceRepository.findById(id);
    if (!record) {
      throw ApiError.notFound("Attendance record not found", "RECORD_NOT_FOUND");
    }

    if (user.role === "STUDENT" && record.student.userId !== user.id) {
      throw ApiError.notFound("Attendance record not found", "RECORD_NOT_FOUND");
    }

    if (user.role === "FACULTY") {
      const faculty = await attendanceRepository.findFacultyByUserId(user.id);
      if (!faculty || record.subject.facultyId !== faculty.id) {
        throw ApiError.notFound("Attendance record not found", "RECORD_NOT_FOUND");
      }
    }

    if (
      user.role === "DEPT_ADMIN" &&
      record.student.departmentId !== user.departmentId
    ) {
      throw ApiError.notFound("Attendance record not found", "RECORD_NOT_FOUND");
    }

    return record;
  }

  async createAttendance(
    body: any,
    user: AuthenticatedUserPayload
  ) {
    // Normalize body to array of AttendanceEntryDto
    let records: AttendanceEntryDto[] = [];
    if (Array.isArray(body)) {
      records = body;
    } else if (Array.isArray(body.records)) {
      records = body.records;
    } else if (body.studentId && body.subjectId && body.date) {
      records = [body];
    } else {
      throw ApiError.badRequest("Invalid attendance payload format");
    }

    if (records.length === 0) {
      throw ApiError.badRequest("No attendance entries provided");
    }

    // Role verification
    if (user.role === "STUDENT") {
      throw ApiError.forbidden("Students are not permitted to submit attendance");
    }

    if (user.role === "FACULTY") {
      const faculty = await attendanceRepository.findFacultyByUserId(user.id);
      if (!faculty) {
        throw ApiError.forbidden("Faculty profile not found");
      }

      // Check all distinct subjects being marked
      const distinctSubjectIds = Array.from(
        new Set(records.map((r) => r.subjectId))
      );

      for (const subjectId of distinctSubjectIds) {
        const subject = await attendanceRepository.findSubjectById(subjectId);
        if (!subject || subject.facultyId !== faculty.id) {
          throw ApiError.forbidden(
            `You are not authorized to mark attendance for subject: ${subject?.name || subjectId}. Only assigned faculty can mark attendance.`,
            "UNAUTHORIZED_SUBJECT_ATTENDANCE"
          );
        }
      }
    }

    if (user.role === "DEPT_ADMIN") {
      const distinctSubjectIds = Array.from(
        new Set(records.map((r) => r.subjectId))
      );
      for (const subjectId of distinctSubjectIds) {
        const subject = await attendanceRepository.findSubjectById(subjectId);
        if (!subject || subject.course.departmentId !== user.departmentId) {
          throw ApiError.forbidden(
            "Department administrators can only mark attendance for subjects in their department",
            "DEPT_ADMIN_RESTRICTION"
          );
        }
      }
    }

    const saved = await attendanceRepository.upsertMany(records);
    return {
      count: saved.length,
      records: saved,
    };
  }

  async updateAttendance(
    id: string,
    data: UpdateAttendanceDto,
    user: AuthenticatedUserPayload
  ) {
    const existing = await attendanceRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound("Attendance record not found", "RECORD_NOT_FOUND");
    }

    if (user.role === "STUDENT") {
      throw ApiError.forbidden("Students cannot modify attendance records");
    }

    if (user.role === "FACULTY") {
      const faculty = await attendanceRepository.findFacultyByUserId(user.id);
      if (!faculty || existing.subject.facultyId !== faculty.id) {
        throw ApiError.forbidden("You can only modify attendance for your assigned subjects");
      }
    }

    if (
      user.role === "DEPT_ADMIN" &&
      existing.student.departmentId !== user.departmentId
    ) {
      throw ApiError.notFound("Attendance record not found", "RECORD_NOT_FOUND");
    }

    return attendanceRepository.update(id, data);
  }

  async getStudentSummary(
    targetStudentId: string,
    user: AuthenticatedUserPayload
  ): Promise<StudentAttendanceSummary> {
    const student = await attendanceRepository.findStudentById(targetStudentId);
    if (!student) {
      throw ApiError.notFound("Student not found", "STUDENT_NOT_FOUND");
    }

    // RBAC check
    if (user.role === "STUDENT" && student.userId !== user.id) {
      throw ApiError.notFound("Student not found", "STUDENT_NOT_FOUND");
    }

    if (user.role === "DEPT_ADMIN" && student.departmentId !== user.departmentId) {
      throw ApiError.notFound("Student not found", "STUDENT_NOT_FOUND");
    }

    const records = await attendanceRepository.findRecordsForStudentSummary(
      targetStudentId
    );

    let totalClasses = records.length;
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;

    const subjectMap = new Map<
      string,
      {
        subjectId: string;
        subjectCode: string;
        subjectName: string;
        total: number;
        present: number;
        absent: number;
        late: number;
      }
    >();

    for (const rec of records) {
      if (rec.status === "PRESENT") presentCount++;
      else if (rec.status === "ABSENT") absentCount++;
      else if (rec.status === "LATE") lateCount++;

      const subId = rec.subjectId;
      if (!subjectMap.has(subId)) {
        subjectMap.set(subId, {
          subjectId: subId,
          subjectCode: rec.subject.code,
          subjectName: rec.subject.name,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
        });
      }

      const subStats = subjectMap.get(subId)!;
      subStats.total++;
      if (rec.status === "PRESENT") subStats.present++;
      else if (rec.status === "ABSENT") subStats.absent++;
      else if (rec.status === "LATE") subStats.late++;
    }

    const overallPercentage =
      totalClasses > 0
        ? Math.round(((presentCount + lateCount) / totalClasses) * 10000) / 100
        : 0;

    const subjectWise: SubjectAttendanceSummary[] = Array.from(
      subjectMap.values()
    ).map((s) => ({
      subjectId: s.subjectId,
      subjectCode: s.subjectCode,
      subjectName: s.subjectName,
      totalClasses: s.total,
      present: s.present,
      absent: s.absent,
      late: s.late,
      percentage:
        s.total > 0
          ? Math.round(((s.present + s.late) / s.total) * 10000) / 100
          : 0,
    }));

    return {
      studentId: student.id,
      studentName: student.user.name,
      regNo: student.regNo,
      totalClasses,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      attendancePercentage: overallPercentage,
      subjectWise,
    };
  }
}

export const attendanceService = new AttendanceService();
