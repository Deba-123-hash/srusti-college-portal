// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Subjects Module Service (Business Logic & Scoping)
// =============================================================================

import { subjectsRepository } from "./subjects.repository";
import { CreateSubjectDto, UpdateSubjectDto, SubjectFilterParams } from "./subjects.types";
import { parsePagination, buildPaginationMeta } from "../../utils/pagination";
import { ApiError } from "../../utils/ApiError";
import { prisma } from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import { AuthenticatedUserPayload } from "../../middleware/authenticate";

export class SubjectsService {
  async getSubjects(query: SubjectFilterParams) {
    const { page, limit, skip, take } = parsePagination(query);

    const where: Prisma.SubjectWhereInput = {};
    if (query.courseId) {
      where.courseId = query.courseId;
    }
    if (query.semester !== undefined) {
      where.semester = query.semester;
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { code: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      subjectsRepository.findMany({ where, skip, take }),
      subjectsRepository.count(where),
    ]);

    return {
      items,
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async getSubjectById(id: string) {
    const subject = await subjectsRepository.findById(id);
    if (!subject) {
      throw ApiError.notFound("Subject not found", "SUBJECT_NOT_FOUND");
    }
    return subject;
  }

  async createSubject(data: CreateSubjectDto, user: AuthenticatedUserPayload) {
    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
    });
    if (!course) {
      throw ApiError.notFound("Course not found", "COURSE_NOT_FOUND");
    }

    // RBAC: If DEPT_ADMIN, course must belong to their department
    if (user.role === "DEPT_ADMIN" && course.departmentId !== user.departmentId) {
      throw ApiError.forbidden(
        "Department administrators can only manage subjects for their own department's courses",
        "DEPT_ADMIN_RESTRICTION"
      );
    }

    // Verify code uniqueness
    const existingCode = await subjectsRepository.findByCode(data.code);
    if (existingCode) {
      throw ApiError.conflict(
        `Subject with code '${data.code}' already exists`,
        "DUPLICATE_SUBJECT_CODE"
      );
    }

    // If facultyId provided, verify faculty exists
    if (data.facultyId) {
      const faculty = await prisma.faculty.findUnique({
        where: { id: data.facultyId },
      });
      if (!faculty) {
        throw ApiError.badRequest("Assigned faculty not found", "FACULTY_NOT_FOUND");
      }
    }

    return subjectsRepository.create(data);
  }

  async updateSubject(
    id: string,
    data: UpdateSubjectDto,
    user: AuthenticatedUserPayload
  ) {
    const existing = await subjectsRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound("Subject not found", "SUBJECT_NOT_FOUND");
    }

    // RBAC: DEPT_ADMIN check
    if (
      user.role === "DEPT_ADMIN" &&
      existing.course.departmentId !== user.departmentId
    ) {
      throw ApiError.notFound("Subject not found", "SUBJECT_NOT_FOUND");
    }

    if (data.code && data.code !== existing.code) {
      const codeCheck = await subjectsRepository.findByCode(data.code);
      if (codeCheck && codeCheck.id !== id) {
        throw ApiError.conflict(
          `Subject with code '${data.code}' already exists`,
          "DUPLICATE_SUBJECT_CODE"
        );
      }
    }

    if (data.courseId && data.courseId !== existing.courseId) {
      const course = await prisma.course.findUnique({
        where: { id: data.courseId },
      });
      if (!course) {
        throw ApiError.notFound("Course not found", "COURSE_NOT_FOUND");
      }
      if (user.role === "DEPT_ADMIN" && course.departmentId !== user.departmentId) {
        throw ApiError.forbidden(
          "Cannot reassign subject to course in another department",
          "DEPT_ADMIN_RESTRICTION"
        );
      }
    }

    return subjectsRepository.update(id, data);
  }

  async deleteSubject(id: string, user: AuthenticatedUserPayload) {
    const existing = await subjectsRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound("Subject not found", "SUBJECT_NOT_FOUND");
    }

    if (
      user.role === "DEPT_ADMIN" &&
      existing.course.departmentId !== user.departmentId
    ) {
      throw ApiError.notFound("Subject not found", "SUBJECT_NOT_FOUND");
    }

    await subjectsRepository.delete(id);
  }
}

export const subjectsService = new SubjectsService();
