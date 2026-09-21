// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Administrative Console Protected Routes (Phase 9 Complete Admin Suite)
// =============================================================================

import React, { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import Skeleton from "../components/ui/Skeleton";

// Lazy-loaded administrative modules
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminCourses = lazy(() => import("../pages/admin/AdminCourses"));
const AdminStudents = lazy(() => import("../pages/admin/AdminStudents"));
const AdminFaculty = lazy(() => import("../pages/admin/AdminFaculty"));
const AdminAttendance = lazy(() => import("../pages/admin/AdminAttendance"));
const AdminResults = lazy(() => import("../pages/admin/AdminResults"));
const AdminEvents = lazy(() => import("../pages/admin/AdminEvents"));
const AdminPlacements = lazy(() => import("../pages/admin/AdminPlacements"));
const AdminAnnouncements = lazy(() => import("../pages/admin/AdminAnnouncements"));
const AdminGallery = lazy(() => import("../pages/admin/AdminGallery"));
const AdminInquiries = lazy(() => import("../pages/admin/AdminInquiries"));

const PageSkeleton: React.FC = () => (
  <div className="space-y-6 max-w-7xl animate-pulse">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-64 rounded-xl" />
      <Skeleton className="h-8 w-32 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
    </div>
    <Skeleton className="h-72 w-full rounded-2xl" />
  </div>
);

export const adminRoutes: RouteObject = {
  path: "/admin",
  element: (
    <ProtectedRoute>
      <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "DEPT_ADMIN"]}>
        <AdminLayout />
      </RoleProtectedRoute>
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<PageSkeleton />}>
          <AdminDashboard />
        </Suspense>
      ),
    },
    {
      path: "dashboard",
      element: (
        <Suspense fallback={<PageSkeleton />}>
          <AdminDashboard />
        </Suspense>
      ),
    },
    {
      path: "courses",
      element: (
        <Suspense fallback={<PageSkeleton />}>
          <AdminCourses />
        </Suspense>
      ),
    },
    {
      path: "students",
      element: (
        <Suspense fallback={<PageSkeleton />}>
          <AdminStudents />
        </Suspense>
      ),
    },
    {
      path: "faculty",
      element: (
        <Suspense fallback={<PageSkeleton />}>
          <AdminFaculty />
        </Suspense>
      ),
    },
    {
      path: "attendance",
      element: (
        <Suspense fallback={<PageSkeleton />}>
          <AdminAttendance />
        </Suspense>
      ),
    },
    {
      path: "results",
      element: (
        <Suspense fallback={<PageSkeleton />}>
          <AdminResults />
        </Suspense>
      ),
    },
    {
      path: "events",
      element: (
        <Suspense fallback={<PageSkeleton />}>
          <AdminEvents />
        </Suspense>
      ),
    },
    {
      path: "placements",
      element: (
        <Suspense fallback={<PageSkeleton />}>
          <AdminPlacements />
        </Suspense>
      ),
    },
    {
      path: "announcements",
      element: (
        <Suspense fallback={<PageSkeleton />}>
          <AdminAnnouncements />
        </Suspense>
      ),
    },
    {
      path: "gallery",
      element: (
        <Suspense fallback={<PageSkeleton />}>
          <AdminGallery />
        </Suspense>
      ),
    },
    {
      path: "inquiries",
      element: (
        <Suspense fallback={<PageSkeleton />}>
          <AdminInquiries />
        </Suspense>
      ),
    },
  ],
};

export default adminRoutes;
