// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Root API v1 Router
// =============================================================================

import { Router } from "express";
import { healthRoutes } from "./health.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { departmentsRoutes } from "../modules/departments/departments.routes";
import { coursesRoutes } from "../modules/courses/courses.routes";
import { subjectsRoutes } from "../modules/subjects/subjects.routes";
import { studentsRoutes } from "../modules/students/students.routes";
import { facultyRoutes } from "../modules/faculty/faculty.routes";
import { attendanceRoutes } from "../modules/attendance/attendance.routes";
import { resultsRoutes } from "../modules/results/results.routes";
import { eventsRoutes } from "../modules/events/events.routes";
import { companiesRoutes } from "../modules/companies/companies.routes";
import { placementsRoutes } from "../modules/placements/placements.routes";
import { announcementsRoutes } from "../modules/announcements/announcements.routes";
import { galleryRoutes } from "../modules/gallery/gallery.routes";
import { inquiriesRoutes } from "../modules/inquiries/inquiries.routes";
import { notificationsRoutes } from "../modules/notifications/notifications.routes";
import { dashboardRoutes } from "../modules/dashboard/dashboard.routes";
import { exportRoutes } from "../modules/export/export.routes";

const apiV1Router = Router();

// Health check endpoints: /api/v1/health & /api/v1/health/ready
apiV1Router.use("/health", healthRoutes);

// Phase 4: Authentication & Session Management
apiV1Router.use("/auth", authRoutes);

// Phase 5: Business API Layer
apiV1Router.use("/departments", departmentsRoutes);
apiV1Router.use("/courses", coursesRoutes);
apiV1Router.use("/subjects", subjectsRoutes);
apiV1Router.use("/students", studentsRoutes);
apiV1Router.use("/faculty", facultyRoutes);
apiV1Router.use("/attendance", attendanceRoutes);
apiV1Router.use("/results", resultsRoutes);
apiV1Router.use("/events", eventsRoutes);
apiV1Router.use("/companies", companiesRoutes);
apiV1Router.use("/placements", placementsRoutes);
apiV1Router.use("/announcements", announcementsRoutes);
apiV1Router.use("/gallery", galleryRoutes);
apiV1Router.use("/inquiries", inquiriesRoutes);
apiV1Router.use("/notifications", notificationsRoutes);
apiV1Router.use("/dashboard", dashboardRoutes);
apiV1Router.use("/admin/export", exportRoutes);

export { apiV1Router };
