// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Authentication Layout Component
// =============================================================================

import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "../components/ui/Toast";

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Auth Content */}
      <Outlet />

      {/* Global Toasts */}
      <ToastContainer />
    </div>
  );
};

export default AuthLayout;
