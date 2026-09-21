// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Faculty Module Repository (Prisma Data Access)
// =============================================================================

import { prisma } from "../../lib/prisma";
import { CreateFacultyDto, UpdateFacultyDto } from "./faculty.types";
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

export class FacultyRepository {
  async findMany(params: {
    where: Prisma.FacultyWhereInput;
    skip: number;
    take: number;
  }) {
    return prisma.faculty.findMany({
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
        subjects: {
          select: {
            id: true,
            name: true,
            code: true,
            semester: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async count(where: Prisma.FacultyWhereInput) {
    return prisma.faculty.count({ where });
  }

  async findById(id: string) {
    return prisma.faculty.findUnique({
      where: { id },
      include: {
        user: {
          select: USER_SAFE_SELECT,
        },
        department: true,
        subjects: {
          include: {
            course: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.faculty.findUnique({
      where: { userId },
      include: {
        user: {
          select: USER_SAFE_SELECT,
        },
        department: true,
        subjects: {
          include: {
            course: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async createWithUser(
    data: CreateFacultyDto,
    passwordHash: string
  ) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          passwordHash,
          role: "FACULTY",
          status: "ACTIVE",
        },
        select: USER_SAFE_SELECT,
      });

      const faculty = await tx.faculty.create({
        data: {
          userId: user.id,
          departmentId: data.departmentId,
          designation: data.designation,
          phone: data.phone || null,
          bio: data.bio || null,
          photoUrl: data.photoUrl || null,
        },
        include: {
          department: true,
        },
      });

      if (data.subjectIds && data.subjectIds.length > 0) {
        await tx.subject.updateMany({
          where: { id: { in: data.subjectIds } },
          data: { facultyId: faculty.id },
        });
      }

      const assignedSubjects = await tx.subject.findMany({
        where: { facultyId: faculty.id },
      });

      return {
        ...faculty,
        user,
        subjects: assignedSubjects,
      };
    });
  }

  async update(id: string, data: UpdateFacultyDto) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.faculty.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (existing && data.name) {
        await tx.user.update({
          where: { id: existing.userId },
          data: { name: data.name },
        });
      }

      const faculty = await tx.faculty.update({
        where: { id },
        data: {
          ...(data.designation !== undefined && { designation: data.designation }),
          ...(data.phone !== undefined && { phone: data.phone }),
          ...(data.bio !== undefined && { bio: data.bio }),
          ...(data.photoUrl !== undefined && { photoUrl: data.photoUrl }),
          ...(data.departmentId !== undefined && { departmentId: data.departmentId }),
        },
        include: {
          user: {
            select: USER_SAFE_SELECT,
          },
          department: true,
        },
      });

      if (data.subjectIds !== undefined) {
        // Unassign existing subjects for this faculty
        await tx.subject.updateMany({
          where: { facultyId: id },
          data: { facultyId: null },
        });

        // Assign newly requested subjects
        if (data.subjectIds.length > 0) {
          await tx.subject.updateMany({
            where: { id: { in: data.subjectIds } },
            data: { facultyId: id },
          });
        }
      }

      const subjects = await tx.subject.findMany({
        where: { facultyId: id },
      });

      return {
        ...faculty,
        subjects,
      };
    });
  }

  async delete(id: string) {
    const faculty = await prisma.faculty.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!faculty) return null;

    return prisma.user.delete({
      where: { id: faculty.userId },
    });
  }
}

export const facultyRepository = new FacultyRepository();
