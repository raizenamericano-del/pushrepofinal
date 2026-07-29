import { Octokit } from "@octokit/rest";

export async function listReposHandler(req, res) {
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
    const { token, search = "", page = 1, per_page = 50 } = req.body || {};
    if (!token) return res.status(400).set(headers).json({ error: "Token wajib diisi" });

    const octokit = new Octokit({ auth: token.trim() });

    // Ambil repo user (termasuk org repo)
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      sort: "updated",
      direction: "desc",
      per_page: Math.min(per_page, 100),
      page,
      type: "owner",
    });

    // Filter by search if provided
    const q = search.toLowerCase().trim();
    const filtered = q
      ? repos.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            (r.full_name && r.full_name.toLowerCase().includes(q)) ||
            (r.description && r.description.toLowerCase().includes(q))
        )
      : repos;

    const result = filtered.map((r) => ({
      id: r.id,
      name: r.name,
      full_name: r.full_name,
      owner: r.owner.login,
      private: r.private,
      html_url: r.html_url,
      description: r.description || "",
      default_branch: r.default_branch || "main",
      updated_at: r.updated_at,
      language: r.language || "",
    }));

    return res.status(200).set(headers).json({ repos: result, total: repos.length, filtered: result.length });
  } catch (err) {
    const status = err.status || 500;
    let msg = "Gagal mengambil daftar repository.";
    if (status === 401) msg = "Token tidak valid. Silakan perbarui token di Settings.";
    return res.status(status).set(headers).json({ error: msg });
  }
}
