// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Portal Topbar Component (Header for Student / Admin Shells)
// =============================================================================

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../../hooks/useTheme";
import { authApi } from "../../lib/authApi";
import { Dropdown } from "../ui/Dropdown";
import { Badge } from "../ui/Badge";
import { Sun, Moon, LogOut, KeyRound, User } from "lucide-react";

interface TopbarProps {
  title?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ title }) => {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await authApi.logout();
    clearAuth();
    navigate("/login");
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div>
        {title && <h2 className="text-base font-bold text-white tracking-tight">{title}</h2>}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white transition"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {user && (
          <Dropdown
            align="right"
            trigger={
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition cursor-pointer">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white">{user.name}</div>
                  <Badge size="sm" variant="blue">
                    {user.role}
                  </Badge>
                </div>
              </div>
            }
            items={[
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
        )}
      </div>
    </header>
  );
};

export default Topbar;
