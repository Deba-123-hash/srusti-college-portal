// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Faculty Module Service (Business Logic & Scoping)
// =============================================================================

import { facultyRepository } from "./faculty.repository";
import { CreateFacultyDto, UpdateFacultyDto, FacultyFilterParams } from "./faculty.types";
import { parsePagination, buildPaginationMeta } from "../../utils/pagination";
import { ApiError } from "../../utils/ApiError";
import { hashPassword } from "../../lib/password";
import { Prisma } from "@prisma/client";
import { AuthenticatedUserPayload } from "../../middleware/authenticate";

export class FacultyService {
  async getFaculty(query: FacultyFilterParams, user: AuthenticatedUserPayload) {
    const { page, limit, skip, take } = parsePagination(query);

    const where: Prisma.FacultyWhereInput = {};

    // RBAC: Department Scoping
    if (user.role === "DEPT_ADMIN") {
      where.departmentId = user.departmentId || "unassigned";
    } else if (query.departmentId) {
      where.departmentId = query.departmentId;
    }

    if (query.search) {
      where.OR = [
        { designation: { contains: query.search, mode: "insensitive" } },
        { user: { name: { contains: query.search, mode: "insensitive" } } },
        { user: { email: { contains: query.search, mode: "insensitive" } } },
      ];
    }

    const [items, total] = await Promise.all([
      facultyRepository.findMany({ where, skip, take }),
      facultyRepository.count(where),
    ]);

    return {
      items,
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async getFacultyById(id: string, user: AuthenticatedUserPayload) {
    const faculty = await facultyRepository.findById(id);
    if (!faculty) {
      throw ApiError.notFound("Faculty not found", "FACULTY_NOT_FOUND");
    }

    if (user.role === "DEPT_ADMIN" && faculty.departmentId !== user.departmentId) {
      throw ApiError.notFound("Faculty not found", "FACULTY_NOT_FOUND");
    }

    return faculty;
  }

  async getFacultyByUserId(userId: string) {
    const faculty = await facultyRepository.findByUserId(userId);
    if (!faculty) {
      throw ApiError.notFound("Faculty profile not found", "FACULTY_NOT_FOUND");
    }
    return faculty;
  }

  async createFaculty(data: CreateFacultyDto, user: AuthenticatedUserPayload) {
    // RBAC: Department Admin scoping
    if (user.role === "DEPT_ADMIN") {
      if (!user.departmentId || data.departmentId !== user.departmentId) {
        throw ApiError.forbidden(
          "Department administrators can only add faculty to their assigned department",
          "DEPT_ADMIN_RESTRICTION"
        );
      }
    }

    const existingEmail = await facultyRepository.findUserByEmail(data.email);
    if (existingEmail) {
      throw ApiError.conflict(
        `User with email '${data.email}' already exists`,
        "DUPLICATE_EMAIL"
      );
    }

    const passwordHash = await hashPassword(data.password || "Faculty@123");
    return facultyRepository.createWithUser(data, passwordHash);
  }

  async updateFaculty(
    id: string,
    data: UpdateFacultyDto,
    user: AuthenticatedUserPayload
  ) {
    const existing = await facultyRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound("Faculty not found", "FACULTY_NOT_FOUND");
    }

    // RBAC: Dept Admin
    if (user.role === "DEPT_ADMIN") {
      if (existing.departmentId !== user.departmentId) {
        throw ApiError.notFound("Faculty not found", "FACULTY_NOT_FOUND");
      }
      if (data.departmentId && data.departmentId !== user.departmentId) {
        throw ApiError.forbidden(
          "Cannot reassign faculty to another department",
          "DEPT_ADMIN_RESTRICTION"
        );
      }
    }

    // RBAC: Faculty updating own profile
    if (user.role === "FACULTY") {
      if (existing.userId !== user.id) {
        throw ApiError.notFound("Faculty not found", "FACULTY_NOT_FOUND");
      }
      // Faculty cannot reassign department or change subject assignments themselves
      return facultyRepository.update(id, {
        phone: data.phone,
        bio: data.bio,
        photoUrl: data.photoUrl,
        name: data.name,
      });
    }

    return facultyRepository.update(id, data);
  }

  async deleteFaculty(id: string, user: AuthenticatedUserPayload) {
    const existing = await facultyRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound("Faculty not found", "FACULTY_NOT_FOUND");
    }

    if (user.role === "DEPT_ADMIN" && existing.departmentId !== user.departmentId) {
      throw ApiError.notFound("Faculty not found", "FACULTY_NOT_FOUND");
    }

    await facultyRepository.delete(id);
  }
}

export const facultyService = new FacultyService();
