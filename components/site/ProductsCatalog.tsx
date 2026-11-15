"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  slug: string;
  label: string;
  price: number;
  image: string;
  categoryName: string;
  variants?: { name: string; price: number }[];
};

type Category = { id: string; name: string; slug: string };

export function ProductsCatalog({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [dm, setDm] = useState("");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("dm") || "";
    if (q) setDm(q);
  }, []);

  const activeName = categories.find((c) => c.slug === dm)?.name;
  const list = useMemo(
    () => (activeName ? products.filter((p) => p.categoryName === activeName) : products),
    [activeName, products],
  );

  function selectCategory(slug: string) {
    startTransition(() => setDm(slug));
    const url = slug ? `/san-pham?dm=${encodeURIComponent(slug)}` : "/san-pham";
    window.history.replaceState(null, "", url);
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => selectCategory("")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${!dm ? "bg-[#8B1E1F] text-white" : "bg-white hover:bg-white/80"}`}
        >
          Tất cả
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => selectCategory(c.slug)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${dm === c.slug ? "bg-[#8B1E1F] text-white" : "bg-white hover:bg-white/80"}`}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => {
          const price =
            p.variants?.find((v) => /500\s*g/i.test(v.name))?.price ??
            p.variants?.[0]?.price ??
            p.price;
          return (
          <Link key={p.id} href={`/san-pham/${p.slug}`} prefetch className="group text-center">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase">{p.label}</p>
            <img
              src={p.image}
              alt={p.name}
              className="mx-auto mt-3 h-72 rounded-2xl object-contain transition group-hover:-translate-y-1"
              loading="lazy"
              decoding="async"
            />
            <h2 className="mt-2 font-semibold text-[#8B1E1F]">{p.name}</h2>
            <p className="text-sm font-semibold text-[#8B1E1F]">{formatPrice(price)}</p>
          </Link>
          );
        })}
      </div>
      {!list.length && (
        <p className="py-12 text-center text-sm text-[#6d564c]">Chưa có sản phẩm trong danh mục này.</p>
      )}
    </>
  );
}
