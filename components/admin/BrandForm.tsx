"use client";

import { useState, useTransition } from "react";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminChrome";
import { ImageField } from "@/components/admin/HomeForms";
import { saveBrand } from "@/lib/actions";

export function BrandForm({ title, field, initial }: { title: string; field: "logoUrl" | "faviconUrl"; initial: string }) {
  const [url, setUrl] = useState(initial);
  const [message, setMessage] = useState("");
  const [pending, start] = useTransition();
  return (
    <div>
      <AdminPageHeader title={title} />
      <AdminCard title="Tải ảnh">
        <ImageField label="Hình" value={url} onChange={setUrl} />
        <button
          type="button"
          disabled={pending}
          className="mt-4 rounded-xl bg-[#3f7d3a] px-4 py-2.5 text-sm font-semibold text-white"
          onClick={() => start(async () => { await saveBrand(field, url); setMessage("Đã lưu."); })}
        >
          {pending ? "Đang lưu…" : "Lưu"}
        </button>
        {message && <p className="mt-2 text-sm font-semibold text-emerald-600">{message}</p>}
      </AdminCard>
    </div>
  );
}
