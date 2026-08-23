import type { Config } from "tailwindcss";

const withOpacity = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Theme-aware tokens (flip automatically between light/dark via CSS vars)
        ink: withOpacity("--color-ink"),
        paper: withOpacity("--color-paper"),
        limestone: withOpacity("--color-limestone"),
        surface: withOpacity("--color-surface"),
        "surface-hover": withOpacity("--color-surface-hover"),
        border: withOpacity("--color-border"),
        // Static brand accents (deliberately consistent across themes)
        clay: "#9C5A34",
        "clay-dark": "#7A4527",
        moss: "#4B5842",
        stone: {
          100: "#F1EEE5",
          300: "#D8D2C2",
          500: "#A8A093",
          700: "#6F695D",
          900: "#3A362F",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        widest2: "0.2em",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
