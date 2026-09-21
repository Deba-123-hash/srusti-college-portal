// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Admin Portal Layout Shell
// =============================================================================

import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/navigation/Sidebar";
import { Topbar } from "../components/navigation/Topbar";
import { ToastContainer } from "../components/ui/Toast";
import { adminNavItems } from "../config/navigation";

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Admin Sidebar */}
      <Sidebar items={adminNavItems} portalTitle="Admin Console" />

      {/* Content Stream */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Administrative Console" />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AdminLayout;
