"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ContentToolbar } from "@/components/admin/AdminChrome";
import { deletePosts, deleteProducts } from "@/lib/actions";
import { formatPrice } from "@/lib/utils";

export function ProductTable({
  rows,
}: {
  rows: { id: string; name: string; slug: string; label: string; price: number; image: string; visible: boolean; featured: boolean; categoryName: string }[];
}) {
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const router = useRouter();
  const list = useMemo(() => rows.filter((r) => `${r.name} ${r.label}`.toLowerCase().includes(q.toLowerCase())), [rows, q]);
  return (
    <div>
      <ContentToolbar createHref="/admin/products/new" search={q} onSearch={setQ} deleteDisabled={!picked.length} onDelete={async () => { if (!confirm("Xóa sản phẩm đã chọn?")) return; await deleteProducts(picked); setPicked([]); router.refresh(); }} />
      <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f8f8f8] text-xs tracking-wide text-ink/50 uppercase">
            <tr>
              <th className="p-3"></th>
              <th className="p-3">Ảnh</th>
              <th className="p-3">Tên</th>
              <th className="p-3">Loại</th>
              <th className="p-3">Giá</th>
              <th className="p-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-t border-black/5">
                <td className="p-3"><input type="checkbox" checked={picked.includes(r.id)} onChange={(e) => setPicked(e.target.checked ? [...picked, r.id] : picked.filter((id) => id !== r.id))} /></td>
                <td className="p-3"><img src={r.image} alt="" className="h-12 w-10 object-contain" /></td>
                <td className="p-3">
                  <Link href={`/admin/products/${r.id}`} className="font-semibold text-[#3f7d3a] hover:underline">{r.name}</Link>
                  <p className="text-xs text-ink/45">{r.categoryName} {r.featured ? "· nổi bật" : ""}</p>
                </td>
                <td className="p-3">{r.label}</td>
                <td className="p-3">{formatPrice(r.price)}</td>
                <td className="p-3">{r.visible ? "Hiện" : "Ẩn"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PostTable({ rows }: { rows: { id: string; title: string; slug: string; status: string; thumbnail: string | null }[] }) {
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const router = useRouter();
  const list = rows.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <ContentToolbar createHref="/admin/posts/new" search={q} onSearch={setQ} deleteDisabled={!picked.length} onDelete={async () => { if (!confirm("Xóa bài đã chọn?")) return; await deletePosts(picked); setPicked([]); router.refresh(); }} />
      <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f8f8f8] text-xs text-ink/50 uppercase"><tr><th className="p-3"></th><th className="p-3">Bài viết</th><th className="p-3">Trạng thái</th></tr></thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-t border-black/5">
                <td className="p-3"><input type="checkbox" checked={picked.includes(r.id)} onChange={(e) => setPicked(e.target.checked ? [...picked, r.id] : picked.filter((id) => id !== r.id))} /></td>
                <td className="p-3">
                  <Link className="font-semibold text-[#3f7d3a] hover:underline" href={`/admin/posts/${r.id}`}>{r.title}</Link>
                  <p className="text-xs text-ink/40">/tin-tuc/{r.slug}</p>
                </td>
                <td className="p-3">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
