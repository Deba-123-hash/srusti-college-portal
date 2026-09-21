// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Role-Based Route Guard Component (RBAC)
// =============================================================================

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "@srusti/shared";
import { useAuthStore } from "../store/authStore";

export interface RoleProtectedRouteProps {
  allowedRoles?: UserRole[];
  roles?: UserRole[];
  children?: React.ReactNode;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  allowedRoles,
  roles,
  children,
}) => {
  const { user, isInitializing } = useAuthStore();
  const effectiveRoles = roles || allowedRoles || [];

  if (isInitializing) {
    return null;
  }

  if (!user || (effectiveRoles.length > 0 && !effectiveRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RoleProtectedRoute;
