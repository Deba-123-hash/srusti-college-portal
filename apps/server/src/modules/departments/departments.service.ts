// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Departments Module Service (Business Logic)
// =============================================================================

import { departmentsRepository } from "./departments.repository";
import { CreateDepartmentDto, UpdateDepartmentDto, DepartmentFilterParams } from "./departments.types";
import { parsePagination, buildPaginationMeta } from "../../utils/pagination";
import { ApiError } from "../../utils/ApiError";
import { Prisma } from "@prisma/client";

export class DepartmentsService {
  async getDepartments(query: DepartmentFilterParams) {
    const { page, limit, skip, take } = parsePagination(query);

    const where: Prisma.DepartmentWhereInput = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { code: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      departmentsRepository.findMany({ where, skip, take }),
      departmentsRepository.count(where),
    ]);

    return {
      items,
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async getDepartmentById(id: string) {
    const department = await departmentsRepository.findById(id);
    if (!department) {
      throw ApiError.notFound("Department not found", "DEPARTMENT_NOT_FOUND");
    }
    return department;
  }

  async createDepartment(data: CreateDepartmentDto) {
    const existingCode = await departmentsRepository.findByCode(data.code);
    if (existingCode) {
      throw ApiError.conflict(
        `Department with code '${data.code}' already exists`,
        "DUPLICATE_DEPARTMENT_CODE"
      );
    }

    const existingName = await departmentsRepository.findByName(data.name);
    if (existingName) {
      throw ApiError.conflict(
        `Department with name '${data.name}' already exists`,
        "DUPLICATE_DEPARTMENT_NAME"
      );
    }

    return departmentsRepository.create(data);
  }

  async updateDepartment(id: string, data: UpdateDepartmentDto) {
    await this.getDepartmentById(id);

    if (data.code) {
      const existingCode = await departmentsRepository.findByCode(data.code);
      if (existingCode && existingCode.id !== id) {
        throw ApiError.conflict(
          `Department with code '${data.code}' already exists`,
          "DUPLICATE_DEPARTMENT_CODE"
        );
      }
    }

    if (data.name) {
      const existingName = await departmentsRepository.findByName(data.name);
      if (existingName && existingName.id !== id) {
        throw ApiError.conflict(
          `Department with name '${data.name}' already exists`,
          "DUPLICATE_DEPARTMENT_NAME"
        );
      }
    }

    return departmentsRepository.update(id, data);
  }

  async deleteDepartment(id: string) {
    const department = await this.getDepartmentById(id);

    if (department.courses && department.courses.length > 0) {
      throw ApiError.badRequest(
        "Cannot delete department with active courses. Please reassign or delete courses first.",
        "DEPARTMENT_HAS_COURSES"
      );
    }

    return departmentsRepository.delete(id);
  }
}

export const departmentsService = new DepartmentsService();
