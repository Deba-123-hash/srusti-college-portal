// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Events Module Controller
// =============================================================================

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { eventsService } from "./events.service";

export class EventsController {
  getEvents = asyncHandler(async (req: Request, res: Response) => {
    const result = await eventsService.getEvents(req.query as any, req.user);

    res.status(200).json({
      success: true,
      data: result.items,
      message: "Events retrieved successfully",
      meta: result.meta,
    });
  });

  getEventById = asyncHandler(async (req: Request, res: Response) => {
    const event = await eventsService.getEventById(req.params.id, req.user);

    res.status(200).json({
      success: true,
      data: event,
      message: "Event details retrieved successfully",
    });
  });

  createEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await eventsService.createEvent(req.body);

    res.status(201).json({
      success: true,
      data: event,
      message: "Event created successfully",
    });
  });

  updateEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await eventsService.updateEvent(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: event,
      message: "Event updated successfully",
    });
  });

  deleteEvent = asyncHandler(async (req: Request, res: Response) => {
    await eventsService.deleteEvent(req.params.id);

    res.status(200).json({
      success: true,
      data: null,
      message: "Event deleted successfully",
    });
  });

  registerForEvent = asyncHandler(async (req: Request, res: Response) => {
    const registration = await eventsService.registerForEvent(
      req.params.eventId,
      req.user!.id
    );

    res.status(201).json({
      success: true,
      data: registration,
      message: "Successfully registered for the event",
    });
  });

  cancelRegistration = asyncHandler(async (req: Request, res: Response) => {
    await eventsService.cancelRegistration(req.params.eventId, req.user!.id);

    res.status(200).json({
      success: true,
      data: null,
      message: "Event registration cancelled successfully",
    });
  });

  getEventRegistrations = asyncHandler(async (req: Request, res: Response) => {
    const result = await eventsService.getEventRegistrations(
      req.params.eventId,
      req.query
    );

    res.status(200).json({
      success: true,
      data: result.items,
      message: "Event registrations retrieved successfully",
      meta: result.meta,
    });
  });

  getMyRegistrations = asyncHandler(async (req: Request, res: Response) => {
    const registrations = await eventsService.getMyRegistrations(req.user!.id);

    res.status(200).json({
      success: true,
      data: registrations,
      message: "Personal event registrations retrieved successfully",
    });
  });
}

export const eventsController = new EventsController();
