import { useEffect, useRef } from "react";

const TYPE_STYLE = {
  info: "text-slate-300",
  ok: "text-emerald-300",
  warn: "text-amber-300",
  err: "text-rose-300",
  sys: "text-cyan-300",
  dim: "text-slate-500",
};

/** Terminal build-log ala CI/CD dengan auto-scroll & scanline */
export default function TerminalLog({ lines, working }) {
  const bodyRef = useRef(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#07070f] shadow-inner text-left">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-rose-400/90" />
        <span className="h-3 w-3 rounded-full bg-amber-400/90" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
        <span className="ml-2 font-mono text-[11px] text-slate-400">rifkydev@zip2repo: ~/build</span>
        {working && (
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-ping" />
            RUNNING
          </span>
        )}
      </div>

      {/* Scanline effect */}
      {working && (
        <div className="pointer-events-none absolute left-0 right-0 h-16 animate-scanline bg-gradient-to-b from-transparent via-cyan-400/[0.06] to-transparent" />
      )}

      {/* Body */}
      <div ref={bodyRef} className="h-52 md:h-60 overflow-y-auto px-4 py-3 font-mono text-[11px] md:text-xs leading-relaxed">
        {lines.map((l, i) => (
          <p key={i} className="animate-fade-up whitespace-pre-wrap break-all" style={{ animationDuration: ".25s" }}>
            <span className="text-slate-600 select-none">{l.time} </span>
            <span className={TYPE_STYLE[l.type] || TYPE_STYLE.info}>{l.text}</span>
          </p>
        ))}
        {working && <span className="animate-blink text-cyan-300">▊</span>}
      </div>
    </div>
  );
}
