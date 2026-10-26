"use client";

import { useState, useTransition } from "react";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminChrome";
import { Input, Label } from "@/components/ui/input";
import { changePassword } from "@/lib/actions";

export function AccountForm({ name }: { name: string }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  return (
    <div>
      <AdminPageHeader title="Tài khoản" />
      <form
        className="max-w-lg"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          start(async () => {
            const res = await changePassword(fd);
            if (!res.ok) { setError(res.error); setMessage(""); return; }
            setError("");
            setMessage("Đã cập nhật tài khoản.");
          });
        }}
      >
        <AdminCard title="Đổi thông tin">
          <div className="grid gap-3">
            <div><Label>Tên hiển thị</Label><Input name="name" defaultValue={name} /></div>
            <div><Label>Mật khẩu hiện tại</Label><Input name="current" type="password" required /></div>
            <div><Label>Mật khẩu mới</Label><Input name="next" type="password" required /></div>
            <div><Label>Nhập lại mật khẩu mới</Label><Input name="confirm" type="password" required /></div>
            <button disabled={pending} className="rounded-xl bg-[#3f7d3a] px-4 py-2.5 text-sm font-semibold text-white">{pending ? "Đang lưu…" : "Lưu"}</button>
            {message && <p className="text-sm font-semibold text-emerald-600">{message}</p>}
            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
          </div>
        </AdminCard>
      </form>
    </div>
  );
}
