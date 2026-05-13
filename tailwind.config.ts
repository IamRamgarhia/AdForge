import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#08080a",
          950: "#0a0a0d",
          900: "#101013",
          800: "#16161b",
          700: "#1c1c22",
          600: "#222229",
          500: "#2a2a32",
        },
        ink: {
          DEFAULT: "#e7e7ea",
          muted: "#9a9aa3",
          subtle: "#6b6b74",
          faint: "#3f3f47",
        },
        live: {
          DEFAULT: "#ffb020",
          dim: "#a87016",
        },
        pos: {
          DEFAULT: "#5fdb9b",
        },
        neg: {
          DEFAULT: "#ff5470",
        },
        info: {
          DEFAULT: "#7aa2ff",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        "ui-tight": "-0.005em",
        "ui-wide": "0.02em",
        "ui-mega": "0.08em",
      },
      animation: {
        "fade-up": "fade-up 320ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "caret-blink": "caret-blink 1s steps(1) infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "caret-blink": {
          "0%, 50%": { opacity: "1" },
          "50.01%, 100%": { opacity: "0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
