import type { Metadata } from "next";
import { HomeView } from "@/components/site/HomeView";
import { getBanner, getPageSeo, getProducts, getSettings } from "@/lib/queries";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("home");
  if (!seo.title) return {};
  return { title: seo.title, description: seo.description, keywords: seo.keywords || undefined };
}

export default async function HomePage() {
  const [banner, products, settings] = await Promise.all([
    getBanner(),
    getProducts({ visibleOnly: true }),
    getSettings(),
  ]);

  return (
    <HomeView
      banner={banner}
      products={products}
      brand={{
        companyName: settings?.companyName || "CÔNG TY TNHH THƯƠNG MẠI TÀI PHÁT VN",
        logoUrl: settings?.logoUrl || "/media/logo.png",
      }}
    />
  );
}
