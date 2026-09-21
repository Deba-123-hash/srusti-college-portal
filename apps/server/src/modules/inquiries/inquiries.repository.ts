// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Inquiries Module Repository (Prisma Data Access)
// =============================================================================

import { prisma } from "../../lib/prisma";
import { CreateInquiryDto, UpdateInquiryDto } from "./inquiries.types";
import { Prisma } from "@prisma/client";

export class InquiriesRepository {
  async findMany(params: {
    where: Prisma.InquiryWhereInput;
    skip: number;
    take: number;
  }) {
    return prisma.inquiry.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
  }

  async count(where: Prisma.InquiryWhereInput) {
    return prisma.inquiry.count({ where });
  }

  async findById(id: string) {
    return prisma.inquiry.findUnique({
      where: { id },
    });
  }

  async create(data: CreateInquiryDto) {
    return prisma.inquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        courseOfInterest: data.courseOfInterest || null,
        message: data.message,
        type: data.source || data.type || "GENERAL",
        status: "NEW",
        isRead: false,
      },
    });
  }

  async update(id: string, data: UpdateInquiryDto) {
    return prisma.inquiry.update({
      where: { id },
      data: {
        ...(data.status !== undefined && { status: data.status }),
        ...(data.isRead !== undefined && { isRead: data.isRead }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });
  }

  async delete(id: string) {
    return prisma.inquiry.delete({
      where: { id },
    });
  }
}

export const inquiriesRepository = new InquiriesRepository();
