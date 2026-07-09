/** @type {import('tailwindcss').Config} */
// Iron & Chalk — the locked backloggr palette, mirrored from the app repo's tailwind.config.js.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#151414",
        surface: "#1D1B1A",
        "surface-alt": "#242120",
        border: "#2E2A28",
        "border-strong": "#403A37",
        "text-hi": "#EDE8E0",
        "text-lo": "#9A928A",
        accent: "#B96A55",
        "accent-hover": "#C97B65",
        success: "#6E9987",
        warning: "#C2A15A",
        danger: "#B95F5F",
      },
      fontFamily: {
        display: ["Archivo", "sans-serif"],
        sans: ["Archivo", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.9s ease both",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        float: "float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
