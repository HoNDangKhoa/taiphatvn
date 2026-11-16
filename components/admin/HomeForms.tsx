"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { AdminCard, AdminPageHeader, FormActionBar } from "@/components/admin/AdminChrome";
import { ImageField } from "@/components/admin/ImageField";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { saveHomeSection } from "@/lib/actions";
import {
  newBadge,
  newFaq,
  newImage,
  newLink,
  newRecipe,
  newReview,
  newSpecRow,
  newTag,
  type BannerData,
  type HomeSectionKey,
} from "@/lib/home";
function SaveBar({ pending, message, onReset }: { pending: boolean; message: string; onReset: () => void }) {
  const router = useRouter();
  return (
    <FormActionBar
      saving={pending}
      message={message}
      onReset={onReset}
      onExit={() => router.push("/admin")}
    />
  );
}

function SectionForm<K extends HomeSectionKey>({
  sectionKey,
  title,
  description,
  initial,
  children,
}: {
  sectionKey: K;
  title: string;
  description?: string;
  initial: BannerData[K];
  children: (value: BannerData[K], set: (next: BannerData[K]) => void) => React.ReactNode;
}) {
  const router = useRouter();
  const snapshot = useRef(initial);
  const [value, setValue] = useState(initial);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  return (
    <div>
      <AdminPageHeader
        title={title}
        actions={<Link href="/" target="_blank" className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold">Xem trang chủ ↗</Link>}
      />
      {description && <p className="mb-4 text-sm text-ink/55">{description}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            try {
              await saveHomeSection(sectionKey, value);
              snapshot.current = value;
              setMessage("Đã lưu.");
              router.refresh();
            } catch (err) {
              setMessage(`Lỗi: ${err instanceof Error ? err.message : "không lưu được"}`);
            }
          });
        }}
      >
        <SaveBar pending={pending} message={message} onReset={() => { setValue(snapshot.current); setMessage(""); }} />
        <div className="space-y-4">{children(value, setValue)}</div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, multiline, rows = 3, hint }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; rows?: number; hint?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      {multiline ? <Textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} /> : <Input value={value} onChange={(e) => onChange(e.target.value)} />}
      {hint && <p className="mt-1 text-xs text-ink/45">{hint}</p>}
    </div>
  );
}

function move<T>(list: T[], index: number, dir: -1 | 1) {
  const next = [...list];
  const target = index + dir;
  if (target < 0 || target >= next.length) return list;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function HeaderEditor({ initial }: { initial: BannerData["header"] }) {
  return (
    <SectionForm sectionKey="header" title="Thanh menu (Header)" description="Logo giữa, menu trái, hotline và nút Đặt trà ngay bên phải." initial={initial}>
      {(value, set) => (
        <AdminCard title="Menu và nút">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Chữ hotline" value={value.hotlineLabel} onChange={(hotlineLabel) => set({ ...value, hotlineLabel })} />
            <Field label="Chữ nút đặt trà" value={value.ctaLabel} onChange={(ctaLabel) => set({ ...value, ctaLabel })} />
            <Field label="Link nút đặt trà" value={value.ctaHref} onChange={(ctaHref) => set({ ...value, ctaHref })} hint="Mặc định mở giỏ / form đặt trà." />
          </div>
          <div className="mt-4 space-y-3">
            {value.links.map((link, i) => (
              <div key={link.id} className="grid gap-2 rounded-xl bg-[#f8f8f8] p-3 md:grid-cols-[1fr_1fr_auto]">
                <Input value={link.label} onChange={(e) => { const links = [...value.links]; links[i] = { ...link, label: e.target.value }; set({ ...value, links }); }} />
                <Input value={link.href} onChange={(e) => { const links = [...value.links]; links[i] = { ...link, href: e.target.value }; set({ ...value, links }); }} />
                <div className="flex gap-1">
                  <button type="button" onClick={() => set({ ...value, links: move(value.links, i, -1) })}><ArrowUp size={16} /></button>
                  <button type="button" onClick={() => set({ ...value, links: move(value.links, i, 1) })}><ArrowDown size={16} /></button>
                  <button type="button" onClick={() => set({ ...value, links: value.links.filter((x) => x.id !== link.id) })}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
            <button type="button" className="inline-flex items-center gap-1 text-sm font-semibold text-[#3f7d3a]" onClick={() => set({ ...value, links: [...value.links, newLink()] })}><Plus size={14} /> Thêm menu</button>
          </div>
        </AdminCard>
      )}
    </SectionForm>
  );
}

export function HeroEditor({ initial }: { initial: BannerData["hero"] }) {
  return (
    <SectionForm
      sectionKey="hero"
      title="Hero / Banner liveshow"
      description="Ảnh nền full-bleed phía sau logo + tiêu đề trang chủ. Tải ảnh ngang độ phân giải cao (Full HD trở lên) để hiển thị đẹp trên PC và mobile."
      initial={initial}
    >
      {(value, set) => (
        <>
          <AdminCard title="Ảnh nền liveshow">
            <div className="grid gap-4">
              <ImageField
                label="Ảnh nền banner / liveshow"
                value={value.image}
                onChange={(image) => set({ ...value, image })}
              />
              {value.image ? (
                <img
                  src={value.image}
                  alt="Xem trước nền liveshow"
                  className="max-h-56 w-full rounded-xl object-cover"
                />
              ) : (
                <p className="text-sm text-ink/45">Chưa có ảnh — trang chủ sẽ dùng /media/hill-bg.jpg.</p>
              )}
              <p className="text-xs text-ink/45">
                Gợi ý: ảnh đồi trà ngang 1920×1080 trở lên. Sau khi tải, bấm Lưu để cập nhật trang chủ.
              </p>
            </div>
          </AdminCard>
          <AdminCard title="Nội dung chữ">
            <div className="grid gap-4">
              <Field label="Tiêu đề" value={value.title} onChange={(title) => set({ ...value, title })} />
              <Field label="Phụ đề" value={value.subtitle} onChange={(subtitle) => set({ ...value, subtitle })} />
              <Field label="Mô tả" value={value.description} onChange={(description) => set({ ...value, description })} multiline rows={5} />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nút đặc" value={value.primaryLabel} onChange={(primaryLabel) => set({ ...value, primaryLabel })} />
                <Field label="Link nút đặc" value={value.primaryHref} onChange={(primaryHref) => set({ ...value, primaryHref })} />
                <Field label="Hotline / nút viền" value={value.secondaryLabel} onChange={(secondaryLabel) => set({ ...value, secondaryLabel })} />
              </div>
            </div>
          </AdminCard>
          <AdminCard title="3 thẻ tag">
            {value.tags.map((tag, i) => (
              <div key={tag.id} className="mb-2 grid gap-2 md:grid-cols-[1fr_160px_auto]">
                <Input value={tag.text} onChange={(e) => { const tags = [...value.tags]; tags[i] = { ...tag, text: e.target.value }; set({ ...value, tags }); }} />
                <Select value={tag.tone} onChange={(e) => { const tags = [...value.tags]; tags[i] = { ...tag, tone: e.target.value as typeof tag.tone }; set({ ...value, tags }); }}>
                  <option value="light">Nền sáng</option>
                  <option value="solid">Nâu đặc</option>
                  <option value="outline">Viền</option>
                </Select>
                <button type="button" onClick={() => set({ ...value, tags: value.tags.filter((t) => t.id !== tag.id) })}><Trash2 size={16} /></button>
              </div>
            ))}
            <button type="button" className="text-sm font-semibold text-[#3f7d3a]" onClick={() => set({ ...value, tags: [...value.tags, newTag()] })}>Thêm tag</button>
          </AdminCard>
          <AdminCard title="Badge trên ảnh">
            {value.badges.map((b, i) => (
              <div key={b.id} className="mb-2 flex gap-2">
                <Input value={b.text} onChange={(e) => { const badges = [...value.badges]; badges[i] = { ...b, text: e.target.value }; set({ ...value, badges }); }} />
                <button type="button" onClick={() => set({ ...value, badges: value.badges.filter((x) => x.id !== b.id) })}><Trash2 size={16} /></button>
              </div>
            ))}
            <button type="button" className="text-sm font-semibold text-[#3f7d3a]" onClick={() => set({ ...value, badges: [...value.badges, newBadge()] })}>Thêm badge</button>
          </AdminCard>
        </>
      )}
    </SectionForm>
  );
}

export function StoryEditor({ initial }: { initial: BannerData["story"] }) {
  return (
    <SectionForm
      sectionKey="story"
      title="Giới thiệu sản phẩm"
      description="Khối chữ giữa hero và danh sách sản phẩm trên trang chủ (nền giấy trà)."
      initial={initial}
    >
      {(v, set) => (
        <AdminCard title="Nội dung giới thiệu">
          <div className="grid gap-4">
            <Field label="Eyebrow" value={v.eyebrow} onChange={(eyebrow) => set({ ...v, eyebrow })} />
            <Field label="Tiêu đề" value={v.title} onChange={(title) => set({ ...v, title })} />
            <Field label="Mô tả" value={v.description} onChange={(description) => set({ ...v, description })} multiline rows={5} />
            <ImageField label="Ảnh phụ (không bắt buộc trên layout mới)" value={v.image} onChange={(image) => set({ ...v, image })} />
            <Field label="Chữ con dấu (dự phòng)" value={v.sealText} onChange={(sealText) => set({ ...v, sealText })} />
          </div>
        </AdminCard>
      )}
    </SectionForm>
  );
}

export function ProductsSectionEditor({ initial }: { initial: BannerData["products"] }) {
  return (
    <SectionForm
      sectionKey="products"
      title="Sản phẩm chủ lực"
      description="Tiêu đề khối xen kẽ Hồng trà / Trà lài. Ảnh, giá và slug lấy từ Quản lý sản phẩm — bấm ảnh trên trang chủ sẽ vào chi tiết."
      initial={initial}
    >
      {(v, set) => (
        <AdminCard title="Nội dung khối">
          <div className="grid gap-4">
            <Field label="Tiêu đề" value={v.title} onChange={(title) => set({ ...v, title })} />
            <Field label="Mô tả" value={v.description} onChange={(description) => set({ ...v, description })} multiline />
            <Field label="Nút xem tất cả" value={v.ctaLabel} onChange={(ctaLabel) => set({ ...v, ctaLabel })} />
            <Field label="Link" value={v.ctaHref} onChange={(ctaHref) => set({ ...v, ctaHref })} />
          </div>
        </AdminCard>
      )}
    </SectionForm>
  );
}

export function GalleryEditor({ initial }: { initial: BannerData["gallery"] }) {
  return (
    <SectionForm
      sectionKey="gallery"
      title="Gallery sản phẩm"
      description="Ảnh bo góc trên trang chủ. Điền link sản phẩm (vd. /san-pham/tra-lai-tai-phat) để bấm vào mở trang chi tiết."
      initial={initial}
    >
      {(v, set) => (
        <AdminCard title="Tiêu đề và ảnh">
          <div className="grid gap-4">
            <Field label="Tiêu đề" value={v.title} onChange={(title) => set({ ...v, title })} />
            <Field label="Phụ đề" value={v.subtitle} onChange={(subtitle) => set({ ...v, subtitle })} />
            <Field label="Chữ con dấu (dự phòng)" value={v.sealText} onChange={(sealText) => set({ ...v, sealText })} />
            {v.images.map((img, i) => (
              <div key={img.id} className="rounded-xl bg-[#f8f8f8] p-3">
                <div className="mb-2 flex gap-2">
                  <button type="button" onClick={() => set({ ...v, images: move(v.images, i, -1) })}><ArrowUp size={16} /></button>
                  <button type="button" onClick={() => set({ ...v, images: move(v.images, i, 1) })}><ArrowDown size={16} /></button>
                  <button type="button" onClick={() => set({ ...v, images: v.images.filter((x) => x.id !== img.id) })}><Trash2 size={16} /></button>
                </div>
                <ImageField label={`Ảnh ${i + 1}`} value={img.src} onChange={(src) => { const images = [...v.images]; images[i] = { ...img, src }; set({ ...v, images }); }} />
                <div className="mt-2 grid gap-2">
                  <Field label="Chú thích" value={img.alt} onChange={(alt) => { const images = [...v.images]; images[i] = { ...img, alt }; set({ ...v, images }); }} />
                  <Field
                    label="Link sản phẩm chi tiết"
                    value={img.href || ""}
                    onChange={(href) => { const images = [...v.images]; images[i] = { ...img, href }; set({ ...v, images }); }}
                    hint="Ví dụ: /san-pham/hong-tra-tai-phat"
                  />
                </div>
              </div>
            ))}
            <button type="button" className="text-sm font-semibold text-[#3f7d3a]" onClick={() => set({ ...v, images: [...v.images, newImage()] })}>Thêm ảnh</button>
          </div>
        </AdminCard>
      )}
    </SectionForm>
  );
}

export function FlavorEditor({ initial }: { initial: BannerData["flavor"] }) {
  return (
    <SectionForm
      sectionKey="flavor"
      title="Mô tả hồng trà / trà lài"
      description="Chữ mô tả cạnh hai sản phẩm xen kẽ trên trang chủ."
      initial={initial}
    >
      {(v, set) => (
        <AdminCard title="Hai khối chữ">
          <div className="grid gap-4">
            <Field label="Tiêu đề sản phẩm 1" value={v.leftTitle} onChange={(leftTitle) => set({ ...v, leftTitle })} multiline />
            <Field label="Mô tả sản phẩm 1" value={v.leftNote} onChange={(leftNote) => set({ ...v, leftNote })} multiline />
            <Field label="Mô tả sản phẩm 2" value={v.rightCard} onChange={(rightCard) => set({ ...v, rightCard })} multiline />
          </div>
        </AdminCard>
      )}
    </SectionForm>
  );
}

export function MarqueeEditor({ initial }: { initial: BannerData["marquee"] }) {
  return (
    <SectionForm
      sectionKey="marquee"
      title="Thanh chữ chạy (ẩn trên trang chủ)"
      description="Khối này không hiển thị trên layout catalogue hiện tại — vẫn lưu được để dùng lại sau."
      initial={initial}
    >
      {(v, set) => (
        <AdminCard title="Nội dung marquee">
          <Field label="Chữ chạy" value={v.text} onChange={(text) => set({ ...v, text })} hint="Hiện đang ẩn trên trang chủ." />
        </AdminCard>
      )}
    </SectionForm>
  );
}

export function IdentityEditor({ initial }: { initial: BannerData["identity"] }) {
  return (
    <SectionForm
      sectionKey="identity"
      title="Bản sắc (ẩn trên trang chủ)"
      description="Khối này không hiển thị trên layout catalogue hiện tại."
      initial={initial}
    >
      {(v, set) => (
        <AdminCard title="Tiêu đề và ảnh">
          <div className="grid gap-4">
            <Field label="Tiêu đề" value={v.title} onChange={(title) => set({ ...v, title })} />
            <Field label="Mô tả" value={v.description} onChange={(description) => set({ ...v, description })} multiline rows={4} />
            {v.images.map((img, i) => (
              <ImageField key={img.id} label={`Ảnh ${i + 1}`} value={img.src} onChange={(src) => { const images = [...v.images]; images[i] = { ...img, src }; set({ ...v, images }); }} />
            ))}
            <button type="button" className="text-sm font-semibold text-[#3f7d3a]" onClick={() => set({ ...v, images: [...v.images, newImage()] })}>Thêm ảnh</button>
          </div>
        </AdminCard>
      )}
    </SectionForm>
  );
}

export function ExclusiveEditor({ initial }: { initial: BannerData["exclusive"] }) {
  return (
    <SectionForm
      sectionKey="exclusive"
      title="Combo Hồng Trà & Trà Lài"
      description="Khối nền đỏ trên trang chủ. Nhập giá combo riêng — sẽ hiện nổi bật dưới dòng ưu đãi."
      initial={{ ...initial, price: initial.price || "" }}
    >
      {(v, set) => (
        <AdminCard title="Nội dung combo">
          <div className="grid gap-4">
            <Field label="Tiêu đề" value={v.title} onChange={(title) => set({ ...v, title })} />
            <Field label="Dòng nhấn / ưu đãi" value={v.highlight} onChange={(highlight) => set({ ...v, highlight })} multiline hint="Ví dụ: 2 gói / khoảng 1kg" />
            <Field
              label="Giá combo"
              value={v.price || ""}
              onChange={(price) => set({ ...v, price })}
              hint="Chỉ nhập số, ví dụ: 140.000 — trang chủ tự thêm VNĐ"
            />
            <Field label="Mô tả" value={v.description} onChange={(description) => set({ ...v, description })} multiline />
            <Field label="Nút" value={v.ctaLabel} onChange={(ctaLabel) => set({ ...v, ctaLabel })} />
            <Field label="Link nút" value={v.ctaHref} onChange={(ctaHref) => set({ ...v, ctaHref })} />
            <ImageField label="Ảnh combo (bo góc trên trang chủ)" value={v.image} onChange={(image) => set({ ...v, image })} />
          </div>
        </AdminCard>
      )}
    </SectionForm>
  );
}

export function SpecsEditor({ initial }: { initial: BannerData["specs"] }) {
  return (
    <SectionForm
      sectionKey="specs"
      title="Thông số sản phẩm"
      description="Bảng giá / quy cách trên trang chủ: Mô tả · Xuất xứ · Đơn vị / QC đóng thùng · Hạn sử dụng · Giá bán."
      initial={initial}
    >
      {(v, set) => (
        <>
          <AdminCard title="Tiêu đề khối">
            <div className="grid gap-4">
              <Field label="Tiêu đề" value={v.title} onChange={(title) => set({ ...v, title })} />
              <Field label="Mô tả" value={v.description} onChange={(description) => set({ ...v, description })} multiline />
            </div>
          </AdminCard>
          {v.rows.map((row, i) => (
            <AdminCard key={row.id} title={row.name || `Dòng ${i + 1}`}>
              <div className="mb-3 flex gap-2">
                <button type="button" onClick={() => set({ ...v, rows: move(v.rows, i, -1) })}><ArrowUp size={16} /></button>
                <button type="button" onClick={() => set({ ...v, rows: move(v.rows, i, 1) })}><ArrowDown size={16} /></button>
                <button type="button" onClick={() => set({ ...v, rows: v.rows.filter((x) => x.id !== row.id) })}><Trash2 size={16} /></button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Mô tả (tên sản phẩm)" value={row.name} onChange={(name) => { const rows = [...v.rows]; rows[i] = { ...row, name }; set({ ...v, rows }); }} />
                <Field label="Xuất xứ" value={row.origin} onChange={(origin) => { const rows = [...v.rows]; rows[i] = { ...row, origin }; set({ ...v, rows }); }} />
                <Field label="Đơn vị / QC đóng thùng" value={row.packing} onChange={(packing) => { const rows = [...v.rows]; rows[i] = { ...row, packing }; set({ ...v, rows }); }} />
                <Field label="Hạn sử dụng" value={row.shelfLife} onChange={(shelfLife) => { const rows = [...v.rows]; rows[i] = { ...row, shelfLife }; set({ ...v, rows }); }} />
                <Field label="Giá bán (số, không cần VNĐ)" value={row.price} onChange={(price) => { const rows = [...v.rows]; rows[i] = { ...row, price }; set({ ...v, rows }); }} hint="Ví dụ: 69.000" />
              </div>
            </AdminCard>
          ))}
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#3f7d3a]"
            onClick={() => set({ ...v, rows: [...v.rows, newSpecRow()] })}
          >
            <Plus size={14} /> Thêm dòng
          </button>
        </>
      )}
    </SectionForm>
  );
}

export function ReviewsEditor({ initial }: { initial: BannerData["reviews"] }) {
  return (
    <SectionForm sectionKey="reviews" title="Đánh giá khách hàng" initial={initial}>
      {(v, set) => (
        <>
          <AdminCard title="Tiêu đề">
            <div className="grid gap-4">
              <Field label="Tiêu đề" value={v.title} onChange={(title) => set({ ...v, title })} />
              <Field label="Mô tả" value={v.description} onChange={(description) => set({ ...v, description })} multiline />
            </div>
          </AdminCard>
          {v.items.map((item, i) => (
            <AdminCard key={item.id} title={item.name || `Đánh giá ${i + 1}`}>
              <div className="mb-3 flex gap-2">
                <button type="button" onClick={() => set({ ...v, items: move(v.items, i, -1) })}><ArrowUp size={16} /></button>
                <button type="button" onClick={() => set({ ...v, items: move(v.items, i, 1) })}><ArrowDown size={16} /></button>
                <button type="button" onClick={() => set({ ...v, items: v.items.filter((x) => x.id !== item.id) })}><Trash2 size={16} /></button>
              </div>
              <div className="grid gap-3">
                <Field label="Tên khách" value={item.name} onChange={(name) => { const items = [...v.items]; items[i] = { ...item, name }; set({ ...v, items }); }} />
                <Field label="Nhận xét" value={item.content} onChange={(content) => { const items = [...v.items]; items[i] = { ...item, content }; set({ ...v, items }); }} multiline />
                <ImageField label="Ảnh" value={item.image} onChange={(image) => { const items = [...v.items]; items[i] = { ...item, image }; set({ ...v, items }); }} />
              </div>
            </AdminCard>
          ))}
          <button type="button" className="inline-flex items-center gap-1 text-sm font-semibold text-[#3f7d3a]" onClick={() => set({ ...v, items: [...v.items, newReview()] })}><Plus size={14} /> Thêm đánh giá</button>
        </>
      )}
    </SectionForm>
  );
}

export function RecipesEditor({ initial }: { initial: BannerData["recipes"] }) {
  const [batchUploading, setBatchUploading] = useState(false);

  return (
    <SectionForm
      sectionKey="recipes"
      title="Công thức pha trà"
      description="Khối giữa đánh giá và banner CTA. Grid 3 cột trên PC, 2 cột tablet, 1 cột mobile. Chỉ ảnh đã tải mới hiện trên trang chủ."
      initial={initial}
    >
      {(v, set) => (
        <>
          <AdminCard title="Tiêu đề khối">
            <div className="grid gap-4">
              <Field label="Tiêu đề" value={v.title} onChange={(title) => set({ ...v, title })} />
              <Field label="Mô tả" value={v.description} onChange={(description) => set({ ...v, description })} multiline />
            </div>
          </AdminCard>

          <AdminCard title="Tải nhanh nhiều ảnh">
            <p className="mb-3 text-sm text-ink/55">
              Chọn tới 6 ảnh công thức cùng lúc — hệ thống gắn lần lượt vào các ô trống hoặc tạo ô mới.
            </p>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold">
              {batchUploading ? "Đang tải…" : "Tải nhiều ảnh công thức"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={batchUploading}
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []).slice(0, 6);
                  if (!files.length) return;
                  setBatchUploading(true);
                  try {
                    const urls: string[] = [];
                    for (const file of files) {
                      const body = new FormData();
                      body.set("file", file);
                      const res = await fetch("/api/upload", { method: "POST", body });
                      const data = await res.json();
                      if (data.url) urls.push(data.url);
                    }
                    if (!urls.length) return;
                    const items = [...v.items];
                    let ui = 0;
                    for (let i = 0; i < items.length && ui < urls.length; i++) {
                      if (!items[i].src) {
                        const nameFromFile = files[ui]?.name?.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ") || items[i].title;
                        items[i] = {
                          ...items[i],
                          src: urls[ui],
                          title: items[i].title || nameFromFile,
                          alt: items[i].alt || `Công thức ${nameFromFile}`,
                        };
                        ui++;
                      }
                    }
                    while (ui < urls.length) {
                      const nameFromFile = files[ui]?.name?.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ") || `Công thức ${ui + 1}`;
                      items.push({
                        ...newRecipe(),
                        title: nameFromFile,
                        src: urls[ui],
                        alt: `Công thức ${nameFromFile}`,
                      });
                      ui++;
                    }
                    set({ ...v, items });
                  } finally {
                    setBatchUploading(false);
                    e.target.value = "";
                  }
                }}
              />
            </label>
          </AdminCard>

          {v.items.map((item, i) => (
            <AdminCard key={item.id} title={item.title || `Công thức ${i + 1}`}>
              <div className="mb-3 flex gap-2">
                <button type="button" onClick={() => set({ ...v, items: move(v.items, i, -1) })}><ArrowUp size={16} /></button>
                <button type="button" onClick={() => set({ ...v, items: move(v.items, i, 1) })}><ArrowDown size={16} /></button>
                <button type="button" onClick={() => set({ ...v, items: v.items.filter((x) => x.id !== item.id) })}><Trash2 size={16} /></button>
              </div>
              <div className="grid gap-3 md:grid-cols-[140px_1fr]">
                {item.src ? (
                  <img src={item.src} alt="" className="h-40 w-full rounded-xl object-cover object-top" />
                ) : (
                  <div className="grid h-40 place-items-center rounded-xl bg-[#f3f4f6] text-xs text-ink/40">Chưa có ảnh</div>
                )}
                <div className="grid gap-3">
                  <Field label="Tên công thức" value={item.title} onChange={(title) => { const items = [...v.items]; items[i] = { ...item, title }; set({ ...v, items }); }} />
                  <Field label="Alt / mô tả ảnh" value={item.alt} onChange={(alt) => { const items = [...v.items]; items[i] = { ...item, alt }; set({ ...v, items }); }} />
                  <ImageField label="Ảnh poster công thức" value={item.src} onChange={(src) => { const items = [...v.items]; items[i] = { ...item, src }; set({ ...v, items }); }} />
                </div>
              </div>
            </AdminCard>
          ))}
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#3f7d3a]"
            onClick={() => set({ ...v, items: [...v.items, newRecipe()] })}
          >
            <Plus size={14} /> Thêm công thức
          </button>
        </>
      )}
    </SectionForm>
  );
}

export function FaqEditor({ initial }: { initial: BannerData["faq"] }) {
  return (
    <SectionForm
      sectionKey="faq"
      title="FAQ (ẩn trên trang chủ)"
      description="Khối này không hiển thị trên layout catalogue hiện tại."
      initial={initial}
    >
      {(v, set) => (
        <>
          <AdminCard title="Cột trái">
            <div className="grid gap-4">
              <Field label="Tiêu đề" value={v.title} onChange={(title) => set({ ...v, title })} />
              <Field label="Mô tả" value={v.description} onChange={(description) => set({ ...v, description })} multiline />
              <Field label="Nút liên hệ" value={v.ctaLabel} onChange={(ctaLabel) => set({ ...v, ctaLabel })} />
              <Field label="Link" value={v.ctaHref} onChange={(ctaHref) => set({ ...v, ctaHref })} />
            </div>
          </AdminCard>
          {v.items.map((item, i) => (
            <AdminCard key={item.id} title={`Câu ${i + 1}`}>
              <div className="mb-2 flex gap-2">
                <button type="button" onClick={() => set({ ...v, items: move(v.items, i, -1) })}><ArrowUp size={16} /></button>
                <button type="button" onClick={() => set({ ...v, items: move(v.items, i, 1) })}><ArrowDown size={16} /></button>
                <button type="button" onClick={() => set({ ...v, items: v.items.filter((x) => x.id !== item.id) })}><Trash2 size={16} /></button>
              </div>
              <Field label="Câu hỏi" value={item.question} onChange={(question) => { const items = [...v.items]; items[i] = { ...item, question }; set({ ...v, items }); }} />
              <div className="mt-3"><Field label="Trả lời" value={item.answer} onChange={(answer) => { const items = [...v.items]; items[i] = { ...item, answer }; set({ ...v, items }); }} multiline rows={4} /></div>
            </AdminCard>
          ))}
          <button type="button" className="text-sm font-semibold text-[#3f7d3a]" onClick={() => set({ ...v, items: [...v.items, newFaq()] })}>Thêm câu hỏi</button>
        </>
      )}
    </SectionForm>
  );
}

export function CtaEditor({ initial }: { initial: BannerData["cta"] }) {
  return (
    <SectionForm
      sectionKey="cta"
      title="Banner CTA"
      description="Banner cuối trang chủ — ảnh bo góc lớn."
      initial={initial}
    >
      {(v, set) => (
        <AdminCard title="Banner CTA">
          <div className="grid gap-4">
            <ImageField label="Ảnh nền" value={v.image} onChange={(image) => set({ ...v, image })} />
            <Field label="Tiêu đề" value={v.title} onChange={(title) => set({ ...v, title })} />
            <Field label="Phụ đề" value={v.subtitle} onChange={(subtitle) => set({ ...v, subtitle })} />
            <Field label="Nút" value={v.ctaLabel} onChange={(ctaLabel) => set({ ...v, ctaLabel })} />
            <Field label="Link" value={v.ctaHref} onChange={(ctaHref) => set({ ...v, ctaHref })} />
            <Field label="Chữ con dấu (dự phòng)" value={v.sealText} onChange={(sealText) => set({ ...v, sealText })} />
          </div>
        </AdminCard>
      )}
    </SectionForm>
  );
}

export function FooterEditor({ initial }: { initial: BannerData["footer"] }) {
  return (
    <SectionForm sectionKey="footer" title="Footer" description="Địa chỉ, hotline, email, MST và mạng xã hội nằm ở Thiết lập thông tin." initial={initial}>
      {(v, set) => (
        <AdminCard title="Cột và liên kết">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Tiêu đề thông tin" value={v.infoTitle} onChange={(infoTitle) => set({ ...v, infoTitle })} />
            <Field label="Tiêu đề liên kết" value={v.linksTitle} onChange={(linksTitle) => set({ ...v, linksTitle })} />
            <Field label="Tiêu đề social" value={v.socialTitle} onChange={(socialTitle) => set({ ...v, socialTitle })} />
          </div>
          <div className="mt-4 space-y-2">
            {v.links.map((link, i) => (
              <div key={link.id} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                <Input value={link.label} onChange={(e) => { const links = [...v.links]; links[i] = { ...link, label: e.target.value }; set({ ...v, links }); }} />
                <Input value={link.href} onChange={(e) => { const links = [...v.links]; links[i] = { ...link, href: e.target.value }; set({ ...v, links }); }} />
                <button type="button" onClick={() => set({ ...v, links: v.links.filter((x) => x.id !== link.id) })}><Trash2 size={16} /></button>
              </div>
            ))}
            <button type="button" className="text-sm font-semibold text-[#3f7d3a]" onClick={() => set({ ...v, links: [...v.links, newLink()] })}>Thêm liên kết</button>
          </div>
        </AdminCard>
      )}
    </SectionForm>
  );
}
