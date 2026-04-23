export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          pink:   "#ff0080",
          blue:   "#00eaff",
          purple: "#8a2be2",
          black:  "#0a0a0f",
          dark:   "#1a1a2e",
          darker: "#16213e",
        },
      },
      fontFamily: {
        mono:  ["Courier New", "monospace"],
        cyber: ["Orbitron", "monospace"],
      },
      boxShadow: {
        neon:        "0 0 10px rgba(255,0,128,0.5), 0 0 20px rgba(0,234,255,0.3)",
        "neon-pink": "0 0 10px rgba(255,0,128,0.7), 0 0 20px rgba(255,0,128,0.4)",
        "neon-blue": "0 0 10px rgba(0,234,255,0.7), 0 0 20px rgba(0,234,255,0.4)",
        "neon-purple": "0 0 10px rgba(138,43,226,0.7), 0 0 20px rgba(138,43,226,0.4)",
      },
      animation: {
        glow:      "glow 2s ease-in-out infinite",
        flicker:   "flicker 4s ease-in-out infinite",
        "slide-in": "slideIn 0.3s ease-out forwards",
        "pulse-ring": "pulseRing 1.5s ease-out infinite",
      },
      keyframes: {
        glow: {
          "0%, 100%": { textShadow: "0 0 10px rgba(255,0,128,0.5), 0 0 20px rgba(255,0,128,0.3)" },
          "50%":      { textShadow: "0 0 20px rgba(255,0,128,0.9), 0 0 40px rgba(255,0,128,0.6)" },
        },
        flicker: {
          "0%, 89%, 91%, 95%, 100%": { opacity: "1" },
          "90%":  { opacity: "0.4" },
          "93%":  { opacity: "0.7" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        pulseRing: {
          "0%":   { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2)",   opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
