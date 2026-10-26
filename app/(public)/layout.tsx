import { CartProvider } from "@/components/cart/CartProvider";
import { FloatDock } from "@/components/site/FloatDock";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getBanner, getSettings } from "@/lib/queries";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [banner, settings] = await Promise.all([getBanner(), getSettings()]);
  if (!settings) {
    return <div className="p-10">Chưa có dữ liệu. Chạy npm run setup.</div>;
  }
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#FBF4EC]">
        <SiteHeader header={banner.header} logoUrl={settings.logoUrl} hotline={settings.hotline || ""} />
        {children}
        <SiteFooter footer={banner.footer} settings={settings} />
        <FloatDock phone={settings.hotline || ""} zalo={settings.zalo || ""} messenger={settings.messenger || ""} />
      </div>
    </CartProvider>
  );
}
