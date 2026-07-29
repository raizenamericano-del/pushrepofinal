import { Octokit } from "@octokit/rest";

const NAME_RE = /^[A-Za-z0-9_.-]{1,100}$/;

export async function updateRepoHandler(req, res) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") return res.status(204).set(headers).end();
  if (req.method !== "POST") return res.status(405).set(headers).json({ error: "Method not allowed" });

  try {
    const { token, owner, repo, newName, isPrivate, description } = req.body || {};
    if (!token) return res.status(400).set(headers).json({ error: "Token wajib diisi" });
    if (!owner || !repo) return res.status(400).set(headers).json({ error: "Owner & nama repo wajib diisi" });

    const octokit = new Octokit({ auth: token.trim() });

    // Build update payload
    const payload = {};
    if (newName && NAME_RE.test(newName)) payload.name = newName;
    if (typeof isPrivate === "boolean") payload.private = isPrivate;
    if (description !== undefined && description !== null) payload.description = description;

    if (Object.keys(payload).length === 0) {
      return res.status(400).set(headers).json({ error: "Tidak ada perubahan yang diminta." });
    }

    const { data: updated } = await octokit.repos.update({ owner, repo, ...payload });

    return res.status(200).set(headers).json({
      full_name: updated.full_name,
      name: updated.name,
      private: updated.private,
      html_url: updated.html_url,
      description: updated.description,
      owner: updated.owner.login,
    });
  } catch (err) {
    const status = err.status || 500;
    let msg = "Gagal mengupdate repository.";
    if (status === 401) msg = "Token tidak valid.";
    else if (status === 403) msg = "Akses ditolak.";
    else if (status === 404) msg = "Repository tidak ditemukan.";
    else if (status === 422) msg = "Nama baru tidak valid atau sudah dipakai.";
    return res.status(status).set(headers).json({ error: msg });
  }
}
