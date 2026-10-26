"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, X } from "lucide-react";
import type { ProductView } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart/CartProvider";

export function BuyBox({ product }: { product: ProductView }) {
  const cart = useCart();
  const router = useRouter();
  const [variantId, setVariantId] = useState(product.variants[0]?.id || "");
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const variant = product.variants.find((v) => v.id === variantId);
  const price = variant?.price ?? product.price;
  const image = variant?.image || product.image;
  const photos = useMemo(() => {
    const list = [image, product.image, ...product.gallery].filter(Boolean);
    return [...new Set(list)];
  }, [image, product]);
  const [photo, setPhoto] = useState(photos[0]);

  function add(go: boolean) {
    cart.add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image,
      variantName: variant?.name || "",
      price,
      qty,
    });
    setNote("Đã thêm vào giỏ.");
    if (go) router.push("/gio-hang");
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="rounded-[28px] bg-[#F7F1EA] p-4 sm:p-6">
          <img src={photo || image} alt={product.name} className="mx-auto max-h-[640px] w-full object-contain" />
        </div>
        <div className="mt-3 flex gap-2">
          {photos.slice(0, 5).map((src) => (
            <button key={src} type="button" onClick={() => setPhoto(src)} className={`h-20 w-16 rounded-xl border bg-[#F7F1EA] p-1 ${photo === src ? "border-[#8B1E1F]" : "border-transparent"}`}>
              <img src={src} alt="" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-[#8A4B2A] uppercase">{product.label}</p>
        <h2 className="font-display mt-2 text-4xl text-[#8B1E1F]">{product.name}</h2>
        <p className="mt-3 text-2xl font-semibold text-[#8B1E1F]">{formatPrice(price)}</p>
        <p className="mt-4 text-sm leading-7 text-[#6d564c]">{product.summary}</p>
        {product.variants.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold">Khối lượng / quy cách</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setVariantId(v.id);
                    if (v.image) setPhoto(v.image);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${variantId === v.id ? "bg-[#8B1E1F] text-white" : "bg-[#F4EADF] text-[#3A2A24]"}`}
                >
                  {v.name}
                </button>
              ))}
              {variantId && (
                <button type="button" onClick={() => setVariantId("")} className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-2 text-sm">
                  <X size={14} /> Bỏ chọn
                </button>
              )}
            </div>
          </div>
        )}
        <div className="mt-5 flex items-center gap-3">
          <span className="text-sm font-semibold">Số lượng</span>
          <button type="button" className="h-9 w-9 rounded-full border" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <span className="w-6 text-center font-semibold">{qty}</span>
          <button type="button" className="h-9 w-9 rounded-full border" onClick={() => setQty((q) => q + 1)}>+</button>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => add(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8B1E1F] px-6 py-3 text-sm font-semibold text-white uppercase">
            <ShoppingBag size={16} /> Đặt trà ngay
          </button>
          <button type="button" onClick={() => add(false)} className="rounded-full border border-[#8B1E1F] px-6 py-3 text-sm font-semibold text-[#8B1E1F]">
            Thêm vào giỏ
          </button>
        </div>
        {note && <p className="mt-3 text-sm font-semibold text-emerald-700">{note}</p>}
        {product.specs && (
          <pre className="mt-6 whitespace-pre-wrap font-sans text-sm leading-7 text-[#5c463c]">{product.specs}</pre>
        )}
      </div>
    </div>
  );
}
