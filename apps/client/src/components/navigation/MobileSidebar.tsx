// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Mobile Sidebar Drawer Component
// =============================================================================

import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, LogIn, ExternalLink, LogOut, KeyRound } from "lucide-react";
import { publicNavItems } from "../../config/navigation";
import { useAuthStore } from "../../store/authStore";
import { clsx } from "clsx";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  portalLink: string;
  onLogout: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  portalLink,
  onLogout,
}) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  // Scroll locking & escape listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Close when route changes
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm">
                S
              </div>
              <span className="font-extrabold text-white text-base">SRUSTI</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="mt-6 flex flex-col gap-1.5">
            {publicNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    "px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between",
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Auth Section */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          {isAuthenticated && user ? (
            <>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{user.name}</div>
                  <div className="text-[10px] text-slate-400">{user.role}</div>
                </div>
              </div>

              <Link
                to={portalLink}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase transition"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Go to Portal</span>
              </Link>

              <Link
                to="/change-password"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Change Password</span>
              </Link>

              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-rose-950/40 border border-rose-900/40 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wide uppercase shadow-lg shadow-blue-900/30 transition"
            >
              <LogIn className="w-4 h-4" />
              <span>Portal Login</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
