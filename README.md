# 🗜️ Zip2Repo — ZIP → GitHub Repo Otomatis

Web app modern untuk mengubah file **.zip** menjadi **repository GitHub** secara otomatis.
Upload ZIP → diekstrak → repo dibuat → semua file di-push ke branch `main`. Tanpa git, tanpa terminal. ⚡

![Logo](public/logo.png)

## ✨ Fitur

- 🔑 **Token Gate** — input GitHub Personal Access Token sekali saja, divalidasi langsung ke API GitHub sebelum disimpan di `localStorage`.
- 👤 Menampilkan **username + avatar GitHub** setelah token valid.
- ⚙️ **Settings panel** (slide-in animasi): lihat status token, ganti token, hapus token.
- 📦 Form upload: nama repo bebas, pilih **Private / Public**, drag & drop ZIP (maks. **50MB**).
- 🗜️ ZIP **diekstrak di browser** (JSZip) — file besar tidak membebani serverless function.
- 🚀 Push semua file ke branch `main` via **Git Data API** (blob → tree → commit → ref) dengan progress bar per-file.
- 📄 **README.md dibuat otomatis** jika tidak ada di dalam ZIP.
- 🎉 Halaman sukses dengan **confetti + roket meluncur**, link repo, dan tombol **Deploy to Vercel**.
- 🛡️ Error handling lengkap: token invalid (401), repo sudah ada (422), rate limit (403), ZIP corrupt/kosong, file > 50MB, dll.
- 💅 UI dark modern: glassmorphism, animated gradient blobs, stepper animasi, orbit loader, shimmer, responsive penuh.

## 🎬 Animasi & Visual Spesial

- 🖥️ **Splash screen boot** ala terminal saat pertama buka (sekali per sesi).
- 🧾 **Terminal build log real-time** ala CI/CD — setiap file yang di-unzip & di-push tercatat dengan timestamp, scanline effect, dan kursor berkedip.
- 🚀 **Animasi roket meluncur** full-screen saat build sukses, disusul confetti.
- 🎴 **3D tilt card** — kartu bereaksi mengikuti kursor dengan efek sheen.
- ✨ **Cursor glow** yang mengikuti mouse (desktop).
- 🎠 **Marquee fitur** berjalan, hero image **levitate**, maskot robot mengambang.
- 🖼️ 4 gambar AI-generated: logo app, hero illustration isometrik, maskot robot astronot, dan roket neon.

## 🧰 Tech Stack

| Layer     | Teknologi                                   |
|-----------|---------------------------------------------|
| Frontend  | React 18 + Vite                             |
| Styling   | Tailwind CSS (custom keyframes & animasi)   |
| Backend   | Netlify Functions (validate-token, create-repo) |
| Unzip     | JSZip (di browser)                          |
| GitHub    | @octokit/rest (server) + Git Data API (client) |

## 🚀 Jalankan Lokal

```bash
npm install
npx netlify dev    # menjalankan Vite + Netlify Functions sekaligus
# atau tanpa functions: npm run dev
```

> Untuk `netlify dev`, install dulu Netlify CLI: `npm i -g netlify-cli`

## ☁️ Deploy ke Netlify

### Opsi 1 — via Git (disarankan)
1. Push folder ini ke repo GitHub kamu.
2. Buka [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
3. Pilih repo → Netlify otomatis membaca `netlify.toml` (build: `npm run build`, publish: `dist`, functions: `netlify/functions`).
4. Klik **Deploy**. Selesai! 🎉

### Opsi 2 — via Netlify CLI
```bash
npm i -g netlify-cli
netlify login
netlify init      # atau: netlify deploy --prod
```

## 🔑 Cara Membuat GitHub Token

1. Buka <https://github.com/settings/tokens>
2. **Generate new token (classic)**
3. Beri nama bebas
4. Centang permission **`repo`** (Full control of private repositories)
5. **Generate token** lalu salin

## 🔒 Keamanan

- Token disimpan **hanya di localStorage browser** — tidak pernah disimpan di server/database.
- Token hanya dikirim saat: validasi token, create repo (Netlify Function), dan push file (langsung browser → API GitHub via HTTPS).

## 📁 Struktur Proyek

```
zip2repo/
├── netlify/functions/
│   ├── validate-token.js   # POST /api/validate-token
│   └── create-repo.js      # POST /api/create-repo
├── public/logo.png
├── src/
│   ├── components/         # Background, Logo, TokenGate, Uploader, Stepper,
│   │                       # SettingsPanel, Confetti, Toast
│   ├── lib/
│   │   ├── github.js       # extract ZIP, push via Git Data API, panggilan API
│   │   └── storage.js      # localStorage helpers
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── netlify.toml
├── tailwind.config.js
└── vite.config.js
```
