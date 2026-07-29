import { useState } from "react";
import Background from "./components/Background.jsx";
import Logo from "./components/Logo.jsx";
import TokenGate from "./components/TokenGate.jsx";
import Uploader from "./components/Uploader.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import Toast from "./components/Toast.jsx";
import SplashScreen from "./components/SplashScreen.jsx";
import CursorGlow from "./components/CursorGlow.jsx";
import { getToken, getUser } from "./lib/storage.js";

export default function App() {
  const [user, setUser] = useState(getUser());
  const [hasToken, setHasToken] = useState(!!getToken());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [booted, setBooted] = useState(() => sessionStorage.getItem("z2r_booted") === "1");

  const showToast = (t) => setToast(t);

  function finishBoot() {
    sessionStorage.setItem("z2r_booted", "1");
    setBooted(true);
  }

  function handleTokenSaved(u) {
    setUser(u);
    setHasToken(true);
  }

  function handleTokenCleared() {
    setUser(null);
    setHasToken(false);
    setSettingsOpen(false);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!booted && <SplashScreen onDone={finishBoot} />}
      <Background />
      <CursorGlow />

      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-night-900/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Logo size={38} />
            <div>
              <p className="font-extrabold text-white leading-tight">
                Zip<span className="gradient-text">2</span>Repo
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                by <span className="font-bold gradient-text">RifkyDev</span> ⚡
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <a
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] pl-1 pr-3 py-1 hover:bg-white/[0.09] transition"
                title={`@${user.login}`}
              >
                <img src={user.avatar_url} alt={user.login} className="h-7 w-7 rounded-full ring-2 ring-indigo-400/40" />
                <span className="text-sm font-medium text-slate-200">@{user.login}</span>
              </a>
            )}
            <button
              onClick={() => setSettingsOpen(true)}
              className="btn-ghost !px-3.5 group"
              title="Settings"
            >
              <span className="inline-block transition-transform duration-500 group-hover:rotate-90">⚙️</span>
              <span className="hidden md:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        {hasToken ? (
          <Uploader user={user} showToast={showToast} onTokenInvalid={handleTokenCleared} />
        ) : (
          <TokenGate onSuccess={handleTokenSaved} showToast={showToast} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6">
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} <span className="font-semibold text-slate-400">Zip2Repo</span> · All rights reserved
          </p>
          <div className="flex items-center gap-2 group">
            <span className="text-xs text-slate-500">Developed by</span>
            <span className="relative inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-gradient-to-r from-indigo-500/15 to-cyan-400/15 px-3 py-1 transition-all duration-300 group-hover:shadow-[0_0_18px_rgba(99,102,241,0.45)] group-hover:border-indigo-400/60">
              <span className="text-sm">⚡</span>
              <span className="font-extrabold text-sm gradient-text tracking-wide">RifkyDev</span>
            </span>
          </div>
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-600 hover:text-cyan-300 transition"
          >
            Kelola token GitHub ↗
          </a>
        </div>
      </footer>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        onUserChange={(u) => { setUser(u); setHasToken(true); }}
        onTokenCleared={handleTokenCleared}
        showToast={showToast}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
