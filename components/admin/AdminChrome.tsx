"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  actions,
}: {
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-semibold text-ink md:text-3xl">{title}</h1>
      {actions}
    </div>
  );
}

export function AdminCard({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-black/8 bg-white p-4 shadow-sm md:p-5", className)}>
      {title && (
        <div className="mb-4 flex items-center gap-2 border-b border-black/5 pb-3">
          <span className="text-[#3f7d3a]">☰</span>
          <h2 className="text-sm font-semibold md:text-base">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
}

export function FormActionBar({
  saving,
  message,
  onReset,
  onExit,
}: {
  saving?: boolean;
  message?: string;
  onReset?: () => void;
  onExit?: () => void;
}) {
  const { pending } = useFormStatus();
  const busy = Boolean(saving || pending);
  return (
    <>
      {busy && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/25 px-4 backdrop-blur-[1px]" role="status" aria-live="polite">
          <div className="flex min-w-[220px] items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#3f7d3a] border-t-transparent" />
            <div>
              <p className="text-sm font-semibold text-ink">Đang lưu…</p>
              <p className="text-xs text-ink/50">Vui lòng chờ trong giây lát</p>
            </div>
          </div>
        </div>
      )}
      <div className="sticky top-14 z-30 -mx-4 mb-4 flex flex-wrap items-center gap-2 border-b border-black/5 bg-[#f3f4f6]/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
        <button type="submit" name="stay" value="" disabled={busy} className="rounded-xl bg-[#3f7d3a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2f6230] disabled:opacity-60">
          {busy ? "Đang lưu…" : "Lưu"}
        </button>
        <button type="submit" name="stay" value="1" disabled={busy} className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60">
          {busy ? "Đang lưu…" : "Lưu tại trang"}
        </button>
        <button type="button" disabled={busy} onClick={onReset} className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-black/5 disabled:opacity-60">
          Làm lại
        </button>
        <button type="button" disabled={busy} onClick={onExit} className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60">
          Thoát
        </button>
        {message && <span className={cn("text-sm font-semibold", message.startsWith("Lỗi") ? "text-red-600" : "text-emerald-600")}>{message}</span>}
        {busy && !message && <span className="text-sm font-semibold text-[#3f7d3a]">Đang xử lý…</span>}
      </div>
    </>
  );
}

export function ContentToolbar({
  createHref,
  createLabel = "Thêm mới",
  search,
  onSearch,
  onDelete,
  deleteDisabled,
}: {
  createHref?: string;
  createLabel?: string;
  search?: string;
  onSearch?: (v: string) => void;
  onDelete?: () => void;
  deleteDisabled?: boolean;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      {createHref && (
        <Link href={createHref} className="inline-flex items-center gap-2 rounded-xl bg-[#3f7d3a] px-4 py-2.5 text-sm font-semibold text-white">
          <Plus size={16} /> {createLabel}
        </Link>
      )}
      {onDelete && (
        <button type="button" disabled={deleteDisabled} onClick={onDelete} className={cn("inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white", deleteDisabled ? "bg-[#f8b4b4]" : "bg-[#f87171]")}>
          <Trash2 size={16} /> Xóa tất cả
        </button>
      )}
      {onSearch && (
        <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Tìm kiếm nhanh" className="ml-auto w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#3f7d3a] md:max-w-sm" />
      )}
    </div>
  );
}
