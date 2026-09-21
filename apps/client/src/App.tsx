// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Root Application Component & Auth Session Hydrator
// =============================================================================

import React, { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { useAuthStore } from "./store/authStore";
import { authApi } from "./lib/authApi";
import AppRouter from "./routes";

export const App: React.FC = () => {
  const { setAuth, clearAuth, setInitializing, setAccessToken } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    // Silent session initialization on startup
    const initializeSession = async () => {
      try {
        const refreshData = await authApi.refresh();
        if (refreshData?.accessToken) {
          setAccessToken(refreshData.accessToken);
          const user = await authApi.getCurrentUser(refreshData.accessToken);
          if (isMounted) {
            setAuth(user, refreshData.accessToken);
          }
        } else {
          if (isMounted) clearAuth();
        }
      } catch {
        // Unauthenticated visitor is normal; do not trigger error
        if (isMounted) clearAuth();
      } finally {
        if (isMounted) setInitializing(false);
      }
    };

    initializeSession();

    return () => {
      isMounted = false;
    };
  }, [setAuth, clearAuth, setInitializing, setAccessToken]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
};

export default App;
