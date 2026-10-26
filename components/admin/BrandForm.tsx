"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminCard, AdminPageHeader, FormActionBar } from "@/components/admin/AdminChrome";
import { ImageField } from "@/components/admin/HomeForms";
import { saveBrand } from "@/lib/actions";

export function BrandForm({ title, field, initial }: { title: string; field: "logoUrl" | "faviconUrl"; initial: string }) {
  const router = useRouter();
  const [url, setUrl] = useState(initial);
  const [message, setMessage] = useState("");
  const [pending, start] = useTransition();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => { await saveBrand(field, url); setMessage("Đã lưu."); });
      }}
    >
      <AdminPageHeader title={title} />
      <FormActionBar saving={pending} message={message} onReset={() => { setUrl(initial); setMessage(""); }} onExit={() => router.push("/admin")} />
      <AdminCard title="Tải ảnh">
        <ImageField label="Hình" value={url} onChange={setUrl} />
      </AdminCard>
    </form>
  );
}
