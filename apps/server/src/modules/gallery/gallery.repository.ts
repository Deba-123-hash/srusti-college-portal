// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Gallery Module Repository (Prisma Data Access)
// =============================================================================

import { prisma } from "../../lib/prisma";
import { CreateGalleryItemDto, UpdateGalleryItemDto } from "./gallery.types";
import { Prisma } from "@prisma/client";

export class GalleryRepository {
  async findMany(params: {
    where: Prisma.GalleryItemWhereInput;
    skip: number;
    take: number;
  }) {
    return prisma.galleryItem.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
  }

  async count(where: Prisma.GalleryItemWhereInput) {
    return prisma.galleryItem.count({ where });
  }

  async findById(id: string) {
    return prisma.galleryItem.findUnique({
      where: { id },
    });
  }

  async create(data: CreateGalleryItemDto) {
    return prisma.galleryItem.create({
      data: {
        title: data.title,
        category: data.category,
        imageUrl: data.imageUrl,
        caption: data.caption || null,
      },
    });
  }

  async update(id: string, data: UpdateGalleryItemDto) {
    return prisma.galleryItem.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.caption !== undefined && { caption: data.caption }),
      },
    });
  }

  async delete(id: string) {
    return prisma.galleryItem.delete({
      where: { id },
    });
  }
}

export const galleryRepository = new GalleryRepository();
