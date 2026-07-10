import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Backgrounds ──────────────────────────────
        "app":         "#FAF8F4",   // off-white paper
        "paper":       "#FAF8F4",   // alias
        "surface":     "#FFFFFF",   // cards
        "surface-2":   "#FAFAF9",   // secondary flat white
        "canvas":      "#FAF8F4",   // alias for app bg (keeps old class working)

        // ── Brand: Near-black ─────────────────────────────
        "brand":       "#16140F",   // primary buttons, key text
        "brand-dark":  "#000000",   // hover
        "brand-soft":  "#EFEAE0",   // warm sand
        "brand-glow":  "#302C21",   // lighter

        // ── Accent: Soft Clay ────────────────────────────
        "accent":      "#B4632A",
        "accent-soft": "#F0E4D6",
        "accent-warm": "#D97757",

        // ── Text ──────────────────────────────────────
        "ink":         "#16140F",   // near-black body
        "ink-muted":   "#6B6256",   // warm gray captions
        "ink-subtle":  "#A8A29E",   // stone-400

        // ── Borders ───────────────────────────────────
        "line":        "#E7E1D6",   // sand
        "line-bright": "#D6D3D1",   // stone-300

        // ── Semantic ──────────────────────────────────
        "success":     "#5C7C5A",
        "success-soft":"#E8F0E7",
        "error":       "#B4423A",
        "error-soft":  "#F8E9E8",
        "info":        "#5B7A8C",
        "info-soft":   "#EBF2F6",
      },

      fontFamily: {
        sans:    ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        display: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        serif:   ["Georgia", "Iowan Old Style", "Apple Garamond", "Baskerville", "Times New Roman", "serif"],
      },

      borderRadius: {
        card:  "16px",
        btn:   "10px",
        chip:  "999px",
        input: "12px",
      },

      boxShadow: {
        card:      "0 2px 8px rgba(22,20,15,0.04), 0 8px 24px rgba(22,20,15,0.04)",
        "card-lg": "0 12px 32px rgba(22,20,15,0.08)",
        glow:      "0 0 24px rgba(180,99,42,0.25)",
        "glow-lg": "0 0 48px rgba(180,99,42,0.15)",
        gold:      "0 0 24px rgba(180,99,42,0.25)",
      },

      keyframes: {
        "fade-rise": {
          "0%":   { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          "0%":   { opacity: "0", transform: "scale(0.94)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0.6" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        "slide-up": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-rise":  "fade-rise 0.45s ease-out both",
        "pop":        "pop 0.2s ease-out both",
        "blink":      "blink 1s step-end infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "shimmer":    "shimmer 1.6s linear infinite",
        "slide-up":   "slide-up 0.3s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
