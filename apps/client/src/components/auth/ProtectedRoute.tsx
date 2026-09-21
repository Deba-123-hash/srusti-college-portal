// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Authenticated Route Guard Component
// =============================================================================

import React, { useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { api } from "../../lib/api";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, user, setAuth, clearAuth } = useAuthStore();
  const [checkingAuth, setCheckingAuth] = useState(!isAuthenticated);

  useEffect(() => {
    let isMounted = true;

    // If already in-memory authenticated, no silent check needed
    if (isAuthenticated) {
      setCheckingAuth(false);
      return;
    }

    // Attempt initial silent session hydration on initial page load / reload
    async function checkSession() {
      try {
        const refreshRes = await api.post("/auth/refresh");
        const token = refreshRes.data?.data?.accessToken;
        if (token) {
          const meRes = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (isMounted) {
            setAuth(meRes.data.data, token);
          }
        }
      } catch {
        if (isMounted) {
          clearAuth();
        }
      } finally {
        if (isMounted) {
          setCheckingAuth(false);
        }
      }
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, setAuth, clearAuth]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-400 font-medium">Verifying authentication session...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={`/login?from=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
