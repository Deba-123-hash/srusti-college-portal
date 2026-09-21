// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Placements Module Repository (Prisma Data Access)
// =============================================================================

import { prisma } from "../../lib/prisma";
import {
  CreatePlacementDriveDto,
  UpdatePlacementDriveDto,
  UpdateApplicationDto,
} from "./placements.types";
import { Prisma } from "@prisma/client";

export class PlacementsRepository {
  // --- Drives ---

  async findDrives(params: {
    where: Prisma.PlacementDriveWhereInput;
    skip: number;
    take: number;
  }) {
    return prisma.placementDrive.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            industry: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { driveDate: "asc" },
    });
  }

  async countDrives(where: Prisma.PlacementDriveWhereInput) {
    return prisma.placementDrive.count({ where });
  }

  async findDriveById(id: string) {
    return prisma.placementDrive.findUnique({
      where: { id },
      include: {
        company: true,
        _count: {
          select: { applications: true },
        },
      },
    });
  }

  async createDrive(data: CreatePlacementDriveDto) {
    return prisma.placementDrive.create({
      data: {
        companyId: data.companyId,
        jobRole: data.jobRole,
        ctcPackage: data.ctcPackage,
        eligibleCourses: data.eligibleCourses,
        minCgpa: data.minCgpa ?? 6.0,
        driveDate: data.driveDate,
        location: data.location,
        description: data.description,
        deadline: data.deadline,
        isActive: data.isActive ?? true,
      },
      include: {
        company: true,
      },
    });
  }

  async updateDrive(id: string, data: UpdatePlacementDriveDto) {
    return prisma.placementDrive.update({
      where: { id },
      data: {
        ...(data.companyId !== undefined && { companyId: data.companyId }),
        ...(data.jobRole !== undefined && { jobRole: data.jobRole }),
        ...(data.ctcPackage !== undefined && { ctcPackage: data.ctcPackage }),
        ...(data.eligibleCourses !== undefined && {
          eligibleCourses: data.eligibleCourses,
        }),
        ...(data.minCgpa !== undefined && { minCgpa: data.minCgpa }),
        ...(data.driveDate !== undefined && { driveDate: data.driveDate }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.deadline !== undefined && { deadline: data.deadline }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: {
        company: true,
      },
    });
  }

  async deleteDrive(id: string) {
    return prisma.placementDrive.delete({
      where: { id },
    });
  }

  // --- Applications ---

  async findApplication(driveId: string, studentId: string) {
    return prisma.placementApplication.findUnique({
      where: {
        driveId_studentId: {
          driveId,
          studentId,
        },
      },
    });
  }

  async createApplication(driveId: string, studentId: string) {
    return prisma.placementApplication.create({
      data: {
        driveId,
        studentId,
        status: "APPLIED",
      },
      include: {
        drive: {
          include: { company: true },
        },
      },
    });
  }

  async findApplications(params: {
    where: Prisma.PlacementApplicationWhereInput;
    skip: number;
    take: number;
  }) {
    return prisma.placementApplication.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            course: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            department: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
        drive: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
              },
            },
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });
  }

  async countApplications(where: Prisma.PlacementApplicationWhereInput) {
    return prisma.placementApplication.count({ where });
  }

  async findApplicationById(id: string) {
    return prisma.placementApplication.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            course: true,
            department: true,
          },
        },
        drive: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  async updateApplication(id: string, data: UpdateApplicationDto) {
    return prisma.placementApplication.update({
      where: { id },
      data: {
        status: data.status,
        ...(data.notes !== undefined && { notes: data.notes }),
      },
      include: {
        drive: {
          include: { company: true },
        },
      },
    });
  }

  async findStudentApplications(studentId: string) {
    return prisma.placementApplication.findMany({
      where: { studentId },
      include: {
        drive: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
                industry: true,
              },
            },
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });
  }

  async findStudentByUserId(userId: string) {
    return prisma.student.findUnique({
      where: { userId },
      include: {
        course: true,
        department: true,
      },
    });
  }
}

export const placementsRepository = new PlacementsRepository();
