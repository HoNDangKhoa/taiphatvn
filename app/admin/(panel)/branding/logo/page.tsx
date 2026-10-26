import { BrandForm } from "@/components/admin/BrandForm";
import { getSettings } from "@/lib/queries";

export default async function LogoPage() {
  const s = await getSettings();
  return <BrandForm title="Logo" field="logoUrl" initial={s?.logoUrl || "/media/logo.png"} />;
}
