// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Companies Module Repository (Prisma Data Access)
// =============================================================================

import { prisma } from "../../lib/prisma";
import { CreateCompanyDto, UpdateCompanyDto } from "./companies.types";
import { Prisma } from "@prisma/client";

export class CompaniesRepository {
  async findMany(params: {
    where: Prisma.CompanyWhereInput;
    skip: number;
    take: number;
  }) {
    return prisma.company.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      include: {
        _count: {
          select: { placementDrives: true },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async count(where: Prisma.CompanyWhereInput) {
    return prisma.company.count({ where });
  }

  async findById(id: string) {
    return prisma.company.findUnique({
      where: { id },
      include: {
        placementDrives: {
          where: { isActive: true },
          orderBy: { driveDate: "asc" },
        },
        _count: {
          select: { placementDrives: true },
        },
      },
    });
  }

  async findByName(name: string) {
    return prisma.company.findUnique({
      where: { name },
    });
  }

  async create(data: CreateCompanyDto) {
    return prisma.company.create({
      data: {
        name: data.name,
        website: data.website || null,
        logoUrl: data.logoUrl || null,
        industry: data.industry,
        description: data.description || null,
      },
    });
  }

  async update(id: string, data: UpdateCompanyDto) {
    return prisma.company.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.website !== undefined && { website: data.website }),
        ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
        ...(data.industry !== undefined && { industry: data.industry }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });
  }

  async delete(id: string) {
    return prisma.company.delete({
      where: { id },
    });
  }
}

export const companiesRepository = new CompaniesRepository();
