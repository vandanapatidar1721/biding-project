/**
 * Backend API base URL. Use VITE_API_URL in .env or default to localhost:4000.
 */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const getToken = (): string | null => localStorage.getItem("regrip-token");

export function isLoggedIn(): boolean {
  return !!getToken();
}

async function request<T>(
  path: string,
  options: RequestInit & { skipAuth?: boolean } = {}
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };
  const token = getToken();
  if (!skipAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((data as { message?: string }).message || "Request failed");
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, options?: RequestInit & { skipAuth?: boolean }) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: unknown, options?: RequestInit & { skipAuth?: boolean }) =>
    request<T>(path, { ...options, method: "POST", body: body ? JSON.stringify(body) : undefined }),
};
