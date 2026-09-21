// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Courses Module Service (Business Logic & Redis Caching)
// =============================================================================

import { coursesRepository } from "./courses.repository";
import { CreateCourseDto, UpdateCourseDto, CourseFilterParams } from "./courses.types";
import { parsePagination, buildPaginationMeta } from "../../utils/pagination";
import { ApiError } from "../../utils/ApiError";
import { redis } from "../../lib/redis";
import { Prisma } from "@prisma/client";
import { AuthenticatedUserPayload } from "../../middleware/authenticate";

const COURSES_LIST_CACHE_KEY = "cache:courses:list";
const CACHE_TTL_SECONDS = 300; // 5 minutes

export class CoursesService {
  /**
   * Invalidate courses cache in Redis
   */
  async invalidateCache() {
    try {
      await redis.del(COURSES_LIST_CACHE_KEY);
    } catch {
      // Redis error should not block database operations
    }
  }

  async getCourses(query: CourseFilterParams) {
    const isDefaultQuery =
      !query.search &&
      !query.departmentId &&
      (!query.page || query.page === 1) &&
      (!query.limit || query.limit === 20);

    // Try serving from Redis for default public listings
    if (isDefaultQuery) {
      try {
        const cached = await redis.get(COURSES_LIST_CACHE_KEY);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch {
        // Fallback to database
      }
    }

    const { page, limit, skip, take } = parsePagination(query);

    const where: Prisma.CourseWhereInput = {};
    if (query.departmentId) {
      where.departmentId = query.departmentId;
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { slug: { contains: query.search, mode: "insensitive" } },
        { code: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      coursesRepository.findMany({ where, skip, take }),
      coursesRepository.count(where),
    ]);

    const result = {
      items,
      meta: buildPaginationMeta(page, limit, total),
    };

    if (isDefaultQuery) {
      try {
        await redis.set(
          COURSES_LIST_CACHE_KEY,
          JSON.stringify(result),
          "EX",
          CACHE_TTL_SECONDS
        );
      } catch {
        // Non-fatal
      }
    }

    return result;
  }

  async getCourseById(id: string) {
    const course = await coursesRepository.findById(id);
    if (!course) {
      throw ApiError.notFound("Course not found", "COURSE_NOT_FOUND");
    }
    return course;
  }

  async getCourseBySlug(slug: string) {
    const course = await coursesRepository.findBySlug(slug);
    if (!course) {
      throw ApiError.notFound("Course not found", "COURSE_NOT_FOUND");
    }
    return course;
  }

  async createCourse(data: CreateCourseDto, user: AuthenticatedUserPayload) {
    // RBAC: If DEPT_ADMIN, enforce department scoping
    if (user.role === "DEPT_ADMIN") {
      if (!user.departmentId || data.departmentId !== user.departmentId) {
        throw ApiError.forbidden(
          "Department administrators can only create courses in their own department",
          "DEPT_ADMIN_RESTRICTION"
        );
      }
    }

    // Check slug uniqueness
    const existingSlug = await coursesRepository.findBySlug(data.slug);
    if (existingSlug) {
      throw ApiError.conflict(
        `Course with slug '${data.slug}' already exists`,
        "DUPLICATE_COURSE_SLUG"
      );
    }

    // Check code uniqueness if provided
    if (data.code) {
      const existingCode = await coursesRepository.findByCode(data.code);
      if (existingCode) {
        throw ApiError.conflict(
          `Course with code '${data.code}' already exists`,
          "DUPLICATE_COURSE_CODE"
        );
      }
    }

    const course = await coursesRepository.create(data);
    await this.invalidateCache();
    return course;
  }

  async updateCourse(
    id: string,
    data: UpdateCourseDto,
    user: AuthenticatedUserPayload
  ) {
    const existing = await coursesRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound("Course not found", "COURSE_NOT_FOUND");
    }

    // RBAC: If DEPT_ADMIN, enforce department scoping
    if (user.role === "DEPT_ADMIN") {
      if (existing.departmentId !== user.departmentId) {
        // Return 404 to avoid leaking existence
        throw ApiError.notFound("Course not found", "COURSE_NOT_FOUND");
      }
      if (data.departmentId && data.departmentId !== user.departmentId) {
        throw ApiError.forbidden(
          "Department administrators cannot reassign courses to other departments",
          "DEPT_ADMIN_RESTRICTION"
        );
      }
    }

    // Check slug if changing
    if (data.slug && data.slug !== existing.slug) {
      const slugCheck = await coursesRepository.findBySlug(data.slug);
      if (slugCheck && slugCheck.id !== id) {
        throw ApiError.conflict(
          `Course with slug '${data.slug}' already exists`,
          "DUPLICATE_COURSE_SLUG"
        );
      }
    }

    // Check code if changing
    if (data.code && data.code !== existing.code) {
      const codeCheck = await coursesRepository.findByCode(data.code);
      if (codeCheck && codeCheck.id !== id) {
        throw ApiError.conflict(
          `Course with code '${data.code}' already exists`,
          "DUPLICATE_COURSE_CODE"
        );
      }
    }

    const updated = await coursesRepository.update(id, data);
    await this.invalidateCache();
    return updated;
  }

  async deleteCourse(id: string, user: AuthenticatedUserPayload) {
    const existing = await coursesRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound("Course not found", "COURSE_NOT_FOUND");
    }

    // RBAC: If DEPT_ADMIN, enforce department scoping
    if (user.role === "DEPT_ADMIN" && existing.departmentId !== user.departmentId) {
      throw ApiError.notFound("Course not found", "COURSE_NOT_FOUND");
    }

    if (existing._count?.students && existing._count.students > 0) {
      throw ApiError.badRequest(
        "Cannot delete course with enrolled students",
        "COURSE_HAS_STUDENTS"
      );
    }

    await coursesRepository.delete(id);
    await this.invalidateCache();
  }
}

export const coursesService = new CoursesService();
