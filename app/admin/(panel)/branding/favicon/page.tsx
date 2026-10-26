import { BrandForm } from "@/components/admin/BrandForm";
import { getSettings } from "@/lib/queries";

export default async function FaviconPage() {
  const s = await getSettings();
  return <BrandForm title="Favicon" field="faviconUrl" initial={s?.faviconUrl || "/media/logo.png"} />;
}
