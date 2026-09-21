// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Placements Module Service (Business Logic, Eligibility & Applications)
// =============================================================================

import { placementsRepository } from "./placements.repository";
import {
  CreatePlacementDriveDto,
  UpdatePlacementDriveDto,
  UpdateApplicationDto,
  DriveFilterParams,
  ApplicationFilterParams,
} from "./placements.types";
import { parsePagination, buildPaginationMeta } from "../../utils/pagination";
import { ApiError } from "../../utils/ApiError";
import { Prisma } from "@prisma/client";
import { AuthenticatedUserPayload } from "../../middleware/authenticate";

export class PlacementsService {
  // --- Drives ---

  async getDrives(query: DriveFilterParams, user?: AuthenticatedUserPayload) {
    const { page, limit, skip, take } = parsePagination(query);

    const where: Prisma.PlacementDriveWhereInput = {};

    const isAdmin = user && (user.role === "SUPER_ADMIN" || user.role === "DEPT_ADMIN");
    if (!isAdmin) {
      where.isActive = true;
    } else if (query.active !== undefined) {
      where.isActive = query.active;
    }

    if (query.companyId) {
      where.companyId = query.companyId;
    }
    if (query.date) {
      where.driveDate = query.date;
    }
    if (query.course) {
      where.eligibleCourses = { contains: query.course, mode: "insensitive" };
    }
    if (query.search) {
      where.OR = [
        { jobRole: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
        { location: { contains: query.search, mode: "insensitive" } },
        { company: { name: { contains: query.search, mode: "insensitive" } } },
      ];
    }

    const [items, total] = await Promise.all([
      placementsRepository.findDrives({ where, skip, take }),
      placementsRepository.countDrives(where),
    ]);

    return {
      items,
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async getDriveById(id: string, user?: AuthenticatedUserPayload) {
    const drive = await placementsRepository.findDriveById(id);
    if (!drive) {
      throw ApiError.notFound("Placement drive not found", "DRIVE_NOT_FOUND");
    }

    const isAdmin = user && (user.role === "SUPER_ADMIN" || user.role === "DEPT_ADMIN");
    if (!drive.isActive && !isAdmin) {
      throw ApiError.notFound("Placement drive not found", "DRIVE_NOT_FOUND");
    }

    return drive;
  }

  async createDrive(data: CreatePlacementDriveDto) {
    return placementsRepository.createDrive(data);
  }

  async updateDrive(id: string, data: UpdatePlacementDriveDto) {
    await this.getDriveById(id);
    return placementsRepository.updateDrive(id, data);
  }

  async deleteDrive(id: string) {
    await this.getDriveById(id);
    return placementsRepository.deleteDrive(id);
  }

  // --- Applications ---

  async applyToDrive(driveId: string, userId: string) {
    const student = await placementsRepository.findStudentByUserId(userId);
    if (!student) {
      throw ApiError.badRequest(
        "Only enrolled students can apply for placement drives",
        "STUDENT_PROFILE_REQUIRED"
      );
    }

    const drive = await placementsRepository.findDriveById(driveId);
    if (!drive || !drive.isActive) {
      throw ApiError.notFound("Placement drive not found or inactive", "DRIVE_NOT_FOUND");
    }

    // 1. Deadline Check
    const today = new Date().toISOString().split("T")[0];
    if (drive.deadline && drive.deadline < today) {
      throw ApiError.badRequest(
        `Application deadline (${drive.deadline}) has passed`,
        "APPLICATION_DEADLINE_PASSED"
      );
    }

    // 2. CGPA Eligibility Check
    if (student.cgpa < drive.minCgpa) {
      throw ApiError.badRequest(
        `Your CGPA (${student.cgpa}) does not satisfy the minimum requirement (${drive.minCgpa}) for this drive`,
        "INSUFFICIENT_CGPA"
      );
    }

    // 3. Course Eligibility Check
    const eligibleList = drive.eligibleCourses.toLowerCase();
    const courseCode = student.course.code?.toLowerCase() || "";
    const courseName = student.course.name.toLowerCase();

    const isEligibleCourse =
      eligibleList.includes("all") ||
      (courseCode && eligibleList.includes(courseCode)) ||
      eligibleList.includes(courseName);

    if (!isEligibleCourse) {
      throw ApiError.badRequest(
        `Your course (${student.course.name}) is not eligible for this drive (${drive.eligibleCourses})`,
        "COURSE_NOT_ELIGIBLE"
      );
    }

    // 4. Duplicate Check
    const existing = await placementsRepository.findApplication(driveId, student.id);
    if (existing) {
      throw ApiError.conflict(
        "You have already applied for this placement drive",
        "DUPLICATE_APPLICATION"
      );
    }

    return placementsRepository.createApplication(driveId, student.id);
  }

  async getApplications(
    query: ApplicationFilterParams,
    user: AuthenticatedUserPayload
  ) {
    const { page, limit, skip, take } = parsePagination(query);

    const where: Prisma.PlacementApplicationWhereInput = {};

    // RBAC: Department Admin scoping
    if (user.role === "DEPT_ADMIN") {
      where.student = { departmentId: user.departmentId || "unassigned" };
    }

    if (query.driveId) {
      where.driveId = query.driveId;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.studentId) {
      where.studentId = query.studentId;
    }

    const [items, total] = await Promise.all([
      placementsRepository.findApplications({ where, skip, take }),
      placementsRepository.countApplications(where),
    ]);

    return {
      items,
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async getApplicationById(id: string, user: AuthenticatedUserPayload) {
    const application = await placementsRepository.findApplicationById(id);
    if (!application) {
      throw ApiError.notFound("Application not found", "APPLICATION_NOT_FOUND");
    }

    if (user.role === "STUDENT" && application.student.userId !== user.id) {
      throw ApiError.notFound("Application not found", "APPLICATION_NOT_FOUND");
    }

    if (
      user.role === "DEPT_ADMIN" &&
      application.student.departmentId !== user.departmentId
    ) {
      throw ApiError.notFound("Application not found", "APPLICATION_NOT_FOUND");
    }

    return application;
  }

  async updateApplication(
    id: string,
    data: UpdateApplicationDto,
    user: AuthenticatedUserPayload
  ) {
    const existing = await placementsRepository.findApplicationById(id);
    if (!existing) {
      throw ApiError.notFound("Application not found", "APPLICATION_NOT_FOUND");
    }

    if (
      user.role === "DEPT_ADMIN" &&
      existing.student.departmentId !== user.departmentId
    ) {
      throw ApiError.notFound("Application not found", "APPLICATION_NOT_FOUND");
    }

    return placementsRepository.updateApplication(id, data);
  }

  async getMyApplications(userId: string) {
    const student = await placementsRepository.findStudentByUserId(userId);
    if (!student) {
      return [];
    }
    return placementsRepository.findStudentApplications(student.id);
  }
}

export const placementsService = new PlacementsService();
