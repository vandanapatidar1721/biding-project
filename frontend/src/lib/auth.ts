const USER_KEY = "regrip-user";

export interface CurrentUser {
  id: number;
  email: string;
  role: string;
}

export function getCurrentUser(): CurrentUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CurrentUser;
  } catch {
    return null;
  }
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === "ADMIN";
}

export function isDealer(): boolean {
  const user = getCurrentUser();
  return user?.role === "DEALER";
}

export function logout(): void {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("regrip-token");
  window.location.href = "/";
}
