// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Events Module Routes
// =============================================================================

import { Router, Request, Response, NextFunction } from "express";
import { eventsController } from "./events.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/validate";
import {
  createEventSchema,
  updateEventSchema,
  eventParamsSchema,
  eventRegistrationParamsSchema,
  eventQuerySchema,
} from "./events.schema";
import { verifyAccessToken } from "../../lib/jwt";

/**
 * Optional authentication middleware for public endpoints where role provides enriched data
 */
function optionalAuthenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const payload = verifyAccessToken(token);
      req.user = {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
        departmentId: payload.departmentId,
      };
    } catch {
      // Ignore token verification errors for optional endpoints
    }
  }
  next();
}

const eventsRoutes = Router();

eventsRoutes.get(
  "/",
  optionalAuthenticate,
  validateQuery(eventQuerySchema),
  eventsController.getEvents
);

eventsRoutes.get(
  "/my-registrations",
  authenticate,
  authorize("STUDENT"),
  eventsController.getMyRegistrations
);

eventsRoutes.get(
  "/:id",
  optionalAuthenticate,
  validateParams(eventParamsSchema),
  eventsController.getEventById
);

eventsRoutes.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateBody(createEventSchema),
  eventsController.createEvent
);

eventsRoutes.patch(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateParams(eventParamsSchema),
  validateBody(updateEventSchema),
  eventsController.updateEvent
);

eventsRoutes.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN"),
  validateParams(eventParamsSchema),
  eventsController.deleteEvent
);

// Event Registrations
eventsRoutes.post(
  "/:eventId/register",
  authenticate,
  authorize("STUDENT"),
  validateParams(eventRegistrationParamsSchema),
  eventsController.registerForEvent
);

eventsRoutes.delete(
  "/:eventId/register",
  authenticate,
  authorize("STUDENT"),
  validateParams(eventRegistrationParamsSchema),
  eventsController.cancelRegistration
);

eventsRoutes.get(
  "/:eventId/registrations",
  authenticate,
  authorize("SUPER_ADMIN", "DEPT_ADMIN", "FACULTY"),
  validateParams(eventRegistrationParamsSchema),
  eventsController.getEventRegistrations
);

export { eventsRoutes };
