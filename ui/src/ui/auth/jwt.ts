export function decodeJwt(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }
  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(payload);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function tokenExpiresAtMs(token: string): number {
  const payload = decodeJwt(token);
  const exp = payload?.exp;
  if (typeof exp !== "number") {
    return 0;
  }
  return exp * 1000;
}

export function isTokenExpired(token: string, skewMs = 60_000): boolean {
  const expiresAt = tokenExpiresAtMs(token);
  if (!expiresAt) {
    return true;
  }
  return Date.now() + skewMs >= expiresAt;
}
