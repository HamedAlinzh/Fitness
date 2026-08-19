import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "admin_session";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

export type SessionPayload = {
  userId: string;
  role: string;
  exp: number; // unix seconds
};

/**
 * The signing secret must be provided in production. In development we fall back to a
 * per-process random secret, which is safe (it only invalidates sessions on restart)
 * but must never be relied on for a real deployment.
 */
function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or shorter than 32 characters. " +
        "Generate one with: openssl rand -base64 32"
    );
  }

  devSecret ??= randomBytes(32).toString("hex");
  return devSecret;
}

let devSecret: string | undefined;

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createToken(userId: string, role: string): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = base64url(JSON.stringify({ userId, role, exp }));
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  // timingSafeEqual throws on length mismatch, so guard first.
  if (expected.length !== received.length) return null;
  if (!timingSafeEqual(expected, received)) return null;

  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString()
    ) as SessionPayload;

    if (typeof data.userId !== "string" || typeof data.exp !== "number") {
      return null;
    }
    if (data.exp < Math.floor(Date.now() / 1000)) return null;

    return data;
  } catch {
    return null;
  }
}

export async function createSession(userId: string, role: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createToken(userId, role), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function readSessionCookie(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return verifyToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
