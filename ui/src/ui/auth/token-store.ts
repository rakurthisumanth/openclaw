import { isTokenExpired } from "./jwt.ts";

const TOKEN_STORAGE_KEY = "openclaw.control.cognito.tokens.v1";

export type AuthTokens = {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  tokenType: string;
  issuedAt: number;
};

let memoryTokens: AuthTokens | null = null;

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors.
  }
}

function safeRemove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage errors.
  }
}

export function getStoredTokens(): AuthTokens | null {
  if (memoryTokens) {
    return memoryTokens;
  }
  const raw = safeGet(TOKEN_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<AuthTokens>;
    if (
      typeof parsed.accessToken !== "string" ||
      typeof parsed.idToken !== "string" ||
      typeof parsed.refreshToken !== "string"
    ) {
      return null;
    }
    memoryTokens = {
      accessToken: parsed.accessToken,
      idToken: parsed.idToken,
      refreshToken: parsed.refreshToken,
      tokenType: typeof parsed.tokenType === "string" ? parsed.tokenType : "Bearer",
      issuedAt: typeof parsed.issuedAt === "number" ? parsed.issuedAt : Date.now(),
    };
    return memoryTokens;
  } catch {
    return null;
  }
}

export function setStoredTokens(tokens: AuthTokens, persist = true) {
  memoryTokens = tokens;
  if (persist) {
    safeSet(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    return;
  }
  safeRemove(TOKEN_STORAGE_KEY);
}

export function clearStoredTokens() {
  memoryTokens = null;
  safeRemove(TOKEN_STORAGE_KEY);
}

export function hasValidStoredAccessToken(): boolean {
  const tokens = getStoredTokens();
  if (!tokens) {
    return false;
  }
  return !isTokenExpired(tokens.accessToken);
}
