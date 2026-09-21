// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Centralized Public Routes Definition with Route Code-Splitting (Phase 7)
// =============================================================================

import React, { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import LoadingScreen from "../components/ui/LoadingScreen";

// Lazy-loaded public page modules
const HomePage = lazy(() => import("../pages/public/Home"));
const AboutPage = lazy(() => import("../pages/public/About"));
const CoursesPage = lazy(() => import("../pages/public/Courses"));
const CourseDetailPage = lazy(() => import("../pages/public/CourseDetail"));
const AdmissionsPage = lazy(() => import("../pages/public/Admissions"));
const PlacementsPage = lazy(() => import("../pages/public/Placements"));
const EventsPage = lazy(() => import("../pages/public/Events"));
const EventDetailPage = lazy(() => import("../pages/public/EventDetail"));
const GalleryPage = lazy(() => import("../pages/public/Gallery"));
const ContactPage = lazy(() => import("../pages/public/Contact"));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component />
  </Suspense>
);

export const publicRoutes: RouteObject = {
  path: "/",
  element: <PublicLayout />,
  children: [
    { index: true, element: withSuspense(HomePage) },
    { path: "about", element: withSuspense(AboutPage) },
    { path: "courses", element: withSuspense(CoursesPage) },
    { path: "courses/:slug", element: withSuspense(CourseDetailPage) },
    { path: "admissions", element: withSuspense(AdmissionsPage) },
    { path: "placements", element: withSuspense(PlacementsPage) },
    { path: "events", element: withSuspense(EventsPage) },
    { path: "events/:id", element: withSuspense(EventDetailPage) },
    { path: "gallery", element: withSuspense(GalleryPage) },
    { path: "contact", element: withSuspense(ContactPage) },
  ],
};

export default publicRoutes;
