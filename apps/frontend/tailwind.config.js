/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nova: {
          deep: "#143457",
          gold: "#bd9655",
          "gold-light": "#e3c48e",
          ice: "#e8f1f8",
          slate: "#0a1c30",
          snow: "#ffffff",
        },
        surface: "#e8f1f8",
        brand: {
          50: "#eef4f9",
          100: "#d6e3f0",
          200: "#adc6df",
          300: "#7fa3c6",
          400: "#4f7aa6",
          500: "#2d5a85",
          600: "#21456a",
          700: "#173b61",
          800: "#143457",
          900: "#0a1c30",
        },
        accent: {
          50: "#fbf7f0",
          100: "#f4e9d3",
          200: "#e3c48e",
          300: "#d8b277",
          400: "#cba463",
          500: "#bd9655",
          600: "#a37f44",
          700: "#826434",
          800: "#614a27",
          900: "#41311a",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ['"Outfit"', '"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "nova-horizon":
          "linear-gradient(to bottom left, #2d5a85 0%, #143457 52%, #0a1c30 100%)",
        "glow-gold": "linear-gradient(to bottom left, #bd9655 0%, #e3c48e 100%)",
        "glass-gradient":
          "linear-gradient(to bottom left, rgba(255,255,255,0.72) 0%, rgba(232,241,248,0.45) 100%)",
      },
      boxShadow: {
        glass: "0 8px 30px -12px rgba(10, 28, 48, 0.25)",
        "glass-lg": "0 20px 50px -18px rgba(10, 28, 48, 0.35)",
        nova: "0 10px 30px -12px rgba(20, 52, 87, 0.45)",
        gold: "0 12px 30px -10px rgba(189, 150, 85, 0.5)",
      },
      borderColor: {
        "glass-border": "rgba(255, 255, 255, 0.45)",
      },
      backdropBlur: {
        glass: "16px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "skeleton-sweep": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "ai-cta-shine": {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
        "ai-progress-shine": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "nova-breathe": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" },
        },
        "nova-glow-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        shimmer: "shimmer 1.8s linear infinite",
        "skeleton-sweep": "skeleton-sweep 1.6s ease-in-out infinite",
        "ai-cta-shine": "ai-cta-shine 2.2s ease-in-out infinite",
        "ai-progress-shine": "ai-progress-shine 1.6s ease-in-out infinite",
        "nova-breathe": "nova-breathe 3s ease-in-out infinite",
        "nova-glow-pulse": "nova-glow-pulse 2.4s ease-in-out infinite",
      },
      maxWidth: {
        "screen-2xl": "1536px",
      },
    },
  },
  plugins: [],
};
