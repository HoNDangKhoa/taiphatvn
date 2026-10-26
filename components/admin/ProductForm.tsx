"use client";

import { useState } from "react";
import { AdminCard } from "@/components/admin/AdminChrome";
import { ImageField } from "@/components/admin/HomeForms";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
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
  const [image, setImage] = useState(initial.image);
  const [variants, setVariants] = useState<Variant[]>(initial.variants);
  const [gallery, setGallery] = useState(initial.gallery.join("\n"));
  return (
    <form action={saveProduct} className="space-y-4">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="image" value={image} />
      <input type="hidden" name="variants" value={JSON.stringify(variants)} />
      <input type="hidden" name="gallery" value={JSON.stringify(gallery.split("\n").map((s) => s.trim()).filter(Boolean))} />
      <div className="flex gap-2">
        <button className="rounded-xl bg-[#3f7d3a] px-4 py-2.5 text-sm font-semibold text-white">Lưu</button>
      </div>
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
          <div className="md:col-span-2"><Label>Mô tả ngắn</Label><Textarea name="summary" defaultValue={initial.summary} /></div>
          <div className="md:col-span-2"><Label>Nội dung chi tiết (HTML)</Label><Textarea name="description" rows={8} defaultValue={initial.description} /></div>
          <div className="md:col-span-2"><Label>Thông số</Label><Textarea name="specs" defaultValue={initial.specs} /></div>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="featured" defaultChecked={initial.featured} /> Nổi bật trang chủ</label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="visible" defaultChecked={initial.visible} /> Hiển thị</label>
        </div>
      </AdminCard>
      <AdminCard title="Hình ảnh">
        <ImageField label="Ảnh đại diện" value={image} onChange={setImage} />
        <div className="mt-3">
          <Label>Gallery (mỗi dòng một đường dẫn)</Label>
          <Textarea value={gallery} onChange={(e) => setGallery(e.target.value)} rows={4} />
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
