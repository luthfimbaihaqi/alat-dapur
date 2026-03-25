import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── FONT FAMILIES ──────────────────────────────
      fontFamily: {
        serif: ["DM Serif Display", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },

      // ── COLOR PALETTE ──────────────────────────────
      colors: {
        cream: "#FAF7F2",
        warm: {
          50:  "#F5EFE4",
          100: "#E8D9C0",
          200: "#D4BC96",
          300: "#C4976A",
          400: "#B27A4E",
          500: "#9E6B3F",
          600: "#8B5A2B",
          700: "#6B3F1A",
          800: "#4F2D0E",
          900: "#3A1F08",
        },
        stone: {
          100: "#F0EDE8",
          200: "#E2DDD6",
          300: "#CFC9C0",
          400: "#9E9890",
          500: "#7E7870",
          600: "#6B6560",
          700: "#4E4A46",
          800: "#2C2825",
          900: "#1A1714",
        },
      },

      // ── BORDER RADIUS ──────────────────────────────
      borderRadius: {
        "4xl": "2rem",
      },

      // ── TYPOGRAPHY SIZES ───────────────────────────
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },

      // ── BOX SHADOW ─────────────────────────────────
      boxShadow: {
        "warm-sm": "0 2px 8px rgba(58, 31, 8, 0.06)",
        "warm-md": "0 4px 16px rgba(58, 31, 8, 0.10)",
        "warm-lg": "0 8px 32px rgba(58, 31, 8, 0.14)",
        "warm-xl": "0 16px 48px rgba(58, 31, 8, 0.18)",
      },

      // ── BACKGROUND IMAGE ───────────────────────────
      backgroundImage: {
        "warm-gradient":
          "linear-gradient(135deg, #FAF7F2 0%, #F5EFE4 100%)",
        "hero-gradient":
          "linear-gradient(135deg, #3A1F08 0%, #6B3F1A 100%)",
      },

      // ── SCREENS (mobile-first) ─────────────────────
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
  },
  plugins: [],
};

export default config;