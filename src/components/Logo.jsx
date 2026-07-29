export default function Logo({ size = 44, spin = false }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-indigo-500/60 to-cyan-400/60 blur-lg" />
      <img
        src="/logo-glow.png"
        alt="Zip2Repo logo"
        width={size}
        height={size}
        className={`relative drop-shadow-[0_0_14px_rgba(99,102,241,0.7)] ${spin ? "animate-spin-slow" : ""}`}
        draggable={false}
      />
    </div>
  );
}
