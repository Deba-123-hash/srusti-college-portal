// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Student Portal Protected Routes (Phase 8 Production Implementation)
// =============================================================================

import React, { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import LoadingScreen from "../components/ui/LoadingScreen";

// Code-split lazy loaded student portal pages
const StudentDashboard = lazy(() => import("../pages/student/StudentDashboard"));
const StudentAttendance = lazy(() => import("../pages/student/StudentAttendance"));
const StudentResults = lazy(() => import("../pages/student/StudentResults"));
const StudentPlacements = lazy(() => import("../pages/student/StudentPlacements"));
const StudentEvents = lazy(() => import("../pages/student/StudentEvents"));
const StudentNotifications = lazy(() => import("../pages/student/StudentNotifications"));

export const studentRoutes: RouteObject = {
  path: "/student",
  element: (
    <ProtectedRoute>
      <RoleProtectedRoute allowedRoles={["STUDENT"]}>
        <StudentLayout />
      </RoleProtectedRoute>
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <StudentDashboard />
        </Suspense>
      ),
    },
    {
      path: "dashboard",
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <StudentDashboard />
        </Suspense>
      ),
    },
    {
      path: "attendance",
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <StudentAttendance />
        </Suspense>
      ),
    },
    {
      path: "results",
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <StudentResults />
        </Suspense>
      ),
    },
    {
      path: "placements",
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <StudentPlacements />
        </Suspense>
      ),
    },
    {
      path: "events",
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <StudentEvents />
        </Suspense>
      ),
    },
    {
      path: "notifications",
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <StudentNotifications />
        </Suspense>
      ),
    },
  ],
};

export default studentRoutes;
