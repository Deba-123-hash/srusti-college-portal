// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Announcements Module Service (Business Logic, Sanitization & Redis Cache)
// =============================================================================

import { announcementsRepository } from "./announcements.repository";
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
  AnnouncementFilterParams,
} from "./announcements.types";
import { parsePagination, buildPaginationMeta } from "../../utils/pagination";
import { ApiError } from "../../utils/ApiError";
import { sanitizeHtml } from "../../utils/sanitizer";
import { redis } from "../../lib/redis";
import { Prisma } from "@prisma/client";

const ANNOUNCEMENTS_CACHE_KEY = "cache:announcements:active";
const CACHE_TTL_SECONDS = 300; // 5 minutes

export class AnnouncementsService {
  async invalidateCache() {
    try {
      await redis.del(ANNOUNCEMENTS_CACHE_KEY);
    } catch {
      // Non-fatal
    }
  }

  async getAnnouncements(query: AnnouncementFilterParams) {
    const isDefaultQuery =
      !query.search &&
      !query.category &&
      !query.pinnedOnly &&
      !query.includeExpired &&
      (!query.page || query.page === 1) &&
      (!query.limit || query.limit === 20);

    if (isDefaultQuery) {
      try {
        const cached = await redis.get(ANNOUNCEMENTS_CACHE_KEY);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch {
        // Fallback to database
      }
    }

    const { page, limit, skip, take } = parsePagination(query);

    const where: Prisma.AnnouncementWhereInput = {};

    // Expired announcements should not appear in active public results
    if (!query.includeExpired) {
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ];
    }

    if (query.pinnedOnly) {
      where.isPinned = true;
    }
    if (query.category) {
      where.category = query.category;
    }
    if (query.search) {
      const searchCondition = [
        { title: { contains: query.search, mode: "insensitive" as const } },
        { content: { contains: query.search, mode: "insensitive" as const } },
      ];
      if (where.OR) {
        where.AND = [{ OR: searchCondition }];
      } else {
        where.OR = searchCondition;
      }
    }

    const [items, total] = await Promise.all([
      announcementsRepository.findMany({ where, skip, take }),
      announcementsRepository.count(where),
    ]);

    const result = {
      items,
      meta: buildPaginationMeta(page, limit, total),
    };

    if (isDefaultQuery) {
      try {
        await redis.set(
          ANNOUNCEMENTS_CACHE_KEY,
          JSON.stringify(result),
          "EX",
          CACHE_TTL_SECONDS
        );
      } catch {
        // Non-fatal
      }
    }

    return result;
  }

  async getAnnouncementById(id: string) {
    const announcement = await announcementsRepository.findById(id);
    if (!announcement) {
      throw ApiError.notFound("Announcement not found", "ANNOUNCEMENT_NOT_FOUND");
    }
    return announcement;
  }

  async createAnnouncement(data: CreateAnnouncementDto) {
    // Sanitize rich-text content to eliminate XSS risks
    const sanitizedContent = sanitizeHtml(data.content);

    const announcement = await announcementsRepository.create({
      ...data,
      content: sanitizedContent,
    });

    await this.invalidateCache();
    return announcement;
  }

  async updateAnnouncement(id: string, data: UpdateAnnouncementDto) {
    await this.getAnnouncementById(id);

    const sanitizedData = {
      ...data,
      ...(data.content !== undefined && { content: sanitizeHtml(data.content) }),
    };

    const updated = await announcementsRepository.update(id, sanitizedData);
    await this.invalidateCache();
    return updated;
  }

  async deleteAnnouncement(id: string) {
    await this.getAnnouncementById(id);
    await announcementsRepository.delete(id);
    await this.invalidateCache();
  }
}

export const announcementsService = new AnnouncementsService();
