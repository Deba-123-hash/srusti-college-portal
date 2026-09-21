// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Centralized Application Router Configuration (Phases 6 & 7)
// =============================================================================

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import publicRoutes from "./publicRoutes";
import studentRoutes from "./studentRoutes";
import adminRoutes from "./adminRoutes";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import ChangePasswordPage from "../pages/auth/ChangePasswordPage";
import UnauthorizedPage from "../pages/Unauthorized";
import NotFoundPage from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

export const router = createBrowserRouter([
  // 1. Complete Public College Website Routes (Phase 7)
  publicRoutes,

  // 2. Authentication Flow Routes (Phase 4 / 6)
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOtpPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },

  // 3. User Password Change (Authenticated)
  {
    path: "/change-password",
    element: (
      <ProtectedRoute>
        <ChangePasswordPage />
      </ProtectedRoute>
    ),
  },

  // 4. Protected Student Routes (Phase 6 Shell / Phase 8 Module)
  studentRoutes,

  // 5. Protected Admin Routes (Phase 6 Shell / Phase 9 Module)
  adminRoutes,

  // 6. Protected Faculty Portal Shell
  {
    path: "/faculty/*",
    element: (
      <ProtectedRoute>
        <RoleProtectedRoute allowedRoles={["FACULTY"]}>
          <div className="min-h-screen bg-slate-950 text-white p-8">
            <h1 className="text-2xl font-bold">Faculty Portal Shell</h1>
            <p className="mt-2 text-slate-400 text-sm">
              Faculty authentication and RBAC guard verified. Module features mount in subsequent phases.
            </p>
          </div>
        </RoleProtectedRoute>
      </ProtectedRoute>
    ),
  },

  // 7. Standardized 403 Forbidden Access Page
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },

  // 8. Standardized 404 Catch-All Page
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
