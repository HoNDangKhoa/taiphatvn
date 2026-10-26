"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ChevronDown, ChevronRight, Phone, ShoppingBag, Star } from "lucide-react";
import type { BannerData } from "@/lib/home";
import type { ProductView } from "@/lib/queries";
import { formatPrice, telHref } from "@/lib/utils";

function Seal({ text, light = false }: { text: string; light?: boolean }) {
  const id = text.slice(0, 6).replace(/\s/g, "") + (light ? "l" : "d");
  return (
    <span className={`relative grid h-24 w-24 place-items-center ${light ? "text-white" : "text-[#8B1E1F]"}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 animate-[spin_18s_linear_infinite]">
        <defs>
          <path id={id} d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
        </defs>
        <text fontSize="8.5" letterSpacing="1.5" fill="currentColor">
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <ArrowDown size={16} />
    </span>
  );
}

function Leaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 140" className={className} aria-hidden>
      <path
        d="M40 132 C12 90 8 48 40 8 C72 48 68 90 40 132 Z"
        fill="currentColor"
      />
      <path d="M40 120 V28" stroke="rgba(255,255,255,.35)" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

export function HomeView({ banner, products }: { banner: BannerData; products: ProductView[] }) {
  const hero = banner.hero;
  return (
    <div className="bg-[#FBF4EC] text-[#3A2A24]">
      <section className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 py-12 md:px-8 lg:grid-cols-2 lg:py-16">
        <div className="rise">
          <div className="flex flex-wrap gap-2">
            {hero.tags.map((tag) => (
              <span
                key={tag.id}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase ${
                  tag.tone === "solid"
                    ? "bg-[#8A4B2A] text-white"
                    : tag.tone === "outline"
                      ? "border border-[#d9cfc3] bg-white/70 text-[#5c463c]"
                      : "bg-white text-[#5c463c] shadow-sm"
                }`}
              >
                {tag.tone === "light" && <span className="h-1.5 w-1.5 rounded-full bg-[#8B1E1F]" />}
                {tag.tone === "solid" && <Star size={11} fill="currentColor" />}
                {tag.text}
              </span>
            ))}
          </div>
          <h1 className="font-display mt-6 text-4xl leading-[1.05] text-[#8B1E1F] uppercase sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          <p className="font-display mt-2 text-2xl leading-tight text-[#2a211e] uppercase sm:text-4xl">
            {hero.subtitle}
          </p>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#6d564c]">{hero.description}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href={hero.primaryHref || "/gio-hang"} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8B1E1F] px-6 py-3 text-sm font-semibold text-white uppercase hover:bg-[#73181A]">
              <ShoppingBag size={16} /> {hero.primaryLabel}
            </Link>
            <a href={telHref(hero.secondaryLabel)} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#8B1E1F] px-6 py-3 text-sm font-semibold text-[#8B1E1F]">
              <Phone size={16} /> {hero.secondaryLabel}
            </a>
          </div>
        </div>
        <div className="rise relative" style={{ animationDelay: "120ms" }}>
          <div className="rounded-[28px] border-[6px] border-white bg-[#F7F1EA] p-3 shadow-[0_20px_50px_rgba(90,40,30,.12)] sm:p-4">
            <img src={hero.image} alt={hero.title} className="mx-auto max-h-[520px] w-full object-contain" />
          </div>
          {!hero.image.includes("hero-card") && (
            <>
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {hero.badges[0] && (
                  <span className="rounded-full bg-[#1f7a45] px-3 py-1 text-[11px] font-semibold text-white">{hero.badges[0].text}</span>
                )}
              </div>
              <div className="absolute top-4 right-4">
                {hero.badges[1] && (
                  <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-[#8A4B2A]">{hero.badges[1].text}</span>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <Story banner={banner} />
      <Products banner={banner} products={products} />
      <Gallery banner={banner} />
      <Marquee text={banner.marquee.text} />
      <Identity banner={banner} />
      <Exclusive banner={banner} />
      <Reviews banner={banner} />
      <Faq banner={banner} />
      <Cta banner={banner} />
    </div>
  );
}

function Story({ banner }: { banner: BannerData }) {
  const s = banner.story;
  return (
    <section className="relative mx-3 overflow-hidden rounded-[36px] bg-[#8B1E1F] px-5 py-16 text-white md:mx-6 md:rounded-[48px] md:py-20">
      <Leaf className="leaf pointer-events-none absolute top-16 -left-4 h-28 w-16 text-[#c4564a]/70 blur-[1px]" />
      <Leaf className="leaf pointer-events-none absolute top-24 right-8 h-24 w-14 text-[#e7b089]/50" />
      <Leaf className="leaf pointer-events-none absolute bottom-24 left-10 h-20 w-12 text-white/20" />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="text-[11px] tracking-[0.22em] text-white/80 uppercase">{s.eyebrow}</p>
        <h2 className="font-display mt-4 text-4xl uppercase md:text-5xl">{s.title}</h2>
        <img src={s.image} alt={s.title} className="mx-auto mt-8 w-full max-w-[340px] object-contain drop-shadow-2xl" />
        <p className="mx-auto mt-8 max-w-3xl text-xs leading-6 tracking-wide text-white/90 uppercase md:text-sm">{s.description}</p>
        <a href="#san-pham" className="mt-8 inline-flex">
          <Seal text={s.sealText} light />
        </a>
      </div>
    </section>
  );
}

function Products({ banner, products }: { banner: BannerData; products: ProductView[] }) {
  const [index, setIndex] = useState(0);
  const per = 3;
  const max = Math.max(0, products.length - per);
  const visible = products.slice(index, index + per);
  const mobile = products[index] || products[0];
  return (
    <section id="san-pham" className="mx-auto max-w-[1200px] px-5 py-16 md:px-8">
      <div className="grid items-end gap-6 md:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="font-display text-4xl text-[#8B1E1F] uppercase md:text-5xl">{banner.products.title}</h2>
          <Link href={banner.products.ctaHref || "/san-pham"} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#8B1E1F] px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase">
            {banner.products.ctaLabel} <ArrowRight size={14} />
          </Link>
        </div>
        <p className="text-sm leading-7 text-[#6d564c] md:text-right">{banner.products.description}</p>
      </div>
      <div className="mt-12 hidden gap-6 md:grid md:grid-cols-3">
        {(visible.length ? visible : products).map((p) => (
          <ProductTile key={p.id} product={p} />
        ))}
      </div>
      <div className="mt-10 md:hidden">{mobile && <ProductTile product={mobile} />}</div>
      {products.length > 1 && (
        <div className="mt-8 flex justify-center gap-3">
          <button type="button" aria-label="Trước" onClick={() => setIndex((i) => Math.max(0, i - 1))} className="grid h-10 w-10 place-items-center rounded-full border border-[#8B1E1F] text-[#8B1E1F]">
            <ArrowLeft size={16} />
          </button>
          <button type="button" aria-label="Sau" onClick={() => setIndex((i) => (i >= max ? 0 : i + 1))} className="grid h-10 w-10 place-items-center rounded-full bg-[#8B1E1F] text-white">
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </section>
  );
}

function ProductTile({ product }: { product: ProductView }) {
  return (
    <Link href={`/san-pham/${product.slug}`} className="group block text-center">
      <p className="text-sm font-semibold tracking-[0.18em] text-[#2a211e] uppercase">{product.label}</p>
      <div className="mt-4 px-3 transition duration-300 group-hover:-translate-y-1">
        <img src={product.image} alt={product.name} className="mx-auto h-80 w-full object-contain" />
      </div>
      <p className="mt-4 text-sm font-semibold tracking-wide text-[#8B1E1F]">{formatPrice(product.price)}</p>
    </Link>
  );
}

function Gallery({ banner }: { banner: BannerData }) {
  const [a, b] = banner.gallery.images;
  return (
    <section className="mx-3 rounded-[36px] bg-[#F3EBE1] px-5 py-14 md:mx-6 md:px-10">
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="font-display text-3xl text-[#8B1E1F] uppercase md:text-5xl">{banner.gallery.title}</h2>
        <p className="font-display mt-1 text-2xl text-[#8B1E1F] uppercase md:text-4xl">{banner.gallery.subtitle}</p>
        <span className="absolute top-0 right-0 hidden md:block">
          <Seal text={banner.gallery.sealText} />
        </span>
      </div>
      <div className="mx-auto mt-10 grid max-w-[1100px] gap-6 md:grid-cols-2">
        <figure>
          <div className="rounded-[24px] bg-white p-3">
            {a && <img src={a.src} alt={a.alt} className="mx-auto max-h-[420px] w-full object-contain" />}
          </div>
          <figcaption className="px-2 pt-5 text-center">
            <p className="text-sm font-semibold tracking-wide text-[#8B1E1F] uppercase">{banner.flavor.leftTitle}</p>
            <p className="mt-3 text-sm leading-6 text-[#6d564c]">{banner.flavor.leftNote}</p>
          </figcaption>
        </figure>
        <figure className="relative">
          <div className="rounded-[24px] bg-white p-3">
            {b && <img src={b.src} alt={b.alt} className="mx-auto max-h-[420px] w-full object-contain" />}
          </div>
          <div className="relative z-10 -mt-16 mx-4 rounded-2xl bg-white p-5 text-center shadow-lg md:absolute md:right-6 md:bottom-6 md:left-6 md:mx-0 md:mt-0">
            <p className="text-sm font-semibold tracking-wide text-[#8B1E1F] uppercase">{banner.flavor.rightCard}</p>
          </div>
        </figure>
      </div>
    </section>
  );
}

function Marquee({ text }: { text: string }) {
  const chunk = `* ${text} *`;
  const row = useMemo(() => Array.from({ length: 8 }, () => chunk).join("   "), [chunk]);
  return (
    <div className="mt-10 overflow-hidden bg-[#8B1E1F] py-3 text-white">
      <div className="marquee-track flex w-max gap-8 text-sm font-semibold tracking-[0.2em] uppercase">
        <span>{row}</span>
        <span>{row}</span>
      </div>
    </div>
  );
}

function Identity({ banner }: { banner: BannerData }) {
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-16 md:px-8">
      <div className="grid items-start gap-8 md:grid-cols-2">
        <h2 className="font-display text-4xl leading-tight text-[#8B1E1F] uppercase md:text-5xl">{banner.identity.title}</h2>
        <p className="text-sm leading-7 font-medium tracking-wide text-[#8B1E1F] uppercase">{banner.identity.description}</p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {banner.identity.images.map((img, i) => (
          <div key={img.id} className="rounded-[24px] bg-[#F3EBE1] p-2" style={{ animationDelay: `${i * 80}ms` }}>
            <img src={img.src} alt={img.alt} className="mx-auto aspect-[3/4] w-full object-contain" />
          </div>
        ))}
      </div>
    </section>
  );
}

function Exclusive({ banner }: { banner: BannerData }) {
  const s = banner.exclusive;
  return (
    <section className="relative mx-auto grid max-w-[1200px] items-center gap-10 overflow-hidden px-5 py-8 md:grid-cols-2 md:px-8">
      <Leaf className="leaf pointer-events-none absolute -left-6 bottom-0 h-28 w-16 text-[#d9c4a4]" />
      <div>
        <h2 className="font-display text-4xl text-[#8B1E1F] uppercase md:text-5xl">{s.title}</h2>
        <p className="mt-5 text-sm font-semibold tracking-wide text-[#8B1E1F] uppercase">{s.highlight}</p>
        <p className="mt-4 max-w-md text-sm leading-7 text-[#6d564c]">{s.description}</p>
        <Link href={s.ctaHref || "/gio-hang"} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#8B1E1F] px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase">
          {s.ctaLabel} <ArrowRight size={14} />
        </Link>
      </div>
      <div className="mx-auto grid aspect-square w-full max-w-[460px] place-items-center rounded-full bg-[#f3ebe3] p-8">
        <img src={s.image} alt={s.title} className="max-h-full max-w-full object-contain" />
      </div>
    </section>
  );
}

function Reviews({ banner }: { banner: BannerData }) {
  const items = banner.reviews.items;
  const [i, setI] = useState(0);
  if (!items.length) return null;
  const prev = items[(i + items.length - 1) % items.length];
  const cur = items[i % items.length];
  const next = items[(i + 1) % items.length];
  return (
    <section className="relative mx-3 mt-10 overflow-hidden rounded-t-[40px] bg-[#8B1E1F] px-4 py-14 text-white md:mx-6">
      <Leaf className="pointer-events-none absolute top-8 left-6 h-16 w-10 text-white/15 blur-sm" />
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-4xl uppercase">{banner.reviews.title}</h2>
        <p className="mt-3 text-sm text-white/80">{banner.reviews.description}</p>
      </div>
      <div className="relative mx-auto mt-10 flex max-w-5xl items-center justify-center gap-3 md:gap-6">
        <button type="button" aria-label="Trước" onClick={() => setI((n) => (n + items.length - 1) % items.length)} className="absolute left-0 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/15 md:static">
          <ArrowLeft size={16} />
        </button>
        <img src={prev.image} alt="" className="hidden h-44 w-40 -rotate-6 rounded-2xl bg-[#F7F1EA] object-contain p-2 opacity-80 md:block md:h-56 md:w-52" />
        <img src={cur.image} alt={cur.name} className="h-56 w-[70%] rounded-2xl bg-[#F7F1EA] object-contain p-2 shadow-2xl md:h-72 md:w-80" />
        <img src={next.image} alt="" className="hidden h-44 w-40 rotate-6 rounded-2xl bg-[#F7F1EA] object-contain p-2 opacity-80 md:block md:h-56 md:w-52" />
        <button type="button" aria-label="Sau" onClick={() => setI((n) => (n + 1) % items.length)} className="absolute right-0 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-[#8B1E1F] md:static">
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="mx-auto mt-6 max-w-2xl text-center">
        <p className="text-lg font-semibold tracking-[0.18em] text-[#E6C36A] uppercase">{cur.name}</p>
        <p className="mt-3 text-sm leading-7 text-white/85">{cur.content}</p>
      </div>
    </section>
  );
}

function Faq({ banner }: { banner: BannerData }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-[#FBF4EC] px-5 py-16 md:px-8">
      <div className="mx-auto grid max-w-[1100px] gap-8 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="font-display text-5xl text-[#8B1E1F]">{banner.faq.title}</h2>
          <p className="mt-4 text-sm font-semibold tracking-wide text-[#8B1E1F] uppercase">{banner.faq.description}</p>
          <Link href={banner.faq.ctaHref || "/lien-he"} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#8B1E1F] px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase">
            {banner.faq.ctaLabel} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="space-y-3">
          {banner.faq.items.map((item, idx) => {
            const on = open === idx;
            return (
              <div key={item.id} className="overflow-hidden rounded-2xl">
                <button
                  type="button"
                  onClick={() => setOpen(on ? -1 : idx)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold uppercase ${on ? "bg-[#8B1E1F] text-white" : "bg-[#E7E1DA] text-[#8B1E1F]"}`}
                >
                  <span className="line-clamp-1">{item.question}</span>
                  {on ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {on && <div className="bg-[#F7F1EA] px-4 py-4 text-sm leading-7 text-[#5c463c]">{item.answer}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Cta({ banner }: { banner: BannerData }) {
  const s = banner.cta;
  return (
    <section className="bg-[#FBF4EC] px-4 pb-12 md:px-8">
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[32px]">
        <img src={s.image} alt="" className="h-[320px] w-full object-cover md:h-[380px]" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          <h2 className="font-display text-4xl uppercase md:text-6xl">{s.title}</h2>
          <p className="font-display mt-1 text-2xl uppercase md:text-4xl">{s.subtitle}</p>
          <Link href={s.ctaHref || "/gio-hang"} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#8B1E1F] px-6 py-3 text-sm font-semibold uppercase">
            {s.ctaLabel} <ArrowRight size={14} />
          </Link>
        </div>
        <span className="absolute bottom-6 left-6 hidden text-white md:block">
          <Seal text={s.sealText} light />
        </span>
      </div>
    </section>
  );
}
