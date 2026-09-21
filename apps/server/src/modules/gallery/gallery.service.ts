// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Gallery Module Service (Business Logic & Media Processing)
// =============================================================================

import { galleryRepository } from "./gallery.repository";
import {
  CreateGalleryItemDto,
  UpdateGalleryItemDto,
  GalleryFilterParams,
} from "./gallery.types";
import { parsePagination, buildPaginationMeta } from "../../utils/pagination";
import { ApiError } from "../../utils/ApiError";
import { saveUploadedFile } from "../../lib/upload";
import { Prisma } from "@prisma/client";

export class GalleryService {
  async getGallery(query: GalleryFilterParams) {
    const { page, limit, skip, take } = parsePagination(query);

    const where: Prisma.GalleryItemWhereInput = {};
    if (query.category) {
      where.category = query.category;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { caption: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      galleryRepository.findMany({ where, skip, take }),
      galleryRepository.count(where),
    ]);

    return {
      items,
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async getGalleryById(id: string) {
    const item = await galleryRepository.findById(id);
    if (!item) {
      throw ApiError.notFound("Gallery item not found", "GALLERY_NOT_FOUND");
    }
    return item;
  }

  async createGalleryItem(
    data: CreateGalleryItemDto,
    file?: Express.Multer.File
  ) {
    let finalImageUrl = data.imageUrl;

    if (file) {
      finalImageUrl = await saveUploadedFile(file);
    }

    if (!finalImageUrl) {
      throw ApiError.badRequest(
        "Either an uploaded image file or a valid imageUrl must be provided",
        "IMAGE_REQUIRED"
      );
    }

    return galleryRepository.create({
      ...data,
      imageUrl: finalImageUrl,
    });
  }

  async updateGalleryItem(
    id: string,
    data: UpdateGalleryItemDto,
    file?: Express.Multer.File
  ) {
    await this.getGalleryById(id);

    let finalImageUrl = data.imageUrl;
    if (file) {
      finalImageUrl = await saveUploadedFile(file);
    }

    return galleryRepository.update(id, {
      ...data,
      ...(finalImageUrl !== undefined && { imageUrl: finalImageUrl }),
    });
  }

  async deleteGalleryItem(id: string) {
    await this.getGalleryById(id);
    return galleryRepository.delete(id);
  }
}

export const galleryService = new GalleryService();
