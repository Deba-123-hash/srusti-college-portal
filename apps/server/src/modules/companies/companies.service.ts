// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Companies Module Service (Business Logic)
// =============================================================================

import { companiesRepository } from "./companies.repository";
import { CreateCompanyDto, UpdateCompanyDto, CompanyFilterParams } from "./companies.types";
import { parsePagination, buildPaginationMeta } from "../../utils/pagination";
import { ApiError } from "../../utils/ApiError";
import { Prisma } from "@prisma/client";

export class CompaniesService {
  async getCompanies(query: CompanyFilterParams) {
    const { page, limit, skip, take } = parsePagination(query);

    const where: Prisma.CompanyWhereInput = {};
    if (query.industry) {
      where.industry = { contains: query.industry, mode: "insensitive" };
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { industry: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      companiesRepository.findMany({ where, skip, take }),
      companiesRepository.count(where),
    ]);

    return {
      items,
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async getCompanyById(id: string) {
    const company = await companiesRepository.findById(id);
    if (!company) {
      throw ApiError.notFound("Company not found", "COMPANY_NOT_FOUND");
    }
    return company;
  }

  async createCompany(data: CreateCompanyDto) {
    const existing = await companiesRepository.findByName(data.name);
    if (existing) {
      throw ApiError.conflict(
        `Company with name '${data.name}' already exists`,
        "DUPLICATE_COMPANY_NAME"
      );
    }

    return companiesRepository.create(data);
  }

  async updateCompany(id: string, data: UpdateCompanyDto) {
    await this.getCompanyById(id);

    if (data.name) {
      const existing = await companiesRepository.findByName(data.name);
      if (existing && existing.id !== id) {
        throw ApiError.conflict(
          `Company with name '${data.name}' already exists`,
          "DUPLICATE_COMPANY_NAME"
        );
      }
    }

    return companiesRepository.update(id, data);
  }

  async deleteCompany(id: string) {
    const company = await this.getCompanyById(id);
    if (company._count?.placementDrives && company._count.placementDrives > 0) {
      throw ApiError.badRequest(
        "Cannot delete company associated with active or past placement drives",
        "COMPANY_HAS_DRIVES"
      );
    }

    return companiesRepository.delete(id);
  }
}

export const companiesService = new CompaniesService();
