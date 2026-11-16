import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIMARY = "taiphatkimkhanh.vn";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() || "";
  if (!host || host === PRIMARY) return NextResponse.next();

  const shouldRedirect =
    host === "www.taiphatkimkhanh.vn" ||
    host === "taiphatvn.vercel.app" ||
    host.endsWith(".vercel.app") && host.includes("taiphatvn");

  if (!shouldRedirect) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.protocol = "https:";
  url.host = PRIMARY;
  url.port = "";
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|media/|tinymce/|api/).*)"],
};
