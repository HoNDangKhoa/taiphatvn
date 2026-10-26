import Link from "next/link";
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
          <Trash2 size={16} /> Xóa đã chọn
        </button>
      )}
      {onSearch && (
        <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Tìm kiếm nhanh" className="ml-auto w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#3f7d3a] md:max-w-sm" />
      )}
    </div>
  );
}
