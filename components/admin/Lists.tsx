"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { ContentToolbar } from "@/components/admin/AdminChrome";
import { deletePosts, deleteProducts, togglePost, toggleProduct } from "@/lib/actions";
import { cn } from "@/lib/utils";

function Switch({ checked, label, onChange }: { checked: boolean; label: string; onChange: (next: boolean) => void }) {
  const [on, setOn] = useState(checked);
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={pending}
      className={cn("relative h-6 w-11 rounded-full transition disabled:opacity-70", on ? "bg-[#3f7d3a]" : "bg-black/15")}
      onClick={() => {
        const next = !on;
        setOn(next);
        startTransition(() => onChange(next));
      }}
    >
      <span className={cn("absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition", on && "translate-x-5")} />
    </button>
  );
}

function ActionButtons({ viewHref, editHref, onDelete }: { viewHref: string; editHref: string; onDelete: () => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href={viewHref} target="_blank" className="inline-flex items-center gap-1 rounded-lg border border-black/10 px-3 py-1.5 text-sm font-semibold hover:bg-black/[0.03]">
        <ExternalLink className="h-3.5 w-3.5" /> Xem
      </Link>
      <Link href={editHref} className="inline-flex items-center gap-1 rounded-lg border border-black/10 px-3 py-1.5 text-sm font-semibold hover:bg-black/[0.03]">
        <Pencil className="h-3.5 w-3.5" /> Sửa
      </Link>
      <button type="button" onClick={onDelete} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
        <Trash2 className="h-3.5 w-3.5" /> Xóa
      </button>
    </div>
  );
}

export function ProductTable({
  rows,
}: {
  rows: { id: string; name: string; slug: string; image: string; visible: boolean; isNew: boolean; views: number; categoryName: string }[];
}) {
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const router = useRouter();
  const list = rows.filter((r) => `${r.name} ${r.categoryName}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <ContentToolbar createHref="/admin/products/new" search={q} onSearch={setQ} deleteDisabled={!picked.length} onDelete={async () => { if (!confirm("Xóa sản phẩm đã chọn?")) return; await deleteProducts(picked); setPicked([]); router.refresh(); }} />
      <div className="overflow-x-auto rounded-2xl border border-black/8 bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-[#f8f8f8] text-xs tracking-wide text-ink/50 uppercase">
            <tr>
              <th className="p-3" />
              <th className="p-3">Ảnh</th>
              <th className="p-3">Tên</th>
              <th className="p-3">New</th>
              <th className="p-3">Lượt xem</th>
              <th className="p-3">Hiển thị</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-t border-black/5">
                <td className="p-3"><input type="checkbox" checked={picked.includes(r.id)} onChange={(e) => setPicked(e.target.checked ? [...picked, r.id] : picked.filter((id) => id !== r.id))} /></td>
                <td className="p-3"><img src={r.image} alt="" className="h-14 w-12 object-contain" /></td>
                <td className="p-3">
                  <Link href={`/admin/products/${r.id}`} className="font-semibold text-[#3f7d3a] hover:underline">{r.name}</Link>
                  <p className="text-xs text-ink/45">{r.categoryName}</p>
                </td>
                <td className="p-3"><Switch checked={r.isNew} label={`Mới: ${r.name}`} onChange={(next) => toggleProduct(r.id, "isNew", next)} /></td>
                <td className="p-3 font-semibold">{r.views}</td>
                <td className="p-3"><Switch checked={r.visible} label={`Hiển thị: ${r.name}`} onChange={(next) => toggleProduct(r.id, "visible", next)} /></td>
                <td className="p-3">
                  <ActionButtons
                    viewHref={`/san-pham/${r.slug}`}
                    editHref={`/admin/products/${r.id}`}
                    onDelete={async () => { if (!confirm(`Xóa ${r.name}?`)) return; await deleteProducts([r.id]); router.refresh(); }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PostTable({
  rows,
}: {
  rows: { id: string; title: string; slug: string; status: string; thumbnail: string | null; views: number; isNew: boolean }[];
}) {
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const router = useRouter();
  const list = rows.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <ContentToolbar createHref="/admin/posts/new" search={q} onSearch={setQ} deleteDisabled={!picked.length} onDelete={async () => { if (!confirm("Xóa bài đã chọn?")) return; await deletePosts(picked); setPicked([]); router.refresh(); }} />
      <div className="overflow-x-auto rounded-2xl border border-black/8 bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-[#f8f8f8] text-xs tracking-wide text-ink/50 uppercase">
            <tr>
              <th className="p-3" />
              <th className="p-3">Ảnh</th>
              <th className="p-3">Tiêu đề</th>
              <th className="p-3">New</th>
              <th className="p-3">Lượt xem</th>
              <th className="p-3">Hiển thị</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-t border-black/5">
                <td className="p-3"><input type="checkbox" checked={picked.includes(r.id)} onChange={(e) => setPicked(e.target.checked ? [...picked, r.id] : picked.filter((id) => id !== r.id))} /></td>
                <td className="p-3">{r.thumbnail ? <img src={r.thumbnail} alt="" className="h-14 w-16 rounded-lg object-cover" /> : <span className="text-ink/30">—</span>}</td>
                <td className="p-3">
                  <Link className="font-semibold text-[#3f7d3a] hover:underline" href={`/admin/posts/${r.id}`}>{r.title}</Link>
                  <p className="text-xs text-ink/40">/tin-tuc/{r.slug}</p>
                </td>
                <td className="p-3"><Switch checked={r.isNew} label={`Mới: ${r.title}`} onChange={(next) => togglePost(r.id, "isNew", next)} /></td>
                <td className="p-3 font-semibold">{r.views}</td>
                <td className="p-3"><Switch checked={r.status === "PUBLISHED"} label={`Hiển thị: ${r.title}`} onChange={(next) => togglePost(r.id, "visible", next)} /></td>
                <td className="p-3">
                  <ActionButtons
                    viewHref={`/tin-tuc/${r.slug}`}
                    editHref={`/admin/posts/${r.id}`}
                    onDelete={async () => { if (!confirm(`Xóa ${r.title}?`)) return; await deletePosts([r.id]); router.refresh(); }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
