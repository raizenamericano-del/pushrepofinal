import { Octokit } from "@octokit/rest";

export async function validateTokenHandler(req, res) {
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
    const { token } = req.body || {};
    if (!token || typeof token !== "string")
      return res.status(400).set(headers).json({ error: "Token wajib diisi" });

    const octokit = new Octokit({ auth: token.trim() });
    const { data: user } = await octokit.users.getAuthenticated();

    let scopes = [];
    try {
      const res2 = await octokit.request("GET /user");
      scopes = (res2.headers["x-oauth-scopes"] || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } catch (_) {}

    return res.status(200).set(headers).json({
      valid: true,
      login: user.login,
      name: user.name,
      avatar_url: user.avatar_url,
      html_url: user.html_url,
      public_repos: user.public_repos,
      total_private_repos: user.total_private_repos ?? null,
      scopes,
      has_repo_scope: scopes.includes("repo") || scopes.length === 0,
    });
  } catch (err) {
    const status = err.status || 500;
    let msg = "Gagal memvalidasi token.";
    if (status === 401) msg = "Token tidak valid atau sudah kedaluwarsa.";
    else if (status === 403) msg = "Akses ditolak / rate limit GitHub tercapai. Coba lagi nanti.";
    return res
      .status(status === 401 ? 401 : 500)
      .set(headers)
      .json({ error: msg });
  }
}
