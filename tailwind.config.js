export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          pink:   "#ff0080",
          blue:   "#00eaff",
          purple: "#8a2be2",
          orange: "#ff6a00",
          yellow: "#ffd700",
          black:  "#0d0015",
          dark:   "#1a0a2e",
          darker: "#120820",
        },
      },
      fontFamily: {
        mono:  ["Share Tech Mono", "Courier New", "monospace"],
        cyber: ["Orbitron", "monospace"],
      },
      boxShadow: {
        neon:          "0 0 10px rgba(255,0,128,0.5), 0 0 20px rgba(0,234,255,0.3)",
        "neon-pink":   "0 0 10px rgba(255,0,128,0.7), 0 0 30px rgba(255,0,128,0.4), 0 0 60px rgba(138,43,226,0.2)",
        "neon-blue":   "0 0 10px rgba(0,234,255,0.7), 0 0 30px rgba(0,234,255,0.4)",
        "neon-purple": "0 0 10px rgba(138,43,226,0.7), 0 0 30px rgba(138,43,226,0.4)",
        "neon-orange": "0 0 10px rgba(255,106,0,0.7), 0 0 30px rgba(255,106,0,0.4)",
        "retro":       "0 0 20px rgba(255,0,128,0.3), 0 0 40px rgba(138,43,226,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      backgroundImage: {
        "synthwave-gradient": "linear-gradient(180deg, #0d0015 0%, #1a0a2e 50%, #0d0015 100%)",
        "horizon-gradient":   "linear-gradient(180deg, transparent 0%, rgba(138,43,226,0.15) 60%, rgba(255,0,128,0.2) 80%, rgba(255,106,0,0.1) 100%)",
        "chrome-text":        "linear-gradient(135deg, #ff0080 0%, #ff6ec7 30%, #00eaff 60%, #8a2be2 100%)",
      },
      animation: {
        glow:         "glow 2s ease-in-out infinite",
        flicker:      "flicker 4s ease-in-out infinite",
        "slide-in":   "slideIn 0.3s ease-out forwards",
        "pulse-ring": "pulseRing 1.5s ease-out infinite",
        "sun-pulse":  "sunPulse 3s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%, 100%": { textShadow: "0 0 8px rgba(255,0,128,0.7), 0 0 20px rgba(255,0,128,0.4), 0 0 40px rgba(138,43,226,0.2)" },
          "50%":      { textShadow: "0 0 16px rgba(255,0,128,1), 0 0 40px rgba(255,0,128,0.6), 0 0 80px rgba(138,43,226,0.4)" },
        },
        flicker: {
          "0%, 89%, 91%, 95%, 100%": { opacity: "1" },
          "90%": { opacity: "0.4" },
          "93%": { opacity: "0.7" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        pulseRing: {
          "0%":   { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2)",   opacity: "0" },
        },
        sunPulse: {
          "0%, 100%": { opacity: "0.7" },
          "50%":      { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
