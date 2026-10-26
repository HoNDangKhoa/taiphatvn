"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminCard } from "@/components/admin/AdminChrome";
import { Input, Label, Textarea } from "@/components/ui/input";
import { saveSettings } from "@/lib/actions";

export type SettingsValues = {
  companyName: string;
  slogan: string;
  hotline: string;
  phone: string;
  zalo: string;
  email: string;
  address: string;
  taxCode: string;
  website: string;
  mapsEmbedUrl: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  messenger: string;
  copyright: string;
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string;
  primaryKeyword: string;
  headJs: string;
  bodyJs: string;
  googleAnalytics: string;
  mailerHost: string;
  mailerPort: string;
  mailerSecure: string;
  mailerEmail: string;
  mailerPassword: string;
  logoUrl: string;
  faviconUrl: string;
};

export function SettingsForm({ initial }: { initial: SettingsValues }) {
  const [values, setValues] = useState(initial);
  const [message, setMessage] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();
  const set = (k: keyof SettingsValues, v: string) => setValues((s) => ({ ...s, [k]: v }));
  const titleLen = values.metaTitle.length;
  const descLen = values.metaDescription.length;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        start(async () => {
          await saveSettings(fd);
          setMessage("Đã lưu thiết lập.");
          router.refresh();
        });
      }}
    >
      <input type="hidden" name="logoUrl" value={values.logoUrl} />
      <input type="hidden" name="faviconUrl" value={values.faviconUrl} />
      <div className="flex flex-wrap gap-2">
        <button disabled={pending} className="rounded-xl bg-[#3f7d3a] px-4 py-2.5 text-sm font-semibold text-white">{pending ? "Đang lưu…" : "Lưu"}</button>
        <button type="button" className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold" onClick={() => setValues(initial)}>Làm lại</button>
        {message && <span className="self-center text-sm font-semibold text-emerald-600">{message}</span>}
      </div>

      <AdminCard title="Thông tin website">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tên công ty" name="companyName" value={values.companyName} onChange={(v) => set("companyName", v)} />
          <Field label="Slogan" name="slogan" value={values.slogan} onChange={(v) => set("slogan", v)} />
          <Field label="Hotline" name="hotline" value={values.hotline} onChange={(v) => set("hotline", v)} />
          <Field label="Điện thoại" name="phone" value={values.phone} onChange={(v) => set("phone", v)} />
          <Field label="Zalo" name="zalo" value={values.zalo} onChange={(v) => set("zalo", v)} />
          <Field label="Email" name="email" value={values.email} onChange={(v) => set("email", v)} />
          <Field label="Website" name="website" value={values.website} onChange={(v) => set("website", v)} />
          <Field label="Mã số thuế" name="taxCode" value={values.taxCode} onChange={(v) => set("taxCode", v)} />
          <div className="md:col-span-2"><Field label="Địa chỉ" name="address" value={values.address} onChange={(v) => set("address", v)} area /></div>
          <div className="md:col-span-2"><Field label="Google Map embed URL" name="mapsEmbedUrl" value={values.mapsEmbedUrl} onChange={(v) => set("mapsEmbedUrl", v)} /></div>
          <div className="md:col-span-2"><Field label="Copyright" name="copyright" value={values.copyright} onChange={(v) => set("copyright", v)} /></div>
        </div>
      </AdminCard>

      <AdminCard title="Mạng xã hội">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Facebook" name="facebook" value={values.facebook} onChange={(v) => set("facebook", v)} />
          <Field label="Instagram" name="instagram" value={values.instagram} onChange={(v) => set("instagram", v)} />
          <Field label="TikTok" name="tiktok" value={values.tiktok} onChange={(v) => set("tiktok", v)} />
          <Field label="Messenger" name="messenger" value={values.messenger} onChange={(v) => set("messenger", v)} />
        </div>
      </AdminCard>

      <AdminCard title="SEO trang chủ">
        <div className="grid gap-4">
          <div>
            <div className="mb-1 flex justify-between"><Label>Meta title</Label><span className="text-xs text-ink/40">{titleLen} / 70</span></div>
            <Input name="metaTitle" value={values.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} />
          </div>
          <div>
            <div className="mb-1 flex justify-between"><Label>Meta description</Label><span className="text-xs text-ink/40">{descLen} / 160</span></div>
            <Textarea name="metaDescription" value={values.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} />
          </div>
          <Field label="Từ khóa chính" name="primaryKeyword" value={values.primaryKeyword} onChange={(v) => set("primaryKeyword", v)} />
          <Field label="Từ khóa SEO" name="seoKeywords" value={values.seoKeywords} onChange={(v) => set("seoKeywords", v)} />
          <ul className="space-y-1 text-sm">
            <li>{titleLen >= 10 && titleLen <= 70 ? "✓" : "•"} Độ dài tiêu đề 10–70 ký tự</li>
            <li>{descLen >= 50 && descLen <= 160 ? "✓" : "•"} Độ dài mô tả 50–160 ký tự</li>
            <li>{values.primaryKeyword && values.metaTitle.toLowerCase().includes(values.primaryKeyword.toLowerCase()) ? "✓" : "•"} Từ khóa trong tiêu đề</li>
          </ul>
        </div>
      </AdminCard>

      <AdminCard title="Cấu hình mailer">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Host" name="mailerHost" value={values.mailerHost} onChange={(v) => set("mailerHost", v)} />
          <Field label="Port" name="mailerPort" value={values.mailerPort} onChange={(v) => set("mailerPort", v)} />
          <Field label="Secure (true/false)" name="mailerSecure" value={values.mailerSecure} onChange={(v) => set("mailerSecure", v)} />
          <Field label="Email gửi" name="mailerEmail" value={values.mailerEmail} onChange={(v) => set("mailerEmail", v)} />
          <div className="md:col-span-2"><Field label="Mật khẩu ứng dụng" name="mailerPassword" value={values.mailerPassword} onChange={(v) => set("mailerPassword", v)} /></div>
        </div>
      </AdminCard>

      <AdminCard title="Mã nhúng">
        <div className="grid gap-4">
          <Field label="Google Analytics" name="googleAnalytics" value={values.googleAnalytics} onChange={(v) => set("googleAnalytics", v)} area />
          <Field label="Head JS" name="headJs" value={values.headJs} onChange={(v) => set("headJs", v)} area />
          <Field label="Body JS" name="bodyJs" value={values.bodyJs} onChange={(v) => set("bodyJs", v)} area />
        </div>
      </AdminCard>
    </form>
  );
}

function Field({ label, name, value, onChange, area }: { label: string; name: string; value: string; onChange: (v: string) => void; area?: boolean }) {
  return (
    <div>
      <Label>{label}</Label>
      {area ? <Textarea name={name} value={value} onChange={(e) => onChange(e.target.value)} /> : <Input name={name} value={value} onChange={(e) => onChange(e.target.value)} />}
    </div>
  );
}
