// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// 403 Unauthorized Access Page
// =============================================================================

import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { ShieldAlert, ArrowLeft, Home, LogIn } from "lucide-react";
import Button from "../components/ui/Button";

export const UnauthorizedPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center selection:bg-rose-600 selection:text-white">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 shadow-2xl shadow-rose-950/40 animate-pulse">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-2">
        Error 403 &bull; Access Denied
      </span>

      <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
        Unauthorized Area
      </h1>

      <p className="mt-3 text-slate-400 max-w-md text-sm leading-relaxed">
        Your current account role (
        <span className="text-rose-400 font-semibold">{user?.role || "GUEST"}</span>
        ) does not have the necessary permissions to view or interact with this portal module.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/">
          <Button variant="secondary" size="sm" leftIcon={<Home className="w-4 h-4" />}>
            Return Home
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="primary" size="sm" leftIcon={<LogIn className="w-4 h-4" />}>
            Switch Account
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
