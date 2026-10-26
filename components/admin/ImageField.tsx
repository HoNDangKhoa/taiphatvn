"use client";

import { useState } from "react";
import { Input, Label } from "@/components/ui/input";

export function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-3">
        {value && <img src={value} alt="" className="h-16 w-16 rounded-lg object-contain" />}
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="/media/hoac-https://..." />
        <label className="cursor-pointer rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-semibold">
          {uploading ? "Đang tải…" : "Tải ảnh"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              const body = new FormData();
              body.set("file", file);
              const res = await fetch("/api/upload", { method: "POST", body });
              const data = await res.json();
              setUploading(false);
              if (data.url) onChange(data.url);
            }}
          />
        </label>
      </div>
    </div>
  );
}
