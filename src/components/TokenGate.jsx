import { useState } from "react";
import Logo from "./Logo.jsx";
import TiltCard from "./TiltCard.jsx";
import Typewriter from "./Typewriter.jsx";
import { apiValidateToken } from "../lib/github.js";
import { setToken, setUser } from "../lib/storage.js";

const STEPS = [
  { icon: "🌐", text: <>Buka <a className="text-cyan-300 underline hover:text-cyan-200" href="https://github.com/settings/tokens" target="_blank" rel="noreferrer">github.com/settings/tokens</a></> },
  { icon: "➕", text: <>Klik <b className="text-white">Generate new token (classic)</b></> },
  { icon: "✏️", text: <>Beri nama bebas, misal <code className="font-mono text-cyan-300">zip2repo</code></> },
  { icon: "🔑", text: <>Centang permission <b className="text-white">repo</b> <span className="text-slate-400">(Full control of private repositories)</span></> },
  { icon: "📋", text: <>Klik <b className="text-white">Generate token</b> lalu salin token-nya</> },
];

const MARQUEE = ["⚡ Tanpa git", "🗜️ Auto unzip", "🚀 Push ke main", "🔒 Token aman di browser", "📄 README otomatis", "🌍 Public / Private", "🎯 Maks. 50MB", "▲ Deploy to Vercel"];

export default function TokenGate({ onSuccess, showToast }) {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    const token = value.trim();
    if (!token) return setError("Token tidak boleh kosong.");
    setLoading(true);
    setError("");
    try {
      const user = await apiValidateToken(token);
      if (user.scopes?.length > 0 && !user.has_repo_scope) {
        throw new Error("Token valid, tetapi tidak memiliki permission 'repo'. Buat token baru dan centang scope 'repo'.");
      }
      setToken(token);
      setUser(user);
      showToast({ type: "success", message: `Halo @${user.login}! Token berhasil disimpan. 🎉` });
      onSuccess(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      {/* ===== HERO ===== */}
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="text-center lg:text-left animate-fade-up order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 animate-glow-pulse">
            ✨ ZIP → Repo dalam hitungan detik
          </div>
          <h1 className="mt-5 pb-2 text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.2]">
            Lempar <span className="gradient-text">ZIP</span>,<br />
            terbitlah{" "}
            <Typewriter
              words={["Repo 🚀", "Project ✨", "Karya 💻", "Portfolio 🔥"]}
              className="gradient-text"
            />
          </h1>
          <p className="mt-5 text-lg text-slate-400 max-w-xl mx-auto lg:mx-0">
            Upload file <b className="text-slate-200">.zip</b> dan biarkan Zip2Repo mengekstrak,
            membuat repository GitHub, dan mem-push semuanya ke branch{" "}
            <code className="font-mono text-cyan-300">main</code>. Tanpa git. Tanpa terminal.
          </p>

          {/* Stats mini */}
          <div className="mt-8 flex justify-center lg:justify-start gap-6">
            {[["50MB", "maks. ukuran"], ["1000", "file per zip"], ["3", "langkah otomatis"]].map(([v, l], i) => (
              <div key={i} className="text-center animate-fade-up" style={{ animationDelay: `${0.3 + i * 0.12}s` }}>
                <p className="text-2xl font-extrabold gradient-text">{v}</p>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero image */}
        <div className="relative order-1 lg:order-2 animate-fade-up [animation-delay:.2s]">
          <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-indigo-600/30 to-cyan-400/20 blur-[90px] rounded-full" />
          <img
            src="/hero.png"
            alt="Ilustrasi ZIP menjadi repository"
            className="mx-auto w-64 md:w-80 lg:w-[380px] rounded-3xl border border-white/10 shadow-[0_20px_80px_rgba(99,102,241,0.35)] animate-levitate"
            draggable={false}
          />
          {/* Maskot mengambang */}
          <img
            src="/mascot.png"
            alt="Maskot Zip2Repo"
            className="absolute -bottom-6 -left-2 md:left-6 w-24 md:w-32 drop-shadow-[0_0_25px_rgba(34,211,238,0.45)] animate-float [animation-delay:1.2s]"
            draggable={false}
          />
        </div>
      </div>

      {/* ===== MARQUEE ===== */}
      <div className="mt-14 overflow-hidden rounded-full border border-white/10 bg-white/[0.03] py-3 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-10 px-5">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="whitespace-nowrap text-sm font-semibold text-slate-400">{m}</span>
          ))}
        </div>
      </div>

      {/* ===== TOKEN SECTION ===== */}
      <div id="token" className="mt-14 grid md:grid-cols-2 gap-6 items-start">
        {/* Petunjuk */}
        <TiltCard>
          <div className="glass p-6 md:p-8 animate-fade-up [animation-delay:.15s]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-2xl">📖</span> Cara membuat GitHub Token
            </h2>
            <ol className="mt-5 space-y-4">
              {STEPS.map((s, i) => (
                <li key={i} className="flex items-start gap-3 animate-fade-up" style={{ animationDelay: `${0.25 + i * 0.1}s` }}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/30 to-cyan-400/30 border border-white/10 text-sm">
                    {s.icon}
                  </span>
                  <span className="text-sm text-slate-300 pt-1.5">{s.text}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/[0.07] px-4 py-3 text-xs text-amber-200/90">
              🔒 Token kamu disimpan <b>hanya di browser ini</b> (localStorage) dan hanya dikirim ke GitHub saat
              membuat repo & push file. Kami tidak pernah menyimpannya di server.
            </div>
          </div>
        </TiltCard>

        {/* Form token */}
        <TiltCard>
          <form onSubmit={submit} className="glass p-6 md:p-8 animate-fade-up [animation-delay:.3s]">
            <div className="flex items-center gap-3">
              <Logo size={40} />
              <h2 className="text-lg font-bold text-white">Masukkan Personal Access Token</h2>
            </div>
            <div className="mt-5 relative">
              <input
                type={show ? "text" : "password"}
                value={value}
                onChange={(e) => { setValue(e.target.value); setError(""); }}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="input-field font-mono pr-12"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                title={show ? "Sembunyikan" : "Tampilkan"}
              >
                {show ? "🙈" : "👁️"}
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300 animate-pop-in">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading || !value.trim()} className="btn-primary w-full mt-6">
              {loading ? (
                <>
                  <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Memvalidasi token...
                </>
              ) : (
                <>Validasi & Simpan Token 🚀</>
              )}
            </button>
            <p className="mt-4 text-xs text-slate-500 text-center">
              Token divalidasi langsung ke API GitHub sebelum disimpan.
            </p>
          </form>
        </TiltCard>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white animate-fade-up">
          3 langkah, <span className="gradient-text">sisanya otomatis</span> ✨
        </h2>
        <div className="mt-8 grid sm:grid-cols-3 gap-5">
          {[
            { icon: "🗜️", title: "1. Upload ZIP", desc: "Drag & drop file .zip kamu, diekstrak langsung di browser." },
            { icon: "📦", title: "2. Repo Dibuat", desc: "Repository baru dibuat di akun GitHub kamu, private atau public." },
            { icon: "🚀", title: "3. Auto Push", desc: "Semua file ter-push ke branch main lengkap dengan README." },
          ].map((c, i) => (
            <TiltCard key={i}>
              <div className="glass p-6 h-full animate-fade-up" style={{ animationDelay: `${0.2 + i * 0.15}s` }}>
                <span className="inline-block text-4xl animate-float" style={{ animationDelay: `${i * 0.5}s` }}>{c.icon}</span>
                <h3 className="mt-3 font-bold text-white">{c.title}</h3>
                <p className="mt-1.5 text-sm text-slate-400">{c.desc}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  );
}
