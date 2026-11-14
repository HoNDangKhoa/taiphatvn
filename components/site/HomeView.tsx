"use client";

import Link from "next/link";
import { ArrowRight, Phone, ShoppingBag } from "lucide-react";
import type { BannerData, GalleryImage } from "@/lib/home";
import type { ProductView } from "@/lib/queries";
import { formatPrice, stripHtml, telHref } from "@/lib/utils";

type Brand = {
  companyName: string;
  logoUrl: string;
};

const SPEC_ROWS = [
  { label: "Thành phần", value: "100% lá trà chọn lọc (hồng trà / trà lài)" },
  { label: "Khối lượng", value: "250g · 500g / gói" },
  { label: "Xuất xứ", value: "Đồi chè cao — Tây Bắc, Việt Nam" },
  { label: "Công dụng", value: "Nguyên liệu trà sữa, trà trái cây, pha nóng / ủ lạnh" },
  { label: "Combo", value: "2 gói (~1kg) · khoảng 140.000 VNĐ" },
  { label: "Bảo quản", value: "Khô ráo, thoáng mát, tránh nắng và mùi lạ" },
];

export function HomeView({
  banner,
  products,
  brand,
}: {
  banner: BannerData;
  products: ProductView[];
  brand: Brand;
}) {
  const featured = pickCatalogProducts(products);

  return (
    <div className="bg-[#FBF4EC] text-[#3A2A24]">
      <Hero banner={banner} brand={brand} />
      <div className="bg-tea-paper">
        <Intro banner={banner} />
        <CatalogRows banner={banner} products={featured} />
      </div>
      <Combo banner={banner} products={products} />
      <div className="bg-tea-paper">
        <Specs />
        <FruitGallery banner={banner} products={products} />
        <Quotes banner={banner} />
      </div>
      <Cta banner={banner} />
    </div>
  );
}

function pickCatalogProducts(products: ProductView[]) {
  if (!products.length) return [];
  const hong = products.find((p) => /hồng|hong/i.test(p.name) || /hồng|hong/i.test(p.categoryName));
  const lai = products.find((p) => /lài|lai/i.test(p.name) || /lài|lai/i.test(p.categoryName));
  const picked = [lai, hong].filter(Boolean) as ProductView[];
  if (picked.length >= 2) return picked.slice(0, 2);
  const featured = products.filter((p) => p.featured);
  return (featured.length ? featured : products).slice(0, 2);
}

function resolveProductHref(img: GalleryImage, products: ProductView[]) {
  if (img.href) return img.href;
  const needle = img.alt.toLowerCase();
  const match = products.find(
    (p) =>
      needle.includes(p.name.toLowerCase()) ||
      p.name.toLowerCase().includes(needle) ||
      (/lài|lai|jasmine|green/i.test(needle) && /lài|lai/i.test(p.name)) ||
      (/hồng|hong|black/i.test(needle) && /hồng|hong|black/i.test(p.name)),
  );
  return match ? `/san-pham/${match.slug}` : "";
}

function Hero({ banner, brand }: { banner: BannerData; brand: Brand }) {
  const hero = banner.hero;
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      <img
        src="/media/hill-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f0c]/55 via-[#1a0f0c]/35 to-[#1a0f0c]/70" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-[1100px] flex-col items-center justify-center px-5 py-24 text-center text-white md:px-8">
        <img
          src={brand.logoUrl || "/media/logo.png"}
          alt={brand.companyName || "Kim Khánh"}
          className="h-16 w-auto rounded-2xl object-contain drop-shadow-md sm:h-20"
        />
        <p className="mt-5 text-[11px] font-semibold tracking-[0.28em] text-white/85 uppercase">
          {brand.companyName || "Công ty TNHH Thương mại Tài Phát VN"}
        </p>
        <h1 className="font-display mt-4 text-5xl leading-none tracking-wide uppercase sm:text-6xl md:text-7xl">
          {hero.title || "Kim Khánh"}
        </h1>
        <p className="font-display mt-2 text-xl text-[#E6C36A] uppercase sm:text-2xl">
          {hero.subtitle || "Tài Phát VN"}
        </p>
        <p className="mt-6 max-w-xl text-[15px] leading-7 text-white/90">{hero.description}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={hero.primaryHref || "/gio-hang"}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8B1E1F] px-6 py-3 text-sm font-semibold text-white uppercase hover:bg-[#73181A]"
          >
            <ShoppingBag size={16} /> {hero.primaryLabel}
          </Link>
          <a
            href={telHref(hero.secondaryLabel)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/70 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm"
          >
            <Phone size={16} /> {hero.secondaryLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

function Intro({ banner }: { banner: BannerData }) {
  const s = banner.story;
  return (
    <section className="mx-auto max-w-[760px] px-5 py-16 text-center md:px-8 md:py-20">
      <p className="text-[11px] font-semibold tracking-[0.22em] text-[#8B1E1F] uppercase">{s.eyebrow}</p>
      <h2 className="font-display mt-3 text-3xl text-[#8B1E1F] uppercase md:text-4xl">{s.title}</h2>
      <p className="mt-5 text-[15px] leading-7 text-[#6d564c]">{s.description}</p>
    </section>
  );
}

function CatalogRows({ banner, products }: { banner: BannerData; products: ProductView[] }) {
  if (!products.length) return null;
  return (
    <section id="san-pham" className="mx-auto max-w-[1100px] px-5 pb-16 md:px-8">
      <div className="mb-12 text-center">
        <h2 className="font-display text-3xl text-[#8B1E1F] uppercase md:text-4xl">{banner.products.title}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#6d564c]">{banner.products.description}</p>
      </div>
      <div className="space-y-16 md:space-y-20">
        {products.map((product, i) => {
          const flip = i % 2 === 1;
          const note =
            i === 0
              ? banner.flavor.leftNote || product.summary
              : banner.flavor.rightCard || product.summary;
          const href = `/san-pham/${product.slug}`;
          return (
            <article
              key={product.id}
              className={`grid items-center gap-8 md:grid-cols-2 md:gap-12 ${flip ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <Link href={href} className="group flex justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-[420px] w-full max-w-[380px] rounded-3xl object-contain transition duration-300 group-hover:-translate-y-1"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
              <div className={flip ? "md:text-right" : ""}>
                <p className="text-[11px] font-semibold tracking-[0.2em] text-[#8A4B2A] uppercase">
                  {product.label || product.categoryName}
                </p>
                <h3 className="font-display mt-2 text-3xl text-[#8B1E1F] uppercase md:text-4xl">
                  <Link href={href} className="hover:opacity-85">
                    {product.name}
                  </Link>
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#6d564c]">{stripHtml(note || product.summary)}</p>
                <p className="mt-5 text-lg font-semibold tracking-wide text-[#8B1E1F]">
                  {formatPrice(product.price)}
                </p>
                <Link
                  href={href}
                  className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8B1E1F] underline-offset-4 hover:underline ${flip ? "md:flex-row-reverse" : ""}`}
                >
                  Xem chi tiết <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      <div className="mt-12 text-center">
        <Link
          href={banner.products.ctaHref || "/san-pham"}
          className="inline-flex items-center gap-2 rounded-full bg-[#8B1E1F] px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase"
        >
          {banner.products.ctaLabel} <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

function Combo({ banner, products }: { banner: BannerData; products: ProductView[] }) {
  const s = banner.exclusive;
  const productHref =
    products.find((p) => /hồng|hong|black/i.test(p.name))?.slug ||
    products[0]?.slug;
  const imageHref = productHref ? `/san-pham/${productHref}` : s.ctaHref || "/gio-hang";

  return (
    <section className="bg-wine-texture mx-3 my-10 overflow-hidden rounded-[32px] px-5 py-14 text-white md:mx-6 md:px-10 md:py-16">
      <div className="mx-auto grid max-w-[1100px] items-center gap-10 md:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[#E6C36A] uppercase">Ưu đãi combo</p>
          <h2 className="font-display mt-3 text-3xl uppercase md:text-5xl">{s.title}</h2>
          <p className="mt-4 text-base font-semibold tracking-wide text-[#E6C36A]">{s.highlight}</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/90">{s.description}</p>
          <Link
            href={s.ctaHref || "/gio-hang"}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold tracking-wide text-[#8B1E1F] uppercase"
          >
            {s.ctaLabel} <ArrowRight size={14} />
          </Link>
        </div>
        <Link href={imageHref} className="group flex justify-center">
          <img
            src={s.image}
            alt={s.title}
            className="max-h-[360px] w-full max-w-[420px] rounded-3xl object-contain drop-shadow-2xl transition duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </Link>
      </div>
    </section>
  );
}

function Specs() {
  return (
    <section className="mx-auto max-w-[900px] px-5 py-14 md:px-8">
      <h2 className="font-display text-center text-3xl text-[#8B1E1F] uppercase md:text-4xl">
        Thông số sản phẩm
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-7 text-[#6d564c]">
        Quy cách đóng gói và thông tin dùng cho quán / pha chế.
      </p>
      <div className="mt-8 overflow-hidden rounded-2xl border border-[#e5d8cc] bg-white/50 backdrop-blur-[2px]">
        <table className="w-full text-left text-sm">
          <tbody>
            {SPEC_ROWS.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-white/60" : "bg-[#F3EBE1]/70"}>
                <th className="w-[36%] px-4 py-3.5 font-semibold text-[#8B1E1F] md:px-5">{row.label}</th>
                <td className="px-4 py-3.5 text-[#5c463c] md:px-5">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FruitGallery({ banner, products }: { banner: BannerData; products: ProductView[] }) {
  const images = banner.gallery.images.slice(0, 4);
  if (!images.length) return null;
  const cols = images.length === 1 ? "grid-cols-1" : images.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 md:grid-cols-3";

  return (
    <section className="mx-auto max-w-[1100px] px-5 py-14 md:px-8">
      <div className="text-center">
        <h2 className="font-display text-3xl text-[#8B1E1F] uppercase md:text-4xl">{banner.gallery.title}</h2>
        <p className="mt-2 text-sm text-[#6d564c]">{banner.gallery.subtitle}</p>
      </div>
      <div className={`mx-auto mt-10 grid max-w-[1100px] gap-5 ${cols}`}>
        {images.map((img) => {
          const href = resolveProductHref(img, products);
          const media = (
            <img
              src={img.src}
              alt={img.alt}
              className="aspect-[3/4] w-full rounded-3xl object-cover transition duration-300 group-hover:scale-[1.015]"
              loading="lazy"
            />
          );
          return (
            <figure key={img.id} className="text-center">
              {href ? (
                <Link href={href} className="group block overflow-hidden rounded-3xl">
                  {media}
                </Link>
              ) : (
                <div className="overflow-hidden rounded-3xl">{media}</div>
              )}
              <figcaption className="mt-3 text-sm font-semibold tracking-wide text-[#8B1E1F]">
                {href ? (
                  <Link href={href} className="hover:underline">
                    {img.alt}
                  </Link>
                ) : (
                  img.alt
                )}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

function Quotes({ banner }: { banner: BannerData }) {
  const items = banner.reviews.items.slice(0, 3);
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-[1100px] px-5 py-16 md:px-8">
      <h2 className="font-display text-center text-3xl text-[#8B1E1F] uppercase md:text-4xl">
        {banner.reviews.title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[#6d564c]">{banner.reviews.description}</p>
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {items.map((item) => (
          <blockquote key={item.id} className="text-center md:text-left">
            {item.image ? (
              <img
                src={item.image}
                alt=""
                className="mx-auto mb-4 h-20 w-20 rounded-2xl object-cover md:mx-0"
                loading="lazy"
              />
            ) : null}
            <p className="text-[15px] leading-7 text-[#5c463c]">&ldquo;{item.content}&rdquo;</p>
            <footer className="mt-4 text-sm font-semibold tracking-wide text-[#8B1E1F] uppercase">
              — {item.name}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function Cta({ banner }: { banner: BannerData }) {
  const s = banner.cta;
  return (
    <section className="px-4 pb-14 md:px-8">
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[28px]">
        <img src={s.image} alt="" className="h-[300px] w-full rounded-[28px] object-cover md:h-[360px]" />
        <div className="absolute inset-0 rounded-[28px] bg-[#1a0f0c]/45" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          <h2 className="font-display text-4xl uppercase md:text-5xl">{s.title}</h2>
          <p className="mt-2 text-sm text-white/90 md:text-base">{s.subtitle}</p>
          <Link
            href={s.ctaHref || "/gio-hang"}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#8B1E1F] px-6 py-3 text-sm font-semibold uppercase"
          >
            {s.ctaLabel} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
