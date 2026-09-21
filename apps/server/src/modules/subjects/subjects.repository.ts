// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Subjects Module Repository (Prisma Data Access)
// =============================================================================

import { prisma } from "../../lib/prisma";
import { CreateSubjectDto, UpdateSubjectDto } from "./subjects.types";
import { Prisma } from "@prisma/client";

export class SubjectsRepository {
  async findMany(params: {
    where: Prisma.SubjectWhereInput;
    skip: number;
    take: number;
  }) {
    return prisma.subject.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true,
            departmentId: true,
          },
        },
        faculty: {
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
      },
      orderBy: [{ semester: "asc" }, { code: "asc" }],
    });
  }

  async count(where: Prisma.SubjectWhereInput) {
    return prisma.subject.count({ where });
  }

  async findById(id: string) {
    return prisma.subject.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            department: true,
          },
        },
        faculty: {
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
      },
    });
  }

  async findByCode(code: string) {
    return prisma.subject.findUnique({
      where: { code },
    });
  }

  async create(data: CreateSubjectDto) {
    return prisma.subject.create({
      data: {
        name: data.name,
        code: data.code,
        courseId: data.courseId,
        semester: data.semester,
        credits: data.credits ?? 3,
        facultyId: data.facultyId || null,
      },
      include: {
        course: true,
        faculty: {
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
      },
    });
  }

  async update(id: string, data: UpdateSubjectDto) {
    return prisma.subject.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.code !== undefined && { code: data.code }),
        ...(data.courseId !== undefined && { courseId: data.courseId }),
        ...(data.semester !== undefined && { semester: data.semester }),
        ...(data.credits !== undefined && { credits: data.credits }),
        ...(data.facultyId !== undefined && { facultyId: data.facultyId }),
      },
      include: {
        course: true,
        faculty: {
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
      },
    });
  }

  async delete(id: string) {
    return prisma.subject.delete({
      where: { id },
    });
  }
}

export const subjectsRepository = new SubjectsRepository();
