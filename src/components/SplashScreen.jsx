import { useEffect, useState } from "react";
import Logo from "./Logo.jsx";

const BOOT_LINES = [
  "▶ booting zip2repo core...",
  "▶ loading neon engine ⚡",
  "▶ connecting to github galaxy 🌌",
  "▶ crafted by RifkyDev — let's go! 🚀",
];

export default function SplashScreen({ onDone }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setLineIdx((i) => {
        if (i >= BOOT_LINES.length - 1) {
          clearInterval(t);
          setTimeout(() => setLeaving(true), 450);
          setTimeout(onDone, 1150);
          return i;
        }
        return i + 1;
      });
    }, 420);
    return () => clearInterval(t);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-night-900 ${
        leaving ? "animate-splash-out" : ""
      }`}
    >
      {/* Star field */}
      {Array.from({ length: 40 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            width: 1 + (i % 3),
            height: 1 + (i % 3),
            left: `${(i * 61) % 100}%`,
            top: `${(i * 41) % 100}%`,
            animationDelay: `${(i % 8) * 0.3}s`,
          }}
        />
      ))}

      <div className="animate-logo-boot">
        <Logo size={110} />
      </div>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight animate-fade-up [animation-delay:.4s]">
        Zip<span className="gradient-text">2</span>Repo
      </h1>
      <p className="mt-1 text-xs text-slate-500 animate-fade-up [animation-delay:.55s]">
        by <span className="font-bold gradient-text">RifkyDev</span>
      </p>

      {/* Boot log */}
      <div className="mt-8 w-72 font-mono text-xs text-left space-y-1.5">
        {BOOT_LINES.slice(0, lineIdx + 1).map((l, i) => (
          <p key={i} className={`animate-fade-up ${i === lineIdx ? "text-cyan-300" : "text-slate-500"}`}>
            {l}
            {i === lineIdx && <span className="animate-blink text-cyan-300">▊</span>}
          </p>
        ))}
      </div>

      {/* Loading bar */}
      <div className="mt-6 h-1.5 w-72 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
          style={{ width: `${((lineIdx + 1) / BOOT_LINES.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
