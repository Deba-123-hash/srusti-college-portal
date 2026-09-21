// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Public Website Layout
// =============================================================================

import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/navigation/Navbar";
import { Footer } from "../components/navigation/Footer";
import { ToastContainer } from "../components/ui/Toast";

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 pt-16 sm:pt-20">
        <Outlet />
      </main>

      {/* Institutional Footer */}
      <Footer />

      {/* Toast Notification Layer */}
      <ToastContainer />
    </div>
  );
};

export default PublicLayout;
