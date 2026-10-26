"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminCard, FormActionBar } from "@/components/admin/AdminChrome";
import { ImageField } from "@/components/admin/HomeForms";
import { Input, Label, Textarea } from "@/components/ui/input";
import { savePageSeo } from "@/lib/actions";
import type { PageSeo } from "@/lib/home";

export function SeoPageForm({ seoKey, title, initial }: { seoKey: string; title: string; initial: PageSeo }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [message, setMessage] = useState("");
  const [pending, start] = useTransition();
  const set = <K extends keyof PageSeo>(key: K, value: PageSeo[K]) => setValues((prev) => ({ ...prev, [key]: value }));
  const checks = useMemo(() => {
    const kw = values.focusKeyword.trim().toLowerCase();
    return [
      { ok: values.title.length >= 10 && values.title.length <= 70, label: "Độ dài tiêu đề phù hợp (10 - 70 ký tự)" },
      { ok: values.description.length >= 50 && values.description.length <= 160, label: "Độ dài mô tả phù hợp (50 - 160 ký tự)" },
      { ok: !!kw && values.title.toLowerCase().includes(kw), label: "Từ khóa xuất hiện trong tiêu đề" },
      { ok: !!kw && values.description.toLowerCase().includes(kw), label: "Từ khóa xuất hiện trong mô tả" },
      { ok: !!values.ogImage, label: "OG image đã có" },
      { ok: !!values.canonical, label: "Canonical URL đã có" },
      { ok: values.indexable, label: "Cho phép index" },
    ];
  }, [values]);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          await savePageSeo(seoKey, values);
          setMessage("Đã lưu SEO page.");
          router.refresh();
        });
      }}
    >
      <FormActionBar saving={pending} message={message} onReset={() => { setValues(initial); setMessage(""); }} onExit={() => router.push("/admin")} />
      <AdminCard title={`SEO — ${title}`}>
        <div className="grid gap-4">
          <div>
            <div className="mb-1 flex justify-between"><Label>Meta title</Label><span className="text-xs text-ink/40">{values.title.length} / 70</span></div>
            <Input value={values.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div>
            <div className="mb-1 flex justify-between"><Label>Meta description</Label><span className="text-xs text-ink/40">{values.description.length} / 160</span></div>
            <Textarea value={values.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div><Label>Từ khóa</Label><Input value={values.keywords} onChange={(e) => set("keywords", e.target.value)} /></div>
          <div><Label>Từ khóa chính</Label><Input value={values.focusKeyword} onChange={(e) => set("focusKeyword", e.target.value)} /></div>
          <div><Label>Canonical URL</Label><Input value={values.canonical} onChange={(e) => set("canonical", e.target.value)} /></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>OG site name</Label><Input value={values.ogSiteName} onChange={(e) => set("ogSiteName", e.target.value)} /></div>
            <div><Label>OG URL</Label><Input value={values.ogUrl} onChange={(e) => set("ogUrl", e.target.value)} /></div>
          </div>
          <ImageField label="OG image" value={values.ogImage} onChange={(ogImage) => set("ogImage", ogImage)} />
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={values.indexable} onChange={(e) => set("indexable", e.target.checked)} /> Cho phép Google index
          </label>
        </div>
      </AdminCard>
      <AdminCard title="Kiểm tra SEO">
        <ul className="space-y-1 text-sm">
          {checks.map((item) => <li key={item.label}>{item.ok ? "✓" : "•"} {item.label}</li>)}
        </ul>
      </AdminCard>
    </form>
  );
}
