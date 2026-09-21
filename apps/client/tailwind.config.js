/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        srusti: {
          gold: "#d99b26",
          goldLight: "#f4b942",
          goldDark: "#b87e14",
          navy: "#0b2b82",
          navyDark: "#071d5b",
          navyDeep: "#05133d",
          blue: "#1d4ed8",
          sky: "#0284c7",
          crimson: "#c21f1f",
          surface: "#f8fafc",
          surfaceLight: "#ffffff",
          border: "#e2e8f0",
          textDark: "#0f172a",
          textMuted: "#64748b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Outfit", "Inter", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "marquee": "marquee 35s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
}
