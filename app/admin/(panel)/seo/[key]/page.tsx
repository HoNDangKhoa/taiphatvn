import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminChrome";
import { SeoPageForm } from "@/components/admin/SeoPageForm";
import { SEO_PAGES } from "@/lib/home";
import { getPageSeo, getSettings } from "@/lib/queries";

export default async function SeoPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const page = SEO_PAGES.find((item) => item.key === key);
  if (!page) notFound();
  const [seo, settings] = await Promise.all([getPageSeo(key), getSettings()]);
  const initial = key === "home" && settings?.metaTitle && !seo.title
    ? { ...seo, title: settings.metaTitle, description: settings.metaDescription || "", keywords: settings.seoKeywords || "", focusKeyword: settings.primaryKeyword || "" }
    : seo;
  return (
    <div>
      <AdminPageHeader title={`SEO ${page.label}`} />
      <SeoPageForm seoKey={key} title={page.label} initial={initial} />
    </div>
  );
}
