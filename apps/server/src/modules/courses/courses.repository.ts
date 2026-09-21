// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Courses Module Repository (Prisma Data Access)
// =============================================================================

import { prisma } from "../../lib/prisma";
import { CreateCourseDto, UpdateCourseDto } from "./courses.types";
import { Prisma } from "@prisma/client";

export class CoursesRepository {
  async findMany(params: {
    where: Prisma.CourseWhereInput;
    skip: number;
    take: number;
  }) {
    return prisma.course.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      include: {
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        _count: {
          select: {
            subjects: true,
            students: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async count(where: Prisma.CourseWhereInput) {
    return prisma.course.count({ where });
  }

  async findById(id: string) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        department: true,
        subjects: {
          orderBy: { semester: "asc" },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.course.findUnique({
      where: { slug },
      include: {
        department: true,
        subjects: {
          orderBy: { semester: "asc" },
        },
      },
    });
  }

  async findByCode(code: string) {
    return prisma.course.findUnique({
      where: { code },
    });
  }

  async create(data: CreateCourseDto) {
    return prisma.course.create({
      data: {
        name: data.name,
        slug: data.slug,
        code: data.code || null,
        departmentId: data.departmentId,
        durationYears: data.durationYears,
        eligibility: data.eligibility,
        totalFees: data.totalFees,
        description: data.description,
        syllabusUrl: data.syllabusUrl || null,
      },
      include: {
        department: true,
      },
    });
  }

  async update(id: string, data: UpdateCourseDto) {
    return prisma.course.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.code !== undefined && { code: data.code }),
        ...(data.departmentId !== undefined && { departmentId: data.departmentId }),
        ...(data.durationYears !== undefined && { durationYears: data.durationYears }),
        ...(data.eligibility !== undefined && { eligibility: data.eligibility }),
        ...(data.totalFees !== undefined && { totalFees: data.totalFees }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.syllabusUrl !== undefined && { syllabusUrl: data.syllabusUrl }),
      },
      include: {
        department: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.course.delete({
      where: { id },
    });
  }
}

export const coursesRepository = new CoursesRepository();
