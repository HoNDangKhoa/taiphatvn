"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminCard, FormActionBar } from "@/components/admin/AdminChrome";
import { Input, Label } from "@/components/ui/input";
import { saveSocial } from "@/lib/actions";

export function SocialForm({ initial }: { initial: { facebook: string; instagram: string; tiktok: string; messenger: string } }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [message, setMessage] = useState("");
  const [pending, start] = useTransition();
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        start(async () => { await saveSocial(fd); setMessage("Đã lưu mạng xã hội."); router.refresh(); });
      }}
    >
      <FormActionBar saving={pending} message={message} onReset={() => { setValues(initial); setMessage(""); }} onExit={() => router.push("/admin")} />
      <AdminCard title="Mạng xã hội Footer">
        <div className="grid gap-4 md:grid-cols-2">
          {(["facebook", "instagram", "tiktok", "messenger"] as const).map((key) => (
            <div key={key}>
              <Label>{key}</Label>
              <Input name={key} value={values[key]} onChange={(e) => setValues((s) => ({ ...s, [key]: e.target.value }))} />
            </div>
          ))}
        </div>
      </AdminCard>
    </form>
  );
}
