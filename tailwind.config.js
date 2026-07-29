/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        night: {
          900: "#070714",
          800: "#0c0c1f",
          700: "#12122b",
          600: "#1a1a3a",
        },
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        blob: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(40px,-60px) scale(1.15)" },
          "66%": { transform: "translate(-30px,30px) scale(0.9)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(18px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { opacity: 0, transform: "scale(0.85)" },
          "70%": { transform: "scale(1.04)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: 0.7 },
          "100%": { transform: "scale(1.6)", opacity: 0 },
        },
        wiggle: {
          "0%,100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        confetti: {
          "0%": { transform: "translateY(-10vh) rotate(0deg)", opacity: 1 },
          "100%": { transform: "translateY(110vh) rotate(720deg)", opacity: 0 },
        },
        "progress-stripes": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "28px 0" },
        },
        blink: {
          "0%,49%": { opacity: 1 },
          "50%,100%": { opacity: 0 },
        },
        twinkle: {
          "0%,100%": { opacity: 0.15, transform: "scale(0.8)" },
          "50%": { opacity: 1, transform: "scale(1.2)" },
        },
        "rocket-launch": {
          "0%": { transform: "translateY(40vh) scale(0.6)", opacity: 0 },
          "25%": { opacity: 1 },
          "60%": { transform: "translateY(-6vh) scale(1)", opacity: 1 },
          "100%": { transform: "translateY(-120vh) scale(1.1)", opacity: 0 },
        },
        scanline: {
          "0%": { top: "-10%" },
          "100%": { top: "110%" },
        },
        "splash-out": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0, visibility: "hidden" },
        },
        "logo-boot": {
          "0%": { transform: "scale(0.3) rotate(-25deg)", opacity: 0, filter: "blur(12px)" },
          "60%": { transform: "scale(1.12) rotate(4deg)", opacity: 1, filter: "blur(0)" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: 1 },
        },
        "glow-pulse": {
          "0%,100%": { boxShadow: "0 0 24px rgba(99,102,241,0.35)" },
          "50%": { boxShadow: "0 0 60px rgba(34,211,238,0.55)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "border-spin": {
          "100%": { transform: "rotate(360deg)" },
        },
        levitate: {
          "0%,100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-22px) rotate(2deg)" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        blob: "blob 14s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
        "fade-up": "fade-up .6s cubic-bezier(.22,1,.36,1) both",
        "pop-in": "pop-in .45s cubic-bezier(.22,1,.36,1) both",
        "spin-slow": "spin-slow 8s linear infinite",
        "pulse-ring": "pulse-ring 1.4s ease-out infinite",
        wiggle: "wiggle .5s ease-in-out infinite",
        confetti: "confetti 3.2s linear forwards",
        stripes: "progress-stripes .7s linear infinite",
        blink: "blink 1s step-end infinite",
        twinkle: "twinkle 2.4s ease-in-out infinite",
        "rocket-launch": "rocket-launch 3.6s cubic-bezier(.45,0,.55,1) forwards",
        scanline: "scanline 3.5s linear infinite",
        "splash-out": "splash-out .7s ease forwards",
        "logo-boot": "logo-boot 1.1s cubic-bezier(.22,1,.36,1) both",
        "glow-pulse": "glow-pulse 2.6s ease-in-out infinite",
        marquee: "marquee 26s linear infinite",
        "border-spin": "border-spin 5s linear infinite",
        levitate: "levitate 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
