import { NextResponse } from "next/server";
import { detectBrowser, detectDevice } from "@/lib/analytics";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const ua = request.headers.get("user-agent") || "";
  if (/bot|crawl|spider|preview/i.test(ua)) return NextResponse.json({ ok: true });
  let path = "/";
  try {
    const body = (await request.json()) as { path?: string };
    path = String(body.path || "/").slice(0, 180);
  } catch {
    path = "/";
  }
  if (path.startsWith("/admin")) return NextResponse.json({ ok: true });
  const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || null;
  await prisma.visitLog.create({
    data: { path, ip, browser: detectBrowser(ua), device: detectDevice(ua) },
  });
  return NextResponse.json({ ok: true });
}
