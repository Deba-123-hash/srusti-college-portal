// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Announcements Module Repository (Prisma Data Access)
// =============================================================================

import { prisma } from "../../lib/prisma";
import { CreateAnnouncementDto, UpdateAnnouncementDto } from "./announcements.types";
import { Prisma } from "@prisma/client";

export class AnnouncementsRepository {
  async findMany(params: {
    where: Prisma.AnnouncementWhereInput;
    skip: number;
    take: number;
  }) {
    return prisma.announcement.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    });
  }

  async count(where: Prisma.AnnouncementWhereInput) {
    return prisma.announcement.count({ where });
  }

  async findById(id: string) {
    return prisma.announcement.findUnique({
      where: { id },
    });
  }

  async create(data: CreateAnnouncementDto) {
    return prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        category: data.category || "General",
        isPinned: data.isPinned ?? false,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
  }

  async update(id: string, data: UpdateAnnouncementDto) {
    return prisma.announcement.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.isPinned !== undefined && { isPinned: data.isPinned }),
        ...(data.expiresAt !== undefined && {
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        }),
      },
    });
  }

  async delete(id: string) {
    return prisma.announcement.delete({
      where: { id },
    });
  }
}

export const announcementsRepository = new AnnouncementsRepository();
