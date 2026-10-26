import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "tp_session";

function secret() {
  return process.env.AUTH_SECRET || "taiphat-dev-secret";
}

export type SessionUser = { id: string; email: string; name: string };

export function signSession(user: SessionUser) {
  const body = Buffer.from(JSON.stringify({ ...user, exp: Date.now() + 1000 * 60 * 60 * 24 * 14 })).toString(
    "base64url",
  );
  const sig = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function readToken(token?: string): SessionUser | null {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionUser & { exp: number };
    if (!data.exp || data.exp < Date.now()) return null;
    return { id: data.id, email: data.email, name: data.name };
  } catch {
    return null;
  }
}

export async function readSession() {
  const jar = await cookies();
  return readToken(jar.get(COOKIE)?.value);
}

export async function writeSession(user: SessionUser) {
  const jar = await cookies();
  jar.set(COOKIE, signSession(user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
