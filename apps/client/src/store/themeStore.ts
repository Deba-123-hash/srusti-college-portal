// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Dark Mode Theme Store (Zustand)
// =============================================================================
// Note: Only the user's aesthetic theme preference is persisted to localStorage.
// Security tokens are strictly prohibited here.
// =============================================================================

import { create } from "zustand";

export type ThemeMode = "dark" | "light" | "system";

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = "srusti_theme_preference";

const getSystemTheme = (): "dark" | "light" => {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark"; // Default to dark for premium academic experience
};

const applyThemeToDOM = (resolved: "dark" | "light") => {
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    if (resolved === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  }
};

const getInitialTheme = (): ThemeMode => {
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (saved === "dark" || saved === "light" || saved === "system") {
      return saved;
    }
  }
  return "dark"; // Default theme
};

const initialTheme = getInitialTheme();
const initialResolved = initialTheme === "system" ? getSystemTheme() : initialTheme;
applyThemeToDOM(initialResolved);

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,
  resolvedTheme: initialResolved,

  setTheme: (theme: ThemeMode) => {
    const resolved = theme === "system" ? getSystemTheme() : theme;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
    applyThemeToDOM(resolved);
    set({ theme, resolvedTheme: resolved });
  },

  toggleTheme: () => {
    const current = get().resolvedTheme;
    const next = current === "dark" ? "light" : "dark";
    get().setTheme(next);
  },
}));

export default useThemeStore;
