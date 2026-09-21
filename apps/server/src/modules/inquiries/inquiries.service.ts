// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Inquiries Module Service (Business Logic)
// =============================================================================

import { inquiriesRepository } from "./inquiries.repository";
import { CreateInquiryDto, UpdateInquiryDto, InquiryFilterParams } from "./inquiries.types";
import { parsePagination, buildPaginationMeta } from "../../utils/pagination";
import { ApiError } from "../../utils/ApiError";
import { Prisma } from "@prisma/client";

export class InquiriesService {
  async getInquiries(query: InquiryFilterParams) {
    const { page, limit, skip, take } = parsePagination(query);

    const where: Prisma.InquiryWhereInput = {};

    if (query.type) {
      where.type = { contains: query.type, mode: "insensitive" };
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.isRead !== undefined) {
      where.isRead = query.isRead;
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
        { phone: { contains: query.search, mode: "insensitive" } },
        { message: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      inquiriesRepository.findMany({ where, skip, take }),
      inquiriesRepository.count(where),
    ]);

    return {
      items,
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async getInquiryById(id: string) {
    const inquiry = await inquiriesRepository.findById(id);
    if (!inquiry) {
      throw ApiError.notFound("Inquiry not found", "INQUIRY_NOT_FOUND");
    }
    return inquiry;
  }

  async createInquiry(data: CreateInquiryDto) {
    return inquiriesRepository.create(data);
  }

  async updateInquiry(id: string, data: UpdateInquiryDto) {
    await this.getInquiryById(id);
    return inquiriesRepository.update(id, data);
  }

  async deleteInquiry(id: string) {
    await this.getInquiryById(id);
    return inquiriesRepository.delete(id);
  }
}

export const inquiriesService = new InquiriesService();
