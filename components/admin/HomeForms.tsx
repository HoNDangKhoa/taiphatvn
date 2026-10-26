"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminChrome";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { saveHomeSection } from "@/lib/actions";
import {
  newBadge,
  newFaq,
  newImage,
  newLink,
  newReview,
  newTag,
  type BannerData,
  type HomeSectionKey,
} from "@/lib/home";
import { cn } from "@/lib/utils";

function SaveBar({ pending, message, onReset }: { pending: boolean; message: string; onReset: () => void }) {
  return (
    <div className="sticky top-14 z-30 -mx-4 mb-4 flex flex-wrap items-center gap-2 border-b border-black/5 bg-[#f3f4f6]/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
      <button type="submit" disabled={pending} className="rounded-xl bg-[#3f7d3a] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? "Đang lưu…" : "Lưu thay đổi"}
      </button>
      <button type="button" onClick={onReset} className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold">Làm lại</button>
      {message && <span className={cn("text-sm font-semibold", message.startsWith("Lỗi") ? "text-red-600" : "text-emerald-600")}>{message}</span>}
    </div>
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

export function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-3">
        {value && <img src={value} alt="" className="h-16 w-16 rounded-lg object-cover" />}
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
    <SectionForm sectionKey="hero" title="Hero / Banner" description="Tiêu đề, mô tả, ảnh sản phẩm và các thẻ tag." initial={initial}>
      {(value, set) => (
        <>
          <AdminCard title="Nội dung">
            <div className="grid gap-4">
              <Field label="Tiêu đề" value={value.title} onChange={(title) => set({ ...value, title })} />
              <Field label="Phụ đề" value={value.subtitle} onChange={(subtitle) => set({ ...value, subtitle })} />
              <Field label="Mô tả" value={value.description} onChange={(description) => set({ ...value, description })} multiline rows={5} />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nút đặc" value={value.primaryLabel} onChange={(primaryLabel) => set({ ...value, primaryLabel })} />
                <Field label="Link nút đặc" value={value.primaryHref} onChange={(primaryHref) => set({ ...value, primaryHref })} />
                <Field label="Hotline / nút viền" value={value.secondaryLabel} onChange={(secondaryLabel) => set({ ...value, secondaryLabel })} />
              </div>
              <ImageField label="Ảnh sản phẩm" value={value.image} onChange={(image) => set({ ...value, image })} />
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
    <SectionForm sectionKey="story" title="Câu chuyện Kim Khánh" initial={initial}>
      {(v, set) => (
        <AdminCard title="Khối nền đỏ">
          <div className="grid gap-4">
            <Field label="Eyebrow" value={v.eyebrow} onChange={(eyebrow) => set({ ...v, eyebrow })} />
            <Field label="Tiêu đề" value={v.title} onChange={(title) => set({ ...v, title })} />
            <ImageField label="Hình sản phẩm giữa" value={v.image} onChange={(image) => set({ ...v, image })} />
            <Field label="Mô tả" value={v.description} onChange={(description) => set({ ...v, description })} multiline rows={5} />
            <Field label="Chữ con dấu" value={v.sealText} onChange={(sealText) => set({ ...v, sealText })} hint="Chữ chạy vòng quanh mũi tên." />
          </div>
        </AdminCard>
      )}
    </SectionForm>
  );
}

export function ProductsSectionEditor({ initial }: { initial: BannerData["products"] }) {
  return (
    <SectionForm sectionKey="products" title="Sản phẩm nổi bật" description="Tiêu đề khối trang chủ. Sản phẩm, giá và biến thể sửa ở Quản lý sản phẩm." initial={initial}>
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
    <SectionForm sectionKey="gallery" title="Gallery tinh hoa" initial={initial}>
      {(v, set) => (
        <AdminCard title="Tiêu đề và 2 ảnh">
          <div className="grid gap-4">
            <Field label="Dòng tiêu đề 1" value={v.title} onChange={(title) => set({ ...v, title })} />
            <Field label="Dòng tiêu đề 2" value={v.subtitle} onChange={(subtitle) => set({ ...v, subtitle })} />
            <Field label="Chữ con dấu" value={v.sealText} onChange={(sealText) => set({ ...v, sealText })} />
            {v.images.map((img, i) => (
              <div key={img.id} className="rounded-xl bg-[#f8f8f8] p-3">
                <ImageField label={`Ảnh ${i + 1}`} value={img.src} onChange={(src) => { const images = [...v.images]; images[i] = { ...img, src }; set({ ...v, images }); }} />
                <div className="mt-2"><Field label="Mô tả alt" value={img.alt} onChange={(alt) => { const images = [...v.images]; images[i] = { ...img, alt }; set({ ...v, images }); }} /></div>
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
    <SectionForm sectionKey="flavor" title="Hương vị đậm đà" description="Chữ dưới hai ảnh gallery. Ảnh phải có card trắng đè lên." initial={initial}>
      {(v, set) => (
        <AdminCard title="Hai khối chữ">
          <div className="grid gap-4">
            <Field label="Tiêu đề ảnh trái" value={v.leftTitle} onChange={(leftTitle) => set({ ...v, leftTitle })} multiline />
            <Field label="Ghi chú ảnh trái" value={v.leftNote} onChange={(leftNote) => set({ ...v, leftNote })} multiline />
            <Field label="Card đè ảnh phải" value={v.rightCard} onChange={(rightCard) => set({ ...v, rightCard })} multiline />
          </div>
        </AdminCard>
      )}
    </SectionForm>
  );
}

export function MarqueeEditor({ initial }: { initial: BannerData["marquee"] }) {
  return (
    <SectionForm sectionKey="marquee" title="Thanh chữ chạy" initial={initial}>
      {(v, set) => (
        <AdminCard title="Nội dung marquee">
          <Field label="Chữ chạy" value={v.text} onChange={(text) => set({ ...v, text })} hint="Nền đỏ, lặp vô hạn. Dấu * được thêm tự động." />
        </AdminCard>
      )}
    </SectionForm>
  );
}

export function IdentityEditor({ initial }: { initial: BannerData["identity"] }) {
  return (
    <SectionForm sectionKey="identity" title="Bản sắc và phong vị" initial={initial}>
      {(v, set) => (
        <AdminCard title="Tiêu đề và 3 ảnh">
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
    <SectionForm sectionKey="exclusive" title="Độc quyền tại Kim Khánh" initial={initial}>
      {(v, set) => (
        <AdminCard title="Khối chữ và ảnh oval">
          <div className="grid gap-4">
            <Field label="Tiêu đề" value={v.title} onChange={(title) => set({ ...v, title })} />
            <Field label="Dòng nhấn" value={v.highlight} onChange={(highlight) => set({ ...v, highlight })} multiline />
            <Field label="Mô tả" value={v.description} onChange={(description) => set({ ...v, description })} multiline />
            <Field label="Nút" value={v.ctaLabel} onChange={(ctaLabel) => set({ ...v, ctaLabel })} />
            <Field label="Link nút" value={v.ctaHref} onChange={(ctaHref) => set({ ...v, ctaHref })} />
            <ImageField label="Ảnh oval" value={v.image} onChange={(image) => set({ ...v, image })} />
          </div>
        </AdminCard>
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

export function FaqEditor({ initial }: { initial: BannerData["faq"] }) {
  return (
    <SectionForm sectionKey="faq" title="FAQ" initial={initial}>
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
    <SectionForm sectionKey="cta" title="Banner đồi trà" initial={initial}>
      {(v, set) => (
        <AdminCard title="Banner CTA">
          <div className="grid gap-4">
            <ImageField label="Ảnh nền" value={v.image} onChange={(image) => set({ ...v, image })} />
            <Field label="Tiêu đề" value={v.title} onChange={(title) => set({ ...v, title })} />
            <Field label="Phụ đề" value={v.subtitle} onChange={(subtitle) => set({ ...v, subtitle })} />
            <Field label="Nút" value={v.ctaLabel} onChange={(ctaLabel) => set({ ...v, ctaLabel })} />
            <Field label="Link" value={v.ctaHref} onChange={(ctaHref) => set({ ...v, ctaHref })} />
            <Field label="Chữ con dấu" value={v.sealText} onChange={(sealText) => set({ ...v, sealText })} />
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
