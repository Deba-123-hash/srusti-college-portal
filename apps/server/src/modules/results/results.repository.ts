// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Results Module Repository (Prisma Data Access)
// =============================================================================

import { prisma } from "../../lib/prisma";
import { CreateResultDto, UpdateResultDto } from "./results.types";
import { Prisma } from "@prisma/client";

export class ResultsRepository {
  async findMany(params: {
    where: Prisma.ResultWhereInput;
    skip: number;
    take: number;
  }) {
    return prisma.result.findMany({
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
      orderBy: [{ semester: "desc" }, { subject: { code: "asc" } }],
    });
  }

  async count(where: Prisma.ResultWhereInput) {
    return prisma.result.count({ where });
  }

  async findById(id: string) {
    return prisma.result.findUnique({
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
            department: true,
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

  async upsert(data: CreateResultDto) {
    const totalMarks = data.totalMarks ?? data.internalMarks + data.externalMarks;

    return prisma.result.upsert({
      where: {
        studentId_subjectId_semester: {
          studentId: data.studentId,
          subjectId: data.subjectId,
          semester: data.semester,
        },
      },
      update: {
        internalMarks: data.internalMarks,
        externalMarks: data.externalMarks,
        totalMarks,
        grade: data.grade,
        credits: data.credits ?? 3,
      },
      create: {
        studentId: data.studentId,
        subjectId: data.subjectId,
        semester: data.semester,
        internalMarks: data.internalMarks,
        externalMarks: data.externalMarks,
        totalMarks,
        grade: data.grade,
        credits: data.credits ?? 3,
        isPublished: false,
      },
    });
  }

  async update(id: string, data: UpdateResultDto) {
    const totalMarks =
      data.totalMarks !== undefined
        ? data.totalMarks
        : data.internalMarks !== undefined && data.externalMarks !== undefined
        ? data.internalMarks + data.externalMarks
        : undefined;

    return prisma.result.update({
      where: { id },
      data: {
        ...(data.internalMarks !== undefined && { internalMarks: data.internalMarks }),
        ...(data.externalMarks !== undefined && { externalMarks: data.externalMarks }),
        ...(totalMarks !== undefined && { totalMarks }),
        ...(data.grade !== undefined && { grade: data.grade }),
        ...(data.credits !== undefined && { credits: data.credits }),
        ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
      },
    });
  }

  async publishMany(where: Prisma.ResultWhereInput) {
    return prisma.result.updateMany({
      where,
      data: {
        isPublished: true,
      },
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

  async findStudentByUserId(userId: string) {
    return prisma.student.findUnique({
      where: { userId },
    });
  }

  async findFacultyByUserId(userId: string) {
    return prisma.faculty.findUnique({
      where: { userId },
    });
  }
}

export const resultsRepository = new ResultsRepository();
