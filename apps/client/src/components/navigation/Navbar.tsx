// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Global Public Navbar Component
// =============================================================================

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, LogIn, User, LogOut, KeyRound, ExternalLink } from "lucide-react";
import { publicNavItems } from "../../config/navigation";
import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../../hooks/useTheme";
import { authApi } from "../../lib/authApi";
import { Dropdown } from "../ui/Dropdown";
import { Badge } from "../ui/Badge";
import { MobileSidebar } from "./MobileSidebar";
import { clsx } from "clsx";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Monitor scroll for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    clearAuth();
    navigate("/");
  };

  const getPortalLink = () => {
    if (!user) return "/login";
    if (user.role === "SUPER_ADMIN" || user.role === "DEPT_ADMIN") {
      return "/admin/dashboard";
    }
    if (user.role === "FACULTY") {
      return "/faculty/dashboard";
    }
    return "/student/dashboard";
  };

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled
            ? "bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-2xl py-3"
            : "bg-transparent py-4 sm:py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & College Branding */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 border border-blue-400/30 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-900/30 group-hover:scale-105 transition-transform duration-200">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
                SRUSTI
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:block tracking-wider uppercase font-semibold">
                Academy of Mgmt &amp; Tech
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 backdrop-blur-md p-1.5 rounded-full border border-slate-800 shadow-inner">
            {publicNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    "px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200",
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Theme Toggle + Auth */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated && user ? (
              <Dropdown
                align="right"
                trigger={
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
                    <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/30">
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-left hidden xl:block">
                      <div className="text-xs font-bold text-white leading-none">
                        {user.name}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {user.role}
                      </span>
                    </div>
                  </div>
                }
                items={[
                  {
                    label: "Go to Portal",
                    icon: <ExternalLink className="w-4 h-4 text-blue-400" />,
                    onClick: () => navigate(getPortalLink()),
                  },
                  {
                    label: "Change Password",
                    icon: <KeyRound className="w-4 h-4 text-slate-400" />,
                    onClick: () => navigate("/change-password"),
                  },
                  {
                    label: "Sign Out",
                    icon: <LogOut className="w-4 h-4" />,
                    danger: true,
                    onClick: handleLogout,
                  },
                ]}
              />
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wide uppercase shadow-lg shadow-blue-900/30 border border-blue-500/30 transition duration-200 active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Portal Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        portalLink={getPortalLink()}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Navbar;
