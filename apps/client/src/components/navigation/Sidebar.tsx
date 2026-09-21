// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Portal Sidebar Component (Admin / Student Shells)
// =============================================================================

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NavItem } from "../../config/navigation";
import { useAuthStore } from "../../store/authStore";
import {
  LayoutDashboard,
  CalendarCheck,
  GraduationCap,
  Briefcase,
  Calendar,
  Bell,
  BookOpen,
  Users,
  UserCheck,
  Megaphone,
  Image,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { clsx } from "clsx";

interface SidebarProps {
  items: NavItem[];
  portalTitle: string;
}

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  CalendarCheck: <CalendarCheck className="w-4 h-4" />,
  GraduationCap: <GraduationCap className="w-4 h-4" />,
  Briefcase: <Briefcase className="w-4 h-4" />,
  Calendar: <Calendar className="w-4 h-4" />,
  Bell: <Bell className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  UserCheck: <UserCheck className="w-4 h-4" />,
  Megaphone: <Megaphone className="w-4 h-4" />,
  Image: <Image className="w-4 h-4" />,
  Mail: <Mail className="w-4 h-4" />,
};

export const Sidebar: React.FC<SidebarProps> = ({ items, portalTitle }) => {
  const location = useLocation();
  const { user } = useAuthStore();

  const userRole = user?.role;
  const filteredItems = items.filter(
    (item) => !item.allowedRoles || (userRole && item.allowedRoles.includes(userRole))
  );

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-blue-900/30">
              S
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">SRUSTI</div>
              <div className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
                {portalTitle}
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            const icon = item.icon && iconMap[item.icon];

            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150",
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                )}
              >
                {icon && <span className="shrink-0">{icon}</span>}
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Return Home Link */}
      <div className="p-4 border-t border-slate-800">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Website</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
