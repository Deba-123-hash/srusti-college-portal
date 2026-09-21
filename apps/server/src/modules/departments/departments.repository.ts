// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Departments Module Repository (Prisma Data Access)
// =============================================================================

import { prisma } from "../../lib/prisma";
import { CreateDepartmentDto, UpdateDepartmentDto } from "./departments.types";
import { Prisma } from "@prisma/client";

export class DepartmentsRepository {
  async findMany(params: {
    where: Prisma.DepartmentWhereInput;
    skip: number;
    take: number;
  }) {
    return prisma.department.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      include: {
        _count: {
          select: {
            courses: true,
            faculty: true,
            students: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async count(where: Prisma.DepartmentWhereInput) {
    return prisma.department.count({ where });
  }

  async findById(id: string) {
    return prisma.department.findUnique({
      where: { id },
      include: {
        courses: true,
        _count: {
          select: {
            courses: true,
            faculty: true,
            students: true,
          },
        },
      },
    });
  }

  async findByCode(code: string) {
    return prisma.department.findUnique({
      where: { code },
    });
  }

  async findByName(name: string) {
    return prisma.department.findUnique({
      where: { name },
    });
  }

  async create(data: CreateDepartmentDto) {
    return prisma.department.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description || null,
      },
    });
  }

  async update(id: string, data: UpdateDepartmentDto) {
    return prisma.department.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.code !== undefined && { code: data.code }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });
  }

  async delete(id: string) {
    return prisma.department.delete({
      where: { id },
    });
  }
}

export const departmentsRepository = new DepartmentsRepository();
