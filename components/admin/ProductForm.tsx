"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminCard, FormActionBar } from "@/components/admin/AdminChrome";
import { ImageField } from "@/components/admin/ImageField";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

const RichEditor = dynamic(() => import("@/components/admin/RichEditor").then((m) => m.RichEditor), {
  ssr: false,
  loading: () => <div className="h-40 animate-pulse rounded-xl bg-black/5" />,
});
import { saveProduct } from "@/lib/actions";
import { uid } from "@/lib/utils";
import type { Variant } from "@/lib/queries";

type Cat = { id: string; name: string };
type Initial = {
  id?: string;
  name: string;
  slug: string;
  label: string;
  summary: string;
  description: string;
  specs: string;
  price: number;
  image: string;
  gallery: string[];
  variants: Variant[];
  categoryId: string;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
};

export function ProductForm({ initial, categories }: { initial: Initial; categories: Cat[] }) {
  const router = useRouter();
  const [image, setImage] = useState(initial.image);
  const [variants, setVariants] = useState<Variant[]>(initial.variants);
  const [gallery, setGallery] = useState(initial.gallery.join("\n"));
  return (
    <form action={saveProduct} className="space-y-4">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="image" value={image} />
      <input type="hidden" name="variants" value={JSON.stringify(variants)} />
      <input type="hidden" name="gallery" value={JSON.stringify(gallery.split("\n").map((s) => s.trim()).filter(Boolean))} />
      <FormActionBar
        onReset={() => { setImage(initial.image); setVariants(initial.variants); setGallery(initial.gallery.join("\n")); }}
        onExit={() => router.push("/admin/products")}
      />
      <AdminCard title="Thông tin sản phẩm">
        <div className="grid gap-4 md:grid-cols-2">
          <div><Label>Tên</Label><Input name="name" defaultValue={initial.name} required /></div>
          <div><Label>Slug</Label><Input name="slug" defaultValue={initial.slug} placeholder="tu-dong-neu-de-trong" /></div>
          <div><Label>Nhãn loại</Label><Input name="label" defaultValue={initial.label} placeholder="Premium Tea / Black Tea" /></div>
          <div><Label>Giá (VNĐ, 0 = Liên hệ)</Label><Input name="price" type="number" defaultValue={initial.price} /></div>
          <div>
            <Label>Danh mục</Label>
            <Select name="categoryId" defaultValue={initial.categoryId}>
              <option value="">—</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <div><Label>Thứ tự</Label><Input name="sortOrder" type="number" defaultValue={initial.sortOrder} /></div>
          <div className="md:col-span-2"><RichEditor name="summary" label="Mô tả (vi):" defaultValue={initial.summary} height={260} /></div>
          <div className="md:col-span-2"><RichEditor name="description" label="Nội dung (vi):" defaultValue={initial.description} /></div>
          <div className="md:col-span-2"><Label>Thông số</Label><Textarea name="specs" defaultValue={initial.specs} /></div>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="featured" defaultChecked={initial.featured} /> Nổi bật trang chủ</label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="visible" defaultChecked={initial.visible} /> Hiển thị</label>
        </div>
      </AdminCard>
      <AdminCard title="Hình ảnh">
        <ImageField label="Ảnh đại diện" value={image} onChange={setImage} />
        <div className="mt-3">
          <Label>Gallery (mỗi dòng một đường dẫn)</Label>
          <Textarea value={gallery} onChange={(e) => setGallery(e.target.value)} rows={4} placeholder="/media/... hoặc https://...blob.../uploads/..." />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <label className="cursor-pointer rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-semibold">
              Tải ảnh vào gallery
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  const body = new FormData();
                  body.set("file", file);
                  const res = await fetch("/api/upload", { method: "POST", body });
                  const data = (await res.json()) as { url?: string };
                  if (data.url) setGallery((prev) => (prev.trim() ? `${prev.trim()}\n${data.url}` : data.url!));
                }}
              />
            </label>
            <a href="/admin/media" className="text-sm font-semibold text-[#3f7d3a] hover:underline">Mở thư viện media để copy đường dẫn</a>
          </div>
        </div>
      </AdminCard>
      <AdminCard title="Biến thể khối lượng">
        <div className="space-y-3">
          {variants.map((v, i) => (
            <div key={v.id} className="grid gap-2 rounded-xl bg-[#f8f8f8] p-3 md:grid-cols-4">
              <Input value={v.name} placeholder="500g" onChange={(e) => { const next = [...variants]; next[i] = { ...v, name: e.target.value }; setVariants(next); }} />
              <Input type="number" value={v.price} onChange={(e) => { const next = [...variants]; next[i] = { ...v, price: Number(e.target.value) }; setVariants(next); }} />
              <Input value={v.image || ""} placeholder="Ảnh biến thể" onChange={(e) => { const next = [...variants]; next[i] = { ...v, image: e.target.value }; setVariants(next); }} />
              <button type="button" className="text-sm font-semibold text-red-600" onClick={() => setVariants(variants.filter((x) => x.id !== v.id))}>Xóa</button>
            </div>
          ))}
          <button type="button" className="text-sm font-semibold text-[#3f7d3a]" onClick={() => setVariants([...variants, { id: uid("var"), name: "500g", price: initial.price || 0 }])}>Thêm biến thể</button>
        </div>
      </AdminCard>
    </form>
  );
}
