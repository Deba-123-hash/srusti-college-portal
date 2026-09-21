// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// In-Memory Authentication State Store (Zustand)
// =============================================================================
// CRITICAL SECURITY REQUIREMENT:
// The RS256 JWT access token and user session data live EXCLUSIVELY in memory.
// NEVER persist access tokens or credentials to localStorage, sessionStorage,
// or cookies. Refresh token is strictly handled by httpOnly cookies.
// =============================================================================

import { create } from "zustand";
import { AuthUser } from "@srusti/shared";

export interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;

  setAuth: (user: AuthUser, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  setInitializing: (isInitializing: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitializing: true,

  setAuth: (user: AuthUser, accessToken: string) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isInitializing: false,
    }),

  setAccessToken: (accessToken: string) =>
    set((state) => ({
      accessToken,
      isAuthenticated: !!state.user,
    })),

  clearAuth: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isInitializing: false,
    }),

  setInitializing: (isInitializing: boolean) => set({ isInitializing }),
}));

export default useAuthStore;
