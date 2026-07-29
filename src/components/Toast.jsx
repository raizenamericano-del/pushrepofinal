import { useEffect } from "react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  const isError = toast.type === "error";

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-pop-in px-4 w-full max-w-md">
      <div
        className={`glass flex items-start gap-3 px-4 py-3 border ${
          isError ? "border-rose-500/40" : "border-emerald-500/40"
        }`}
      >
        <span className={`mt-0.5 text-lg ${isError ? "text-rose-400" : "text-emerald-400"}`}>
          {isError ? "⚠️" : "✅"}
        </span>
        <p className="text-sm text-slate-200 flex-1">{toast.message}</p>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition">✕</button>
      </div>
    </div>
  );
}
