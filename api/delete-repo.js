import { Octokit } from "@octokit/rest";

export async function deleteRepoHandler(req, res) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") return res.status(204).set(headers).end();
  if (req.method !== "POST") return res.status(405).set(headers).json({ error: "Method not allowed" });

  try {
    const { token, owner, repo } = req.body || {};
    if (!token) return res.status(400).set(headers).json({ error: "Token wajib diisi" });
    if (!owner || !repo) return res.status(400).set(headers).json({ error: "Owner & nama repo wajib diisi" });

    const octokit = new Octokit({ auth: token.trim() });
    await octokit.repos.delete({ owner, repo });

    return res.status(200).set(headers).json({ success: true, message: `Repository ${owner}/${repo} berhasil dihapus.` });
  } catch (err) {
    const status = err.status || 500;
    let msg = "Gagal menghapus repository.";
    if (status === 401) msg = "Token tidak valid.";
    else if (status === 403) msg = "Akses ditolak. Pastikan token punya izin hapus repo.";
    else if (status === 404) msg = "Repository tidak ditemukan.";
    return res.status(status).set(headers).json({ error: msg });
  }
}
