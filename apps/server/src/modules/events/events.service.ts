// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Events Module Service (Business Logic & Event Registrations)
// =============================================================================

import { eventsRepository } from "./events.repository";
import { CreateEventDto, UpdateEventDto, EventFilterParams } from "./events.types";
import { parsePagination, buildPaginationMeta } from "../../utils/pagination";
import { ApiError } from "../../utils/ApiError";
import { Prisma } from "@prisma/client";
import { AuthenticatedUserPayload } from "../../middleware/authenticate";

export class EventsService {
  async getEvents(query: EventFilterParams, user?: AuthenticatedUserPayload) {
    const { page, limit, skip, take } = parsePagination(query);

    const where: Prisma.EventWhereInput = {};

    // Public / non-admin users only see published events
    const isAdmin = user && (user.role === "SUPER_ADMIN" || user.role === "DEPT_ADMIN");
    if (!isAdmin) {
      where.isPublished = true;
    } else if (query.isPublished !== undefined) {
      where.isPublished = query.isPublished;
    }

    if (query.category) {
      where.category = query.category;
    }
    if (query.date) {
      where.eventDate = query.date;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
        { venue: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      eventsRepository.findMany({ where, skip, take }),
      eventsRepository.count(where),
    ]);

    return {
      items,
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async getEventById(id: string, user?: AuthenticatedUserPayload) {
    const event = await eventsRepository.findById(id);
    if (!event) {
      throw ApiError.notFound("Event not found", "EVENT_NOT_FOUND");
    }

    const isAdmin = user && (user.role === "SUPER_ADMIN" || user.role === "DEPT_ADMIN");
    if (!event.isPublished && !isAdmin) {
      throw ApiError.notFound("Event not found", "EVENT_NOT_FOUND");
    }

    return event;
  }

  async createEvent(data: CreateEventDto) {
    return eventsRepository.create(data);
  }

  async updateEvent(id: string, data: UpdateEventDto) {
    await this.getEventById(id);
    return eventsRepository.update(id, data);
  }

  async deleteEvent(id: string) {
    await this.getEventById(id);
    return eventsRepository.delete(id);
  }

  // --- Registration Logic ---

  async registerForEvent(eventId: string, userId: string) {
    const student = await eventsRepository.findStudentByUserId(userId);
    if (!student) {
      throw ApiError.badRequest(
        "Only enrolled students can register for events",
        "STUDENT_PROFILE_REQUIRED"
      );
    }

    const event = await eventsRepository.findById(eventId);
    if (!event || !event.isPublished) {
      throw ApiError.notFound("Event not found or not published", "EVENT_NOT_FOUND");
    }

    if (!event.isRegistrationOpen) {
      throw ApiError.badRequest(
        "Registrations for this event are currently closed",
        "REGISTRATION_CLOSED"
      );
    }

    // Check capacity
    const currentCount = await eventsRepository.countRegistrationsByEventId(eventId);
    if (currentCount >= event.capacity) {
      throw ApiError.badRequest(
        "Event registration capacity has been reached",
        "CAPACITY_EXCEEDED"
      );
    }

    // Check duplicate
    const existing = await eventsRepository.findRegistration(eventId, student.id);
    if (existing) {
      throw ApiError.conflict(
        "You have already registered for this event",
        "DUPLICATE_REGISTRATION"
      );
    }

    return eventsRepository.createRegistration(eventId, student.id);
  }

  async cancelRegistration(eventId: string, userId: string) {
    const student = await eventsRepository.findStudentByUserId(userId);
    if (!student) {
      throw ApiError.badRequest("Student profile not found");
    }

    const registration = await eventsRepository.findRegistration(eventId, student.id);
    if (!registration) {
      throw ApiError.notFound("Registration not found", "REGISTRATION_NOT_FOUND");
    }

    return eventsRepository.deleteRegistration(eventId, student.id);
  }

  async getEventRegistrations(eventId: string, query: { page?: any; limit?: any }) {
    await this.getEventById(eventId);
    const { page, limit, skip, take } = parsePagination(query);

    const [items, total] = await Promise.all([
      eventsRepository.findRegistrationsByEventId(eventId, skip, take),
      eventsRepository.countRegistrationsByEventId(eventId),
    ]);

    return {
      items,
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async getMyRegistrations(userId: string) {
    const student = await eventsRepository.findStudentByUserId(userId);
    if (!student) {
      return [];
    }
    return eventsRepository.findRegistrationsByStudentId(student.id);
  }
}

export const eventsService = new EventsService();
