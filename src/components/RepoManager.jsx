import { useState, useEffect, useCallback } from "react";
import { getToken } from "../lib/storage.js";
import { apiListRepos, apiDeleteRepo, apiUpdateRepo } from "../lib/github.js";
import TiltCard from "./TiltCard.jsx";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins}m lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}j lalu`;
  return `${Math.floor(hrs / 24)}h lalu`;
}

export default function RepoManager({ showToast }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRepo, setSelectedRepo] = useState(null);

  // Edit state
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPrivate, setEditPrivate] = useState(false);
  const [editSaving, setEditSaving] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  const loadRepos = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const data = await apiListRepos({ token, search });
      setRepos(data.repos || []);
    } catch (err) {
      showToast?.({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }, [search, showToast]);

  useEffect(() => { loadRepos(); }, [loadRepos]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => loadRepos(), 400);
    return () => clearTimeout(t);
  }, [search, loadRepos]);

  function openEdit(repo) {
    setSelectedRepo(repo);
    setEditName(repo.name);
    setEditDesc(repo.description || "");
    setEditPrivate(repo.private);
    setEditOpen(true);
  }

  async function handleSaveEdit() {
    const token = getToken();
    if (!token || !selectedRepo) return;
    setEditSaving(true);
    try {
      const updated = await apiUpdateRepo({
        token,
        owner: selectedRepo.owner,
        repo: selectedRepo.name,
        newName: editName !== selectedRepo.name ? editName : undefined,
        description: editDesc,
        isPrivate: editPrivate !== selectedRepo.private ? editPrivate : undefined,
      });
      setRepos((prev) =>
        prev.map((r) => (r.id === selectedRepo.id ? { ...r, ...updated } : r))
      );
      showToast?.({ type: "success", message: "Repository berhasil diupdate! ✅" });
      setEditOpen(false);
    } catch (err) {
      showToast?.({ type: "error", message: err.message });
    } finally {
      setEditSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteConfirm) return;
    const token = getToken();
    if (!token) return;
    setDeleting(true);
    try {
      await apiDeleteRepo({
        token,
        owner: deleteConfirm.owner,
        repo: deleteConfirm.name,
      });
      setRepos((prev) => prev.filter((r) => r.id !== deleteConfirm.id));
      showToast?.({ type: "success", message: `Repo ${deleteConfirm.full_name} dihapus! 🗑️` });
      setDeleteConfirm(null);
      setDeleteInput("");
    } catch (err) {
      showToast?.({ type: "error", message: err.message });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <div className="text-center animate-fade-up">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          ⚙️ <span className="gradient-text">Kelola Repository</span>
        </h1>
        <p className="mt-3 text-slate-400">
          Rename, ubah visibilitas, atau hapus repository kamu
        </p>
      </div>

      {/* Search */}
      <div className="mt-8 animate-fade-up [animation-delay:.1s]">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari repo..."
            className="w-full rounded-xl bg-night-800/90 border border-white/10 pl-12 pr-4 py-3.5 text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/25 transition"
          />
        </div>
      </div>

      {/* Repo List */}
      <div className="mt-6 space-y-3 animate-fade-up [animation-delay:.2s]">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16">
            <div className="w-7 h-7 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
            <span className="text-slate-400">Memuat repository...</span>
          </div>
        ) : repos.length === 0 ? (
          <div className="glass py-16 text-center rounded-2xl">
            <span className="text-5xl">📭</span>
            <p className="mt-4 text-slate-400">
              {search ? "Tidak ada repo yang cocok" : "Belum ada repository"}
            </p>
          </div>
        ) : (
          repos.map((repo, idx) => (
            <TiltCard key={repo.id} max={3}>
              <div
                className="glass p-5 animate-fade-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">{repo.private ? "🔒" : "🌍"}</span>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-sm text-cyan-300 hover:text-cyan-200 hover:underline truncate"
                      >
                        {repo.full_name}
                      </a>
                    </div>
                    {repo.description && (
                      <p className="mt-1 text-xs text-slate-400 truncate">{repo.description}</p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                      {repo.language && (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {repo.language}
                        </span>
                      )}
                      <span>Updated {timeAgo(repo.updated_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEdit(repo)}
                      className="p-2.5 rounded-lg bg-white/[0.04] hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-400/40 transition text-slate-400 hover:text-indigo-300"
                      title="Edit repo"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => { setDeleteConfirm(repo); setDeleteInput(""); }}
                      className="p-2.5 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 border border-white/10 hover:border-rose-400/40 transition text-slate-400 hover:text-rose-300"
                      title="Hapus repo"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </TiltCard>
          ))
        )}
      </div>

      {/* ===== EDIT MODAL ===== */}
      {editOpen && selectedRepo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md glass !rounded-2xl p-6 md:p-8 animate-pop-in border border-white/10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              ✏️ Edit <span className="gradient-text">{selectedRepo.full_name}</span>
            </h3>

            <div className="mt-6 space-y-4">
              {/* Rename */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">📛 Nama Repository</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value.replace(/\s+/g, "-"))}
                  className="w-full rounded-xl bg-night-800/80 border border-white/10 px-4 py-3 font-mono text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/25 transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">📝 Deskripsi</label>
                <input
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Deskripsi singkat..."
                  maxLength={350}
                  className="w-full rounded-xl bg-night-800/80 border border-white/10 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/25 transition"
                />
              </div>

              {/* Visibility toggle */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">👁️ Visibilitas</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditPrivate(false)}
                    className={`rounded-xl border p-3 text-center transition-all ${
                      !editPrivate
                        ? "border-emerald-400/70 bg-emerald-500/15 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
                    }`}
                  >
                    <span className="text-xl">🌍</span>
                    <p className="text-sm font-semibold text-white mt-1">Public</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditPrivate(true)}
                    className={`rounded-xl border p-3 text-center transition-all ${
                      editPrivate
                        ? "border-amber-400/70 bg-amber-500/15 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
                    }`}
                  >
                    <span className="text-xl">🔒</span>
                    <p className="text-sm font-semibold text-white mt-1">Private</p>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setEditOpen(false)}
                className="btn-ghost flex-1"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editSaving || !editName}
                className="btn-primary flex-1"
              >
                {editSaving ? "Menyimpan..." : "💾 Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md glass !rounded-2xl p-6 md:p-8 animate-pop-in border border-rose-400/20">
            <div className="text-center">
              <span className="text-5xl">⚠️</span>
              <h3 className="mt-3 text-xl font-bold text-white">Hapus Repository?</h3>
              <p className="mt-2 text-sm text-slate-400">
                Ini akan <b className="text-rose-300">menghapus permanen</b> repository{" "}
                <code className="font-mono text-cyan-300 bg-white/5 px-1.5 py-0.5 rounded">{deleteConfirm.full_name}</code>.
                Tindakan ini <b className="text-rose-300">tidak bisa dibatalkan</b>.
              </p>

              <div className="mt-4">
                <p className="text-xs text-slate-500 mb-2">
                  Ketik <code className="font-mono text-rose-300 bg-rose-500/10 px-1 py-0.5 rounded">{deleteConfirm.full_name}</code> untuk konfirmasi:
                </p>
                <input
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder={deleteConfirm.full_name}
                  className="w-full rounded-xl bg-night-800 border-2 border-rose-400/30 focus:border-rose-400 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition text-center font-mono"
                  autoFocus
                />
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => { setDeleteConfirm(null); setDeleteInput(""); }}
                  className="btn-ghost flex-1"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting || deleteInput !== deleteConfirm.full_name}
                  className="flex-1 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-3 px-4 transition"
                >
                  {deleting ? "Menghapus..." : "🗑️ Hapus Permanen"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
