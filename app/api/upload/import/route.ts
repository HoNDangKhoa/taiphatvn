import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { readSession } from "@/lib/session";

export const maxDuration = 60;

const MAX_IMAGES = 30;
const MAX_BYTES = 15 * 1024 * 1024;

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/avif": ".webp",
};

function isPrivateHost(hostname: string) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  return (
    host === "localhost" ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host === "::1" ||
    host === "0.0.0.0" ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    /^(fc|fd|fe80)/.test(host)
  );
}

async function storeImage(buffer: Buffer, filename: string, mime: string) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${filename}`, buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: mime,
    });
    return blob.url;
  }
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/${filename}`;
}

async function importOne(raw: string): Promise<string | null> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (!/^https?:$/.test(url.protocol) || isPrivateHost(url.hostname)) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        Accept: "image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8",
      },
    });
    if (!res.ok) return null;
    const type = (res.headers.get("content-type") || "").split(";")[0]!.trim().toLowerCase();
    const pathExt = url.pathname.match(/\.(jpe?g|png|webp|gif|svg)$/i)?.[0]?.toLowerCase();
    if (!type.startsWith("image/") && !pathExt) return null;
    const length = Number(res.headers.get("content-length") || 0);
    if (length > MAX_BYTES) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    if (!buffer.length || buffer.length > MAX_BYTES) return null;
    const ext = EXT_BY_TYPE[type] || (pathExt === ".jpeg" ? ".jpg" : pathExt) || ".jpg";
    const mime = type.startsWith("image/") && EXT_BY_TYPE[type] ? type : "image/jpeg";
    return storeImage(buffer, `${Date.now()}-import${ext}`, mime === "image/avif" ? "image/webp" : mime);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as { urls?: unknown };
  const urls = Array.isArray(body.urls)
    ? [...new Set(body.urls.filter((u): u is string => typeof u === "string"))].slice(0, MAX_IMAGES)
    : [];
  const entries = await Promise.all(urls.map(async (u) => [u, await importOne(u)] as const));
  return NextResponse.json({ results: Object.fromEntries(entries) });
}
