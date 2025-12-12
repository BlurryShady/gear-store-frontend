const API_ORIGIN =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  (import.meta.env.DEV ? "http://127.0.0.1:8000" : "");

const API_BASE_URL = `${API_ORIGIN}/api`;

export async function apiGet(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`API GET ${path} failed with status ${response.status}`);
  }
  return response.json();
}

export async function apiPost(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let detail = `API POST ${path} failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data.detail) detail = data.detail;
    } catch {}
    throw new Error(detail);
  }

  return response.json();
}
