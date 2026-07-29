import { useState } from "react";
import { getToken, setToken, clearToken, setUser, maskToken } from "../lib/storage.js";
import { apiValidateToken } from "../lib/github.js";

export default function SettingsPanel({ open, onClose, user, onUserChange, onTokenCleared, showToast }) {
  const [newToken, setNewToken] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const token = getToken();
  const hasToken = !!token;

  async function saveNew(e) {
    e.preventDefault();
    if (!newToken.trim()) return;
    setLoading(true);
    setError("");
    try {
      const u = await apiValidateToken(newToken.trim());
      setToken(newToken.trim());
      setUser(u);
      onUserChange(u);
      setNewToken("");
      showToast({ type: "success", message: `Token diperbarui. Halo @${u.login}! 👋` });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function remove() {
    clearToken();
    setConfirmDelete(false);
    showToast({ type: "success", message: "Token dihapus dari browser." });
    onTokenCleared();
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      {/* Slide-in panel */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-night-800/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl
        transition-transform duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl animate-spin-slow inline-block">⚙️</span> Settings
            </h2>
            <button onClick={onClose} className="btn-ghost !px-3 !py-2">✕</button>
          </div>

          {/* Status token */}
          <div className="glass mt-6 p-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Status Token</h3>
            <div className="mt-3 flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className={`absolute inline-flex h-full w-full rounded-full ${hasToken ? "bg-emerald-400 animate-pulse-ring" : "bg-rose-400"}`} />
                <span className={`relative inline-flex h-3 w-3 rounded-full ${hasToken ? "bg-emerald-400" : "bg-rose-400"}`} />
              </span>
              <span className={`font-semibold ${hasToken ? "text-emerald-300" : "text-rose-300"}`}>
                {hasToken ? "Token tersimpan ✓" : "Belum ada token"}
              </span>
            </div>
            {hasToken && (
              <p className="mt-2 font-mono text-sm text-slate-400 break-all">{maskToken(token)}</p>
            )}
            {user && (
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/[0.04] p-3 border border-white/5">
                <img src={user.avatar_url} alt={user.login} className="h-10 w-10 rounded-full ring-2 ring-indigo-400/40" />
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{user.name || user.login}</p>
                  <a href={user.html_url} target="_blank" rel="noreferrer" className="text-xs text-cyan-300 hover:underline">
                    @{user.login}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Ganti token */}
          <form onSubmit={saveNew} className="glass mt-4 p-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Ganti Token</h3>
            <div className="mt-3 relative">
              <input
                type={show ? "text" : "password"}
                value={newToken}
                onChange={(e) => { setNewToken(e.target.value); setError(""); }}
                placeholder="Token baru: ghp_..."
                className="input-field font-mono pr-12 !py-2.5"
                autoComplete="off"
              />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                {show ? "🙈" : "👁️"}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-rose-300 animate-pop-in">⚠️ {error}</p>}
            <button type="submit" disabled={loading || !newToken.trim()} className="btn-primary w-full mt-4 !py-2.5">
              {loading ? (
                <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Memvalidasi...</>
              ) : (
                "Validasi & Ganti Token"
              )}
            </button>
          </form>

          {/* Hapus token */}
          <div className="glass mt-4 p-5 border-rose-500/20">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Zona Berbahaya</h3>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={!hasToken}
                className="mt-3 w-full rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 font-medium text-rose-300 hover:bg-rose-500/20 transition disabled:opacity-40"
              >
                🗑️ Hapus Token
              </button>
            ) : (
              <div className="mt-3 animate-pop-in">
                <p className="text-sm text-rose-200">Yakin hapus token dari browser ini?</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={remove} className="flex-1 rounded-xl bg-rose-500 px-4 py-2.5 font-semibold text-white hover:bg-rose-600 transition active:scale-95">
                    Ya, hapus
                  </button>
                  <button onClick={() => setConfirmDelete(false)} className="btn-ghost flex-1">Batal</button>
                </div>
              </div>
            )}
          </div>

          <p className="mt-auto pt-6 text-center text-xs text-slate-600">
            Token hanya tersimpan di localStorage browser kamu.
          </p>
        </div>
      </aside>
    </>
  );
}
