import { Octokit } from "@octokit/rest";

const NAME_RE = /^[A-Za-z0-9_.-]{1,100}$/;

export async function createRepoHandler(req, res) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return res.status(204).set(headers).end();
  }
  if (req.method !== "POST") {
    return res.status(405).set(headers).json({ error: "Method not allowed" });
  }

  try {
    const { token, name, isPrivate, description } = req.body || {};
    if (!token) return res.status(400).set(headers).json({ error: "Token wajib diisi" });
    if (!name || !NAME_RE.test(name))
      return res.status(400).set(headers).json({
        error: "Nama repo tidak valid. Gunakan huruf, angka, tanda hubung (-), underscore (_), atau titik (.)",
      });

    const octokit = new Octokit({ auth: token.trim() });

    const { data: repo } = await octokit.repos.createForAuthenticatedUser({
      name,
      private: !!isPrivate,
      description: description || "Uploaded with Zip2Repo ⚡",
      auto_init: true,
    });

    return res.status(200).set(headers).json({
      full_name: repo.full_name,
      html_url: repo.html_url,
      owner: repo.owner.login,
      name: repo.name,
      private: repo.private,
      default_branch: repo.default_branch || "main",
    });
  } catch (err) {
    const status = err.status || 500;
    let msg = "Gagal membuat repository.";
    if (status === 401) msg = "Token tidak valid. Silakan perbarui token di Settings.";
    else if (status === 422) msg = "Nama repository sudah ada di akun kamu. Gunakan nama lain.";
    else if (status === 403) {
      const m = (err.message || "").toLowerCase();
      msg = m.includes("rate limit")
        ? "Rate limit GitHub tercapai. Tunggu beberapa menit lalu coba lagi."
        : "Akses ditolak. Pastikan token memiliki permission 'repo'.";
    }
    return res.status(status).set(headers).json({ error: msg });
  }
}
