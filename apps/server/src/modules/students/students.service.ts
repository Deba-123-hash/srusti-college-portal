// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Students Module Service (Business Logic & Department Scoping)
// =============================================================================

import { studentsRepository } from "./students.repository";
import { CreateStudentDto, UpdateStudentDto, StudentFilterParams } from "./students.types";
import { parsePagination, buildPaginationMeta } from "../../utils/pagination";
import { ApiError } from "../../utils/ApiError";
import { hashPassword } from "../../lib/password";
import { Prisma } from "@prisma/client";
import { AuthenticatedUserPayload } from "../../middleware/authenticate";

export class StudentsService {
  async getStudents(query: StudentFilterParams, user: AuthenticatedUserPayload) {
    // If student tries to browse the directory, restrict to own profile
    if (user.role === "STUDENT") {
      const ownStudent = await studentsRepository.findByUserId(user.id);
      if (!ownStudent) {
        return { items: [], meta: buildPaginationMeta(1, 20, 0) };
      }
      return {
        items: [ownStudent],
        meta: buildPaginationMeta(1, 20, 1),
      };
    }

    const { page, limit, skip, take } = parsePagination(query);

    const where: Prisma.StudentWhereInput = {};

    // RBAC: Department Scoping
    if (user.role === "DEPT_ADMIN") {
      where.departmentId = user.departmentId || "unassigned";
    } else if (query.departmentId) {
      where.departmentId = query.departmentId;
    }

    if (query.courseId) {
      where.courseId = query.courseId;
    }
    if (query.semester !== undefined) {
      where.currentSemester = query.semester;
    }
    if (query.regNo) {
      where.regNo = { contains: query.regNo, mode: "insensitive" };
    }

    if (query.search) {
      where.OR = [
        { regNo: { contains: query.search, mode: "insensitive" } },
        { user: { name: { contains: query.search, mode: "insensitive" } } },
        { user: { email: { contains: query.search, mode: "insensitive" } } },
      ];
    }

    const [items, total] = await Promise.all([
      studentsRepository.findMany({ where, skip, take }),
      studentsRepository.count(where),
    ]);

    return {
      items,
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async getStudentById(id: string, user: AuthenticatedUserPayload) {
    const student = await studentsRepository.findById(id);
    if (!student) {
      throw ApiError.notFound("Student not found", "STUDENT_NOT_FOUND");
    }

    // RBAC: Department Admin scoping
    if (user.role === "DEPT_ADMIN" && student.departmentId !== user.departmentId) {
      throw ApiError.notFound("Student not found", "STUDENT_NOT_FOUND");
    }

    // RBAC: Student can only view own record
    if (user.role === "STUDENT" && student.userId !== user.id) {
      throw ApiError.notFound("Student not found", "STUDENT_NOT_FOUND");
    }

    return student;
  }

  async getStudentByUserId(userId: string) {
    const student = await studentsRepository.findByUserId(userId);
    if (!student) {
      throw ApiError.notFound("Student profile not found", "STUDENT_NOT_FOUND");
    }
    return student;
  }

  async createStudent(data: CreateStudentDto, user: AuthenticatedUserPayload) {
    // RBAC: Dept Admin scoping
    if (user.role === "DEPT_ADMIN") {
      if (!user.departmentId || data.departmentId !== user.departmentId) {
        throw ApiError.forbidden(
          "Department administrators can only create students in their assigned department",
          "DEPT_ADMIN_RESTRICTION"
        );
      }
    }

    // Check unique email
    const existingEmail = await studentsRepository.findUserByEmail(data.email);
    if (existingEmail) {
      throw ApiError.conflict(
        `User with email '${data.email}' already exists`,
        "DUPLICATE_EMAIL"
      );
    }

    // Check unique regNo
    const existingRegNo = await studentsRepository.findByRegNo(data.regNo);
    if (existingRegNo) {
      throw ApiError.conflict(
        `Student with registration number '${data.regNo}' already exists`,
        "DUPLICATE_REG_NO"
      );
    }

    const passwordHash = await hashPassword(data.password || "Student@123");
    return studentsRepository.createWithUser(data, passwordHash);
  }

  async updateStudent(
    id: string,
    data: UpdateStudentDto,
    user: AuthenticatedUserPayload
  ) {
    const existing = await studentsRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound("Student not found", "STUDENT_NOT_FOUND");
    }

    // RBAC: Dept admin check
    if (user.role === "DEPT_ADMIN") {
      if (existing.departmentId !== user.departmentId) {
        throw ApiError.notFound("Student not found", "STUDENT_NOT_FOUND");
      }
      if (data.departmentId && data.departmentId !== user.departmentId) {
        throw ApiError.forbidden(
          "Cannot reassign student to another department",
          "DEPT_ADMIN_RESTRICTION"
        );
      }
    }

    // RBAC: Student updating own record can only change phone
    if (user.role === "STUDENT") {
      if (existing.userId !== user.id) {
        throw ApiError.notFound("Student not found", "STUDENT_NOT_FOUND");
      }
      return studentsRepository.update(id, { phone: data.phone });
    }

    return studentsRepository.update(id, data);
  }

  async deleteStudent(id: string, user: AuthenticatedUserPayload) {
    const existing = await studentsRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound("Student not found", "STUDENT_NOT_FOUND");
    }

    if (user.role === "DEPT_ADMIN" && existing.departmentId !== user.departmentId) {
      throw ApiError.notFound("Student not found", "STUDENT_NOT_FOUND");
    }

    await studentsRepository.delete(id);
  }
}

export const studentsService = new StudentsService();
