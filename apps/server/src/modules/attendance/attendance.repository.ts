// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Attendance Module Repository (Prisma Data Access)
// =============================================================================

import { prisma } from "../../lib/prisma";
import { AttendanceEntryDto, UpdateAttendanceDto } from "./attendance.types";
import { Prisma } from "@prisma/client";

export class AttendanceRepository {
  async findMany(params: {
    where: Prisma.AttendanceRecordWhereInput;
    skip: number;
    take: number;
  }) {
    return prisma.attendanceRecord.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            course: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
            semester: true,
            facultyId: true,
          },
        },
      },
      orderBy: [{ date: "desc" }, { student: { regNo: "asc" } }],
    });
  }

  async count(where: Prisma.AttendanceRecordWhereInput) {
    return prisma.attendanceRecord.count({ where });
  }

  async findById(id: string) {
    return prisma.attendanceRecord.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        subject: {
          include: {
            course: true,
          },
        },
      },
    });
  }

  async upsertRecord(data: AttendanceEntryDto) {
    return prisma.attendanceRecord.upsert({
      where: {
        studentId_subjectId_date: {
          studentId: data.studentId,
          subjectId: data.subjectId,
          date: data.date,
        },
      },
      update: {
        status: data.status,
        remarks: data.remarks ?? null,
      },
      create: {
        studentId: data.studentId,
        subjectId: data.subjectId,
        date: data.date,
        status: data.status,
        remarks: data.remarks ?? null,
      },
    });
  }

  async upsertMany(records: AttendanceEntryDto[]) {
    return prisma.$transaction(
      records.map((rec) =>
        prisma.attendanceRecord.upsert({
          where: {
            studentId_subjectId_date: {
              studentId: rec.studentId,
              subjectId: rec.subjectId,
              date: rec.date,
            },
          },
          update: {
            status: rec.status,
            remarks: rec.remarks ?? null,
          },
          create: {
            studentId: rec.studentId,
            subjectId: rec.subjectId,
            date: rec.date,
            status: rec.status,
            remarks: rec.remarks ?? null,
          },
        })
      )
    );
  }

  async update(id: string, data: UpdateAttendanceDto) {
    return prisma.attendanceRecord.update({
      where: { id },
      data: {
        ...(data.status !== undefined && { status: data.status }),
        ...(data.remarks !== undefined && { remarks: data.remarks }),
      },
    });
  }

  async findRecordsForStudentSummary(studentId: string) {
    return prisma.attendanceRecord.findMany({
      where: { studentId },
      include: {
        subject: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });
  }

  async findSubjectById(id: string) {
    return prisma.subject.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });
  }

  async findFacultyByUserId(userId: string) {
    return prisma.faculty.findUnique({
      where: { userId },
    });
  }

  async findStudentByUserId(userId: string) {
    return prisma.student.findUnique({
      where: { userId },
      include: {
        user: { select: { name: true } },
      },
    });
  }

  async findStudentById(id: string) {
    return prisma.student.findUnique({
      where: { id },
      include: {
        user: { select: { name: true } },
      },
    });
  }
}

export const attendanceRepository = new AttendanceRepository();
