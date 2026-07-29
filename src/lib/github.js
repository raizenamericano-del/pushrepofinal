import JSZip from "jszip";

const GH = "https://api.github.com";

/* ---------- Helper fetch dengan pesan error ramah ---------- */
async function gh(token, path, options = {}) {
  const res = await fetch(`${GH}${path}`, {
    ...options,
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let detail = "";
    try {
      const j = await res.json();
      detail = j.message || "";
    } catch {}
    const err = new Error(friendlyError(res.status, detail));
    err.status = res.status;
    err.detail = detail;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

function friendlyError(status, detail = "") {
  const d = detail.toLowerCase();
  if (status === 401) return "Token tidak valid atau kedaluwarsa. Perbarui token di Settings.";
  if (status === 403) {
    if (d.includes("rate limit")) return "Rate limit GitHub tercapai. Tunggu beberapa menit lalu coba lagi.";
    return "Akses ditolak GitHub. Pastikan token punya permission 'repo'.";
  }
  if (status === 404) return "Resource tidak ditemukan di GitHub. Cek kembali token & nama repo.";
  if (status === 409) return "Konflik pada repository (mungkin sedang kosong / branch berubah). Coba lagi.";
  if (status === 422) return detail || "Data tidak valid ditolak GitHub (422).";
  return detail ? `GitHub error ${status}: ${detail}` : `GitHub error ${status}.`;
}

/* ---------- Ekstraksi ZIP di browser ---------- */
export async function extractZip(file, onProgress) {
  let zip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch {
    throw new Error("File ZIP rusak / corrupt atau bukan file ZIP yang valid.");
  }

  const rawEntries = Object.values(zip.files).filter((f) => !f.dir);
  if (rawEntries.length === 0) throw new Error("ZIP kosong — tidak ada file di dalamnya.");
  if (rawEntries.length > 1000)
    throw new Error(`ZIP berisi ${rawEntries.length} file. Maksimal 1000 file agar proses stabil.`);

  // Deteksi satu folder root yang membungkus semua file → di-strip
  const paths = rawEntries.map((f) => f.name.replace(/\\/g, "/"));
  let prefix = "";
  const firstSeg = paths[0].split("/")[0];
  if (paths.every((p) => p.startsWith(firstSeg + "/"))) prefix = firstSeg + "/";

  const skipRe = /(^|\/)(__MACOSX|\.git|\.DS_Store|Thumbs\.db)(\/|$)/;

  const files = [];
  let done = 0;
  for (const entry of rawEntries) {
    const cleanPath = entry.name.replace(/\\/g, "/").slice(prefix.length);
    if (!cleanPath || skipRe.test(entry.name)) {
      done++;
      continue;
    }
    const base64 = await entry.async("base64");
    files.push({ path: cleanPath, contentBase64: base64, size: (entry._data && entry._data.uncompressedSize) || 0 });
    done++;
    onProgress?.(Math.round((done / rawEntries.length) * 100), cleanPath);
  }

  if (files.length === 0) throw new Error("Tidak ada file valid di dalam ZIP (hanya berisi file sistem).");
  return files;
}

/* ---------- Retry helper: repo baru kadang butuh beberapa detik sampai siap ---------- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withRetry(fn, { tries = 5, baseDelay = 900, retryOn = [404, 409] } = {}) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (!retryOn.includes(e.status) || i === tries - 1) throw e;
      await sleep(baseDelay * (i + 1)); // backoff: 0.9s, 1.8s, 2.7s, ...
    }
  }
  throw lastErr;
}

/* ---------- Push semua file ke repo (Git Data API) ---------- */
export async function pushFiles({ token, owner, repo, files, branch = "main", onProgress, onStatus }) {
  // Tambah README.md otomatis jika tidak ada
  const hasReadme = files.some((f) => f.path.toLowerCase() === "readme.md");
  if (!hasReadme) {
    const readme = `# ${repo}\n\nDiunggah pada ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} · ${files.length} file\n\n---\n*Powered by [Zip2Repo](https://github.com) — a RifkyDev project* ⚡\n`;
    files = [...files, { path: "README.md", contentBase64: btoa(unescape(encodeURIComponent(readme))), size: readme.length }];
  }

  // 0. Tunggu repo benar-benar siap: ambil ref branch default (dibuat oleh auto_init)
  onStatus?.("Menunggu repository siap...");
  const ref = await withRetry(
    () => gh(token, `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(branch)}`),
    { tries: 6, baseDelay: 1000 }
  );
  const baseCommitSha = ref.object.sha;

  // 1. Buat blob untuk setiap file (paralel terbatas + retry)
  onStatus?.("Mengunggah file ke GitHub...");
  const blobs = new Array(files.length);
  let completed = 0;
  const CONCURRENCY = 6;
  let idx = 0;

  async function worker() {
    while (idx < files.length) {
      const i = idx++;
      const f = files[i];
      const blob = await withRetry(() =>
        gh(token, `/repos/${owner}/${repo}/git/blobs`, {
          method: "POST",
          body: JSON.stringify({ content: f.contentBase64, encoding: "base64" }),
        })
      );
      blobs[i] = { path: f.path, mode: "100644", type: "blob", sha: blob.sha };
      completed++;
      onProgress?.(Math.round((completed / files.length) * 100), f.path);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, files.length) }, worker));

  // 2. Buat tree (tanpa base_tree → isi repo = persis isi ZIP + README)
  onStatus?.("Menyusun struktur file (tree)...");
  const tree = await withRetry(() =>
    gh(token, `/repos/${owner}/${repo}/git/trees`, {
      method: "POST",
      body: JSON.stringify({ tree: blobs }),
    })
  );

  // 3. Buat commit dengan parent commit awal
  onStatus?.("Membuat commit...");
  const commit = await withRetry(() =>
    gh(token, `/repos/${owner}/${repo}/git/commits`, {
      method: "POST",
      body: JSON.stringify({
        message: "🚀 Upload via Zip2Repo",
        tree: tree.sha,
        parents: [baseCommitSha],
      }),
    })
  );

  // 4. Update branch ke commit baru
  onStatus?.(`Memperbarui branch ${branch}...`);
  await withRetry(() =>
    gh(token, `/repos/${owner}/${repo}/git/refs/heads/${encodeURIComponent(branch)}`, {
      method: "PATCH",
      body: JSON.stringify({ sha: commit.sha, force: true }),
    })
  );

  return { commitSha: commit.sha, fileCount: files.length };
}

/* ---------- Panggilan ke Netlify Functions ---------- */
export async function apiValidateToken(token) {
  const res = await fetch("/api/validate-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Gagal memvalidasi token.");
  return data;
}

export async function apiCreateRepo({ token, name, isPrivate, description }) {
  const res = await fetch("/api/create-repo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, name, isPrivate, description }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Gagal membuat repository.");
  return data;
}

export async function apiListRepos({ token, search = "" }) {
  const res = await fetch("/api/list-repos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, search }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Gagal mengambil daftar repository.");
  return data;
}

export async function apiDeleteRepo({ token, owner, repo }) {
  const res = await fetch("/api/delete-repo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, owner, repo }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Gagal menghapus repository.");
  return data;
}

export async function apiUpdateRepo({ token, owner, repo, newName, isPrivate, description }) {
  const res = await fetch("/api/update-repo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, owner, repo, newName, isPrivate, description }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Gagal mengupdate repository.");
  return data;
}
