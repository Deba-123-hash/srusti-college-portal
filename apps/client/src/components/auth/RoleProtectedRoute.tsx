// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Role-Based Route Guard Component (RBAC)
// =============================================================================

import React from "react";
import { Link, Outlet } from "react-router-dom";
import { UserRole } from "@srusti/shared";
import { useAuthStore } from "../../store/authStore";
import { ShieldAlert, ArrowLeft } from "lucide-react";

interface RoleProtectedRouteProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 shadow-xl shadow-rose-950/40">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">403 — Unauthorized Access</h1>
        <p className="mt-3 text-slate-400 max-w-md text-sm leading-relaxed">
          Your account role (<span className="text-rose-400 font-semibold">{user?.role || "GUEST"}</span>) does not possess the permissions required to view this area.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" /> Return Home
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-lg shadow-blue-900/30"
          >
            Switch Account
          </Link>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RoleProtectedRoute;
