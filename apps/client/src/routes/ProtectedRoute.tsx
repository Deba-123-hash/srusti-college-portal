// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Authenticated Route Guard Component
// =============================================================================

import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Spinner } from "../components/ui/Spinner";

export interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isInitializing, user } = useAuthStore();

  // During auth initialization, show sleek loading screen
  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100">
        <Spinner size="lg" />
        <p className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Verifying Session...
        </p>
      </div>
    );
  }

  // If not authenticated, redirect to /login preserving intended path
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={`/login?from=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
