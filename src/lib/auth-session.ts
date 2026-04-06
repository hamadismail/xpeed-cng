const encoder = new TextEncoder();

export const AUTH_COOKIE_NAME = "xpeed_auth";

export type AuthSession = {
  sub: string;
  email: string;
  role: "admin";
  name: string;
  exp: number;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

function getExpiryInSeconds(): number {
  const raw = process.env.JWT_EXPIRES_IN?.trim() || "7d";
  const match = raw.match(/^(\d+)([smhd])$/i);

  if (!match) {
    const numeric = Number(raw);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : 60 * 60 * 24 * 7;
  }

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
  };

  return value * multipliers[unit];
}

function toBase64Url(input: string | Uint8Array): string {
  const bytes = typeof input === "string" ? encoder.encode(input) : input;
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  return atob(padded);
}

function decodeJson<T>(value: string): T {
  return JSON.parse(fromBase64Url(value)) as T;
}

async function getSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getJwtSecret()),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  );
}

async function signValue(value: string): Promise<string> {
  const key = await getSigningKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toBase64Url(new Uint8Array(signature));
}

export async function createAuthToken(payload: Omit<AuthSession, "exp">): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + getExpiryInSeconds();
  const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = toBase64Url(JSON.stringify({ ...payload, exp }));
  const data = `${header}.${body}`;
  const signature = await signValue(data);

  return `${data}.${signature}`;
}

export async function verifyAuthToken(token: string): Promise<AuthSession | null> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [headerPart, bodyPart, signaturePart] = parts;
  const header = decodeJson<{ alg?: string; typ?: string }>(headerPart);

  if (header.alg !== "HS256" || header.typ !== "JWT") {
    return null;
  }

  const expectedSignature = await signValue(`${headerPart}.${bodyPart}`);
  if (expectedSignature !== signaturePart) {
    return null;
  }

  const payload = decodeJson<AuthSession>(bodyPart);
  if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}

export function getSessionCookieMaxAge(): number {
  return getExpiryInSeconds();
}
