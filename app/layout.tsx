import type { Metadata } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/queries";

const body = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const display = Playfair_Display({
  subsets: ["vietnamese", "latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings?.metaTitle || "Kim Khánh | Tinh hoa trà Việt",
    description: settings?.metaDescription || "Thương mại Tài Phát VN — trà Kim Khánh.",
    keywords: settings?.seoKeywords || undefined,
    icons: { icon: settings?.faviconUrl || "/media/logo.png" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <html lang="vi">
      <head>
        {settings?.googleAnalytics ? (
          <script dangerouslySetInnerHTML={{ __html: settings.googleAnalytics }} />
        ) : null}
        {settings?.headJs ? <script dangerouslySetInnerHTML={{ __html: settings.headJs }} /> : null}
      </head>
      <body className={`${body.variable} ${display.variable} antialiased`}>
        {children}
        {settings?.bodyJs ? <script dangerouslySetInnerHTML={{ __html: settings.bodyJs }} /> : null}
      </body>
    </html>
  );
}
