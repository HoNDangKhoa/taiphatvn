import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";
import { PageHero } from "@/components/site/PageHero";
import { getPageSeo, getSettings } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("contact");
  return { title: seo.title || "Liên hệ", description: seo.description || undefined, keywords: seo.keywords || undefined };
}

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <div className="bg-[#FBF4EC] pb-16">
      <PageHero title="Liên hệ" crumb="Liên hệ" />
      <div className="mx-auto grid max-w-[1100px] gap-6 px-5 lg:grid-cols-2">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl text-[#8B1E1F]">{settings?.companyName}</h2>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-[#5c463c]">
            <li>Địa chỉ: {settings?.address}</li>
            <li>Điện thoại: {settings?.phone}</li>
            <li>Email: {settings?.email}</li>
            <li>MST: {settings?.taxCode}</li>
          </ul>
          {settings?.mapsEmbedUrl && (
            <iframe title="Bản đồ" src={settings.mapsEmbedUrl} className="mt-5 h-64 w-full rounded-2xl border-0" loading="lazy" />
          )}
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
