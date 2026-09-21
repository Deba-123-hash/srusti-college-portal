// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// useTheme Hook
// =============================================================================

import { useThemeStore } from "../store/themeStore";

export const useTheme = () => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useThemeStore();
  return {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === "dark",
    setTheme,
    toggleTheme,
  };
};

export default useTheme;
