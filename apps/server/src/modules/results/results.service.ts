// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Results Module Service (Business Logic, Scoping & Audit Logging)
// =============================================================================

import { resultsRepository } from "./results.repository";
import {
  CreateResultDto,
  UpdateResultDto,
  PublishResultsDto,
  ResultFilterParams,
} from "./results.types";
import { parsePagination, buildPaginationMeta } from "../../utils/pagination";
import { ApiError } from "../../utils/ApiError";
import { logAuditEvent } from "../../lib/audit";
import { Prisma } from "@prisma/client";
import { AuthenticatedUserPayload } from "../../middleware/authenticate";

export class ResultsService {
  async getResults(query: ResultFilterParams, user: AuthenticatedUserPayload) {
    const { page, limit, skip, take } = parsePagination(query);

    const where: Prisma.ResultWhereInput = {};

    // 1. RBAC Scoping
    if (user.role === "STUDENT") {
      const student = await resultsRepository.findStudentByUserId(user.id);
      if (!student) {
        return { items: [], meta: buildPaginationMeta(1, 20, 0) };
      }
      where.studentId = student.id;
      // Students can ONLY view published results
      where.isPublished = true;
    } else if (user.role === "FACULTY") {
      const faculty = await resultsRepository.findFacultyByUserId(user.id);
      if (!faculty) {
        return { items: [], meta: buildPaginationMeta(1, 20, 0) };
      }
      where.subject = { facultyId: faculty.id };
      if (query.isPublished !== undefined) {
        where.isPublished = query.isPublished;
      }
    } else if (user.role === "DEPT_ADMIN") {
      where.student = { departmentId: user.departmentId || "unassigned" };
      if (query.isPublished !== undefined) {
        where.isPublished = query.isPublished;
      }
    } else {
      // SUPER_ADMIN
      if (query.isPublished !== undefined) {
        where.isPublished = query.isPublished;
      }
    }

    // 2. Additional filters
    if (query.studentId && user.role !== "STUDENT") {
      where.studentId = query.studentId;
    }
    if (query.subjectId) {
      where.subjectId = query.subjectId;
    }
    if (query.semester !== undefined) {
      where.semester = query.semester;
    }

    const [items, total] = await Promise.all([
      resultsRepository.findMany({ where, skip, take }),
      resultsRepository.count(where),
    ]);

    return {
      items,
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async getResultById(id: string, user: AuthenticatedUserPayload) {
    const result = await resultsRepository.findById(id);
    if (!result) {
      throw ApiError.notFound("Result not found", "RESULT_NOT_FOUND");
    }

    if (user.role === "STUDENT") {
      if (result.student.userId !== user.id || !result.isPublished) {
        throw ApiError.notFound("Result not found", "RESULT_NOT_FOUND");
      }
    }

    if (user.role === "FACULTY") {
      const faculty = await resultsRepository.findFacultyByUserId(user.id);
      if (!faculty || result.subject.facultyId !== faculty.id) {
        throw ApiError.notFound("Result not found", "RESULT_NOT_FOUND");
      }
    }

    if (
      user.role === "DEPT_ADMIN" &&
      result.student.departmentId !== user.departmentId
    ) {
      throw ApiError.notFound("Result not found", "RESULT_NOT_FOUND");
    }

    return result;
  }

  async createResult(data: CreateResultDto, user: AuthenticatedUserPayload) {
    if (user.role === "STUDENT") {
      throw ApiError.forbidden("Students cannot submit academic results");
    }

    const subject = await resultsRepository.findSubjectById(data.subjectId);
    if (!subject) {
      throw ApiError.notFound("Subject not found", "SUBJECT_NOT_FOUND");
    }

    if (user.role === "FACULTY") {
      const faculty = await resultsRepository.findFacultyByUserId(user.id);
      if (!faculty || subject.facultyId !== faculty.id) {
        throw ApiError.forbidden(
          "You can only submit results for your assigned subjects",
          "UNAUTHORIZED_FACULTY"
        );
      }
    }

    if (
      user.role === "DEPT_ADMIN" &&
      subject.course.departmentId !== user.departmentId
    ) {
      throw ApiError.forbidden(
        "Department administrators can only submit results for courses in their department",
        "DEPT_ADMIN_RESTRICTION"
      );
    }

    return resultsRepository.upsert(data);
  }

  async updateResult(
    id: string,
    data: UpdateResultDto,
    user: AuthenticatedUserPayload
  ) {
    const existing = await resultsRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound("Result not found", "RESULT_NOT_FOUND");
    }

    if (user.role === "STUDENT") {
      throw ApiError.forbidden("Students cannot modify academic results");
    }

    if (user.role === "FACULTY") {
      const faculty = await resultsRepository.findFacultyByUserId(user.id);
      if (!faculty || existing.subject.facultyId !== faculty.id) {
        throw ApiError.forbidden("You can only modify results for your assigned subjects");
      }
    }

    if (
      user.role === "DEPT_ADMIN" &&
      existing.student.departmentId !== user.departmentId
    ) {
      throw ApiError.notFound("Result not found", "RESULT_NOT_FOUND");
    }

    return resultsRepository.update(id, data);
  }

  async publishResults(
    params: PublishResultsDto,
    user: AuthenticatedUserPayload,
    ip?: string
  ) {
    if (user.role !== "SUPER_ADMIN" && user.role !== "DEPT_ADMIN") {
      throw ApiError.forbidden(
        "Only administrators can publish academic results",
        "UNAUTHORIZED_PUBLISH"
      );
    }

    const where: Prisma.ResultWhereInput = {
      isPublished: false,
    };

    if (user.role === "DEPT_ADMIN") {
      where.student = { departmentId: user.departmentId || "unassigned" };
    }

    if (params.subjectId) {
      where.subjectId = params.subjectId;
    }
    if (params.semester !== undefined) {
      where.semester = params.semester;
    }
    if (params.courseId) {
      where.subject = {
        courseId: params.courseId,
      };
    }

    const result = await resultsRepository.publishMany(where);

    // Audit Logging: RESULT_PUBLISH
    await logAuditEvent({
      userId: user.id,
      role: user.role,
      action: "RESULT_PUBLISH",
      targetResource: "Result",
      details: JSON.stringify({
        subjectId: params.subjectId,
        semester: params.semester,
        courseId: params.courseId,
        publishedCount: result.count,
      }),
      ipAddress: ip,
    });

    return {
      publishedCount: result.count,
    };
  }
}

export const resultsService = new ResultsService();
