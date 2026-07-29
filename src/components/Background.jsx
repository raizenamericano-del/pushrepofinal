export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Aurora waves */}
      <div
        className="absolute -top-1/3 left-1/2 h-[80vh] w-[140vw] -translate-x-1/2 opacity-40"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, transparent 0deg, rgba(99,102,241,0.35) 60deg, rgba(34,211,238,0.28) 120deg, transparent 180deg, rgba(167,139,250,0.3) 260deg, transparent 360deg)",
          filter: "blur(70px)",
          animation: "spin-slow 30s linear infinite",
        }}
      />

      {/* Animated gradient blobs */}
      <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-indigo-600/25 blur-[120px] animate-blob" />
      <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[120px] animate-blob [animation-delay:4s]" />
      <div className="absolute -bottom-40 left-1/3 h-[460px] w-[460px] rounded-full bg-violet-600/20 blur-[120px] animate-blob [animation-delay:8s]" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Twinkling stars */}
      {Array.from({ length: 26 }).map((_, i) => (
        <span
          key={`s${i}`}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            width: 1 + (i % 3),
            height: 1 + (i % 3),
            left: `${(i * 53) % 100}%`,
            top: `${(i * 31) % 100}%`,
            animationDelay: `${(i % 9) * 0.35}s`,
          }}
        />
      ))}

      {/* Shooting stars */}
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={`sh${i}`}
          className="absolute h-px w-32 bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent"
          style={{
            top: `${12 + i * 26}%`,
            left: "-10%",
            transform: "rotate(-18deg)",
            animation: `shoot 7s linear infinite`,
            animationDelay: `${i * 2.6}s`,
          }}
        />
      ))}

      {/* Floating particles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={`p${i}`}
          className="absolute block rounded-full bg-white/20 animate-float"
          style={{
            width: 3 + (i % 3) * 2,
            height: 3 + (i % 3) * 2,
            left: `${(i * 71) % 100}%`,
            top: `${(i * 37) % 100}%`,
            animationDelay: `${(i * 0.6) % 5}s`,
            animationDuration: `${4 + (i % 4)}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes shoot {
          0% { transform: translateX(0) rotate(-18deg); opacity: 0; }
          5% { opacity: 1; }
          18% { transform: translateX(120vw) rotate(-18deg); opacity: 0; }
          100% { transform: translateX(120vw) rotate(-18deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
