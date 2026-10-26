import { AdminPageHeader } from "@/components/admin/AdminChrome";
import { SocialForm } from "@/components/admin/SocialForm";
import { getSettings } from "@/lib/queries";

export default async function SocialPage() {
  const s = await getSettings();
  return (
    <div>
      <AdminPageHeader title="Mạng xã hội Footer" />
      <SocialForm initial={{ facebook: s?.facebook || "", instagram: s?.instagram || "", tiktok: s?.tiktok || "", messenger: s?.messenger || "" }} />
    </div>
  );
}
