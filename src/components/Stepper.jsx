const CREATE_STEPS = [
  { id: "extract", icon: "🗜️", label: "Ekstrak ZIP" },
  { id: "create", icon: "📦", label: "Buat Repository" },
  { id: "push", icon: "🚀", label: "Push ke main" },
  { id: "done", icon: "🎉", label: "Selesai" },
];

const PUSH_STEPS = [
  { id: "extract", icon: "🗜️", label: "Ekstrak ZIP" },
  { id: "push", icon: "🚀", label: "Push ke main" },
  { id: "done", icon: "🎉", label: "Selesai" },
];

export default function Stepper({ current, failedStep, mode = "create" }) {
  const steps = mode === "push" ? PUSH_STEPS : CREATE_STEPS;

  return (
    <ol className="flex items-center w-full">
      {steps.map((s, i) => {
        const state =
          failedStep === i ? "failed" : i < current ? "done" : i === current ? "active" : "todo";
        return (
          <li key={s.id} className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`}>
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative">
                {state === "active" && (
                  <span className="absolute inset-0 rounded-full bg-indigo-400/60 animate-pulse-ring" />
                )}
                <span
                  className={`relative flex h-11 w-11 items-center justify-center rounded-full text-lg border-2 transition-all duration-500
                  ${state === "done" ? "border-emerald-400 bg-emerald-400/15 scale-100" : ""}
                  ${state === "active" ? "border-indigo-400 bg-indigo-500/20 scale-110 shadow-[0_0_20px_rgba(99,102,241,0.5)]" : ""}
                  ${state === "todo" ? "border-white/15 bg-white/[0.04] opacity-60" : ""}
                  ${state === "failed" ? "border-rose-400 bg-rose-500/20 animate-wiggle" : ""}`}
                >
                  {state === "done" ? "✓" : state === "failed" ? "✕" : s.icon}
                </span>
              </div>
              <span
                className={`text-[11px] md:text-xs font-medium whitespace-nowrap transition-colors duration-300
                ${state === "done" ? "text-emerald-300" : state === "active" ? "text-indigo-300" : state === "failed" ? "text-rose-300" : "text-slate-500"}`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="relative mx-2 md:mx-3 h-[3px] flex-1 -mt-5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 transition-all duration-700"
                  style={{ width: i < current ? "100%" : "0%" }}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
