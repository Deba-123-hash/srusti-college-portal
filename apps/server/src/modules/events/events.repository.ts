// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Events Module Repository (Prisma Data Access)
// =============================================================================

import { prisma } from "../../lib/prisma";
import { CreateEventDto, UpdateEventDto } from "./events.types";
import { Prisma } from "@prisma/client";

export class EventsRepository {
  async findMany(params: {
    where: Prisma.EventWhereInput;
    skip: number;
    take: number;
  }) {
    return prisma.event.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      include: {
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { eventDate: "asc" },
    });
  }

  async count(where: Prisma.EventWhereInput) {
    return prisma.event.count({ where });
  }

  async findById(id: string) {
    return prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });
  }

  async create(data: CreateEventDto) {
    return prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        eventDate: data.eventDate,
        time: data.time,
        venue: data.venue,
        capacity: data.capacity,
        bannerUrl: data.bannerUrl || null,
        isRegistrationOpen: data.isRegistrationOpen ?? true,
        isPublished: data.isPublished ?? true,
      },
    });
  }

  async update(id: string, data: UpdateEventDto) {
    return prisma.event.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.eventDate !== undefined && { eventDate: data.eventDate }),
        ...(data.time !== undefined && { time: data.time }),
        ...(data.venue !== undefined && { venue: data.venue }),
        ...(data.capacity !== undefined && { capacity: data.capacity }),
        ...(data.bannerUrl !== undefined && { bannerUrl: data.bannerUrl }),
        ...(data.isRegistrationOpen !== undefined && {
          isRegistrationOpen: data.isRegistrationOpen,
        }),
        ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
      },
    });
  }

  async delete(id: string) {
    return prisma.event.delete({
      where: { id },
    });
  }

  // --- Registration Operations ---

  async findRegistration(eventId: string, studentId: string) {
    return prisma.eventRegistration.findUnique({
      where: {
        eventId_studentId: {
          eventId,
          studentId,
        },
      },
    });
  }

  async createRegistration(eventId: string, studentId: string) {
    return prisma.eventRegistration.create({
      data: {
        eventId,
        studentId,
      },
      include: {
        event: true,
      },
    });
  }

  async deleteRegistration(eventId: string, studentId: string) {
    return prisma.eventRegistration.delete({
      where: {
        eventId_studentId: {
          eventId,
          studentId,
        },
      },
    });
  }

  async findRegistrationsByEventId(eventId: string, skip: number, take: number) {
    return prisma.eventRegistration.findMany({
      where: { eventId },
      skip,
      take,
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            course: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        },
      },
      orderBy: { registeredAt: "asc" },
    });
  }

  async countRegistrationsByEventId(eventId: string) {
    return prisma.eventRegistration.count({
      where: { eventId },
    });
  }

  async findRegistrationsByStudentId(studentId: string) {
    return prisma.eventRegistration.findMany({
      where: { studentId },
      include: {
        event: true,
      },
      orderBy: { registeredAt: "desc" },
    });
  }

  async findStudentByUserId(userId: string) {
    return prisma.student.findUnique({
      where: { userId },
    });
  }
}

export const eventsRepository = new EventsRepository();
