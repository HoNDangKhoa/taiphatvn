import { AdminPageHeader } from "@/components/admin/AdminChrome";
import { SettingsForm, type SettingsValues } from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/queries";

export default async function SettingsPage() {
  const s = await getSettings();
  const initial: SettingsValues = {
    companyName: s?.companyName || "",
    slogan: s?.slogan || "",
    hotline: s?.hotline || "",
    phone: s?.phone || "",
    zalo: s?.zalo || "",
    email: s?.email || "",
    address: s?.address || "",
    taxCode: s?.taxCode || "",
    website: s?.website || "",
    mapsEmbedUrl: s?.mapsEmbedUrl || "",
    facebook: s?.facebook || "",
    instagram: s?.instagram || "",
    tiktok: s?.tiktok || "",
    messenger: s?.messenger || "",
    copyright: s?.copyright || "",
    metaTitle: s?.metaTitle || "",
    metaDescription: s?.metaDescription || "",
    seoKeywords: s?.seoKeywords || "",
    primaryKeyword: s?.primaryKeyword || "",
    headJs: s?.headJs || "",
    bodyJs: s?.bodyJs || "",
    googleAnalytics: s?.googleAnalytics || "",
    mailerHost: s?.mailerHost || "",
    mailerPort: s?.mailerPort || "",
    mailerSecure: s?.mailerSecure || "",
    mailerEmail: s?.mailerEmail || "",
    mailerPassword: s?.mailerPassword || "",
    logoUrl: s?.logoUrl || "/media/logo.png",
    faviconUrl: s?.faviconUrl || "/media/logo.png",
  };
  return (
    <div>
      <AdminPageHeader title="Thiết lập thông tin" />
      <SettingsForm initial={initial} />
    </div>
  );
}
