const KEY = "zip2repo_token";
const USER_KEY = "zip2repo_user";

export function getToken() {
  try {
    return localStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(KEY, token);
  } catch {}
}

export function clearToken() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(USER_KEY);
  } catch {}
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function setUser(user) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {}
}

export function maskToken(token) {
  if (!token) return "";
  if (token.length <= 10) return token[0] + "•••" + token.slice(-2);
  return token.slice(0, 7) + "••••••••••" + token.slice(-4);
}
