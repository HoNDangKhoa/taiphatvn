"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Phone, ShoppingBag, X } from "lucide-react";
import type { HeaderContent } from "@/lib/home";
import { telHref } from "@/lib/utils";
import { useCart } from "@/components/cart/CartProvider";

export function SiteHeader({
  header,
  logoUrl,
  hotline,
}: {
  header: HeaderContent;
  logoUrl: string;
  hotline: string;
}) {
  const [fixed, setFixed] = useState(false);
  const [open, setOpen] = useState(false);
  const cart = useCart();
  const phone = header.hotlineLabel || hotline;

  useEffect(() => {
    const onScroll = () => setFixed(window.scrollY >= 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bar = (
    <div className="mx-auto flex h-[78px] max-w-[1440px] items-center gap-3 px-4 md:px-8">
      <button
        type="button"
        className="rounded-full p-2 text-[#8B1E1F] lg:hidden"
        aria-label="Mở menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav className="hidden flex-1 items-center gap-7 lg:flex">
        {header.links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className="text-[13px] font-semibold tracking-[0.14em] text-[#8B1E1F] uppercase hover:underline hover:underline-offset-4"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Link href="/" className="mx-auto shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
        <img src={logoUrl || "/media/logo.png"} alt="Kim Khánh" className="h-14 w-14 object-contain md:h-16 md:w-16" />
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <a
          href={telHref(phone)}
          className="hidden items-center gap-2 rounded-full bg-[#F4EADF] px-4 py-2 text-sm font-semibold text-[#3A2A24] sm:inline-flex"
        >
          <Phone size={15} />
          {phone}
        </a>
        <Link
          href={header.ctaHref || "/gio-hang"}
          className="inline-flex items-center gap-2 rounded-full bg-[#8B1E1F] px-3 py-2 text-[12px] font-semibold tracking-wide text-white uppercase shadow-sm transition hover:scale-[1.03] hover:bg-[#73181A] md:px-4 md:text-sm"
        >
          <ShoppingBag size={15} />
          <span className="hidden sm:inline">{header.ctaLabel}</span>
          {cart.count > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[11px] text-[#8B1E1F]">
              {cart.count}
            </span>
          )}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <header className="relative z-40 border-b border-[#eadfD4] bg-[#FFFCF8]">{bar}</header>
      {fixed && (
        <div className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[#FFFCF8]/95 shadow-md backdrop-blur">
          {bar}
        </div>
      )}
      {open && (
        <div className="fixed inset-x-0 top-[78px] z-50 border-b border-black/5 bg-[#FFFCF8] p-4 lg:hidden">
          {header.links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 text-sm font-semibold tracking-wide text-[#8B1E1F] uppercase"
            >
              {link.label}
            </Link>
          ))}
          <a href={telHref(phone)} className="mt-1 block rounded-xl bg-[#F4EADF] px-3 py-3 text-sm font-semibold">
            Hotline {phone}
          </a>
        </div>
      )}
    </>
  );
}
