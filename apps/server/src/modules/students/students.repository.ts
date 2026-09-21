// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Students Module Repository (Prisma Data Access)
// =============================================================================

import { prisma } from "../../lib/prisma";
import { CreateStudentDto, UpdateStudentDto } from "./students.types";
import { Prisma } from "@prisma/client";

const USER_SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  lastLoginAt: true,
  createdAt: true,
};

export class StudentsRepository {
  async findMany(params: {
    where: Prisma.StudentWhereInput;
    skip: number;
    take: number;
  }) {
    return prisma.student.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      include: {
        user: {
          select: USER_SAFE_SELECT,
        },
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        course: {
          select: {
            id: true,
            name: true,
            code: true,
            slug: true,
          },
        },
      },
      orderBy: { regNo: "asc" },
    });
  }

  async count(where: Prisma.StudentWhereInput) {
    return prisma.student.count({ where });
  }

  async findById(id: string) {
    return prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: USER_SAFE_SELECT,
        },
        department: true,
        course: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.student.findUnique({
      where: { userId },
      include: {
        user: {
          select: USER_SAFE_SELECT,
        },
        department: true,
        course: true,
      },
    });
  }

  async findByRegNo(regNo: string) {
    return prisma.student.findUnique({
      where: { regNo },
    });
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Transactionally creates User and associated Student profile
   */
  async createWithUser(
    data: CreateStudentDto,
    passwordHash: string
  ) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          passwordHash,
          role: "STUDENT",
          status: "ACTIVE",
        },
        select: USER_SAFE_SELECT,
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          regNo: data.regNo,
          departmentId: data.departmentId,
          courseId: data.courseId,
          currentSemester: data.currentSemester ?? 1,
          enrollmentYear: data.enrollmentYear ?? new Date().getFullYear(),
          phone: data.phone || null,
          cgpa: data.cgpa ?? 0.0,
        },
        include: {
          department: true,
          course: true,
        },
      });

      return {
        ...student,
        user,
      };
    });
  }

  async update(id: string, data: UpdateStudentDto) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const existing = await tx.student.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (existing && data.name) {
        await tx.user.update({
          where: { id: existing.userId },
          data: { name: data.name },
        });
      }

      return tx.student.update({
        where: { id },
        data: {
          ...(data.phone !== undefined && { phone: data.phone }),
          ...(data.currentSemester !== undefined && {
            currentSemester: data.currentSemester,
          }),
          ...(data.cgpa !== undefined && { cgpa: data.cgpa }),
          ...(data.departmentId !== undefined && { departmentId: data.departmentId }),
          ...(data.courseId !== undefined && { courseId: data.courseId }),
        },
        include: {
          user: {
            select: USER_SAFE_SELECT,
          },
          department: true,
          course: true,
        },
      });
    });
  }

  async delete(id: string) {
    const student = await prisma.student.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!student) return null;

    // Deleting the User cascades and deletes the Student
    return prisma.user.delete({
      where: { id: student.userId },
    });
  }
}

export const studentsRepository = new StudentsRepository();
