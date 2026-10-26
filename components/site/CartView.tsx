"use client";

import Link from "next/link";
import { useState } from "react";
import { placeOrder } from "@/lib/actions";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart/CartProvider";

export function CartView() {
  const cart = useCart();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError("");
    setMessage("");
    const res = await placeOrder({
      fullName: String(formData.get("fullName") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      address: String(formData.get("address") || ""),
      note: String(formData.get("note") || ""),
      items: cart.lines.map((l) => ({
        name: l.name,
        variantName: l.variantName,
        qty: l.qty,
        price: l.price,
      })),
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    cart.clear();
    setMessage(`Đã gửi đơn ${res.code}. Kim Khánh sẽ liên hệ xác nhận.`);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
      <div className="rounded-[28px] bg-white p-5 shadow-sm">
        <h2 className="font-display text-2xl text-[#8B1E1F]">Giỏ trà</h2>
        {cart.lines.length === 0 ? (
          <p className="mt-4 text-sm text-[#6d564c]">
            Giỏ đang trống. <Link href="/san-pham" className="font-semibold text-[#8B1E1F] underline">Chọn sản phẩm</Link>
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-black/5">
            {cart.lines.map((line) => (
              <li key={line.key} className="flex gap-3 py-4">
                <img src={line.image} alt="" className="h-20 w-16 rounded-xl object-contain bg-[#F7F1EA]" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{line.name}</p>
                  <p className="text-sm text-[#6d564c]">{line.variantName || "Mặc định"} · {formatPrice(line.price)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button type="button" className="h-7 w-7 rounded-full border" onClick={() => cart.setQty(line.key, line.qty - 1)}>−</button>
                    <span className="text-sm font-semibold">{line.qty}</span>
                    <button type="button" className="h-7 w-7 rounded-full border" onClick={() => cart.setQty(line.key, line.qty + 1)}>+</button>
                    <button type="button" className="ml-2 text-xs text-red-700" onClick={() => cart.remove(line.key)}>Xóa</button>
                  </div>
                </div>
                <p className="text-sm font-semibold text-[#8B1E1F]">{formatPrice(line.price * line.qty)}</p>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-right text-lg font-semibold text-[#8B1E1F]">
          Tổng: {cart.lines.length === 0 ? "0 VNĐ" : formatPrice(cart.total)}
        </p>
      </div>
      <form action={onSubmit} className="rounded-[28px] bg-white p-5 shadow-sm">
        <h2 className="font-display text-2xl text-[#8B1E1F]">Thông tin đặt trà</h2>
        <div className="mt-4 space-y-3">
          <Field name="fullName" label="Họ và tên" required />
          <Field name="phone" label="Số điện thoại" required />
          <Field name="email" label="Email" type="email" />
          <Field name="address" label="Địa chỉ" required />
          <label className="block text-sm font-semibold">
            Ghi chú
            <textarea name="note" rows={3} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 text-sm font-normal" />
          </label>
        </div>
        <button disabled={pending || cart.lines.length === 0} className="mt-5 w-full rounded-full bg-[#8B1E1F] py-3 text-sm font-semibold text-white uppercase disabled:opacity-50">
          {pending ? "Đang gửi…" : "Gửi đơn"}
        </button>
        {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
        {message && <p className="mt-3 text-sm font-semibold text-emerald-700">{message}</p>}
      </form>
    </div>
  );
}

function Field({ name, label, type = "text", required = false }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold">
      {label} {required && <span className="text-[#8B1E1F]">*</span>}
      <input name={name} type={type} required={required} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 text-sm font-normal" />
    </label>
  );
}
