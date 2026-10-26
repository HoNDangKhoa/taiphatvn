"use client";

import { useState } from "react";
import { sendContact } from "@/lib/actions";

export function ContactForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-3 rounded-[28px] bg-white p-5 shadow-sm"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError("");
        setMessage("");
        const res = await sendContact(new FormData(e.currentTarget));
        setPending(false);
        if (!res.ok) setError(res.error);
        else {
          setMessage("Đã gửi liên hệ. Kim Khánh sẽ phản hồi sớm.");
          e.currentTarget.reset();
        }
      }}
    >
      <h2 className="font-display text-2xl text-[#8B1E1F]">Gửi lời nhắn</h2>
      <label className="block text-sm font-semibold">Họ và tên *
        <input name="fullName" required className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 font-normal" />
      </label>
      <label className="block text-sm font-semibold">Số điện thoại *
        <input name="phone" required className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 font-normal" />
      </label>
      <label className="block text-sm font-semibold">Email
        <input name="email" type="email" className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 font-normal" />
      </label>
      <label className="block text-sm font-semibold">Nội dung *
        <textarea name="message" required rows={5} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 font-normal" />
      </label>
      <button disabled={pending} className="rounded-full bg-[#8B1E1F] px-6 py-3 text-sm font-semibold text-white uppercase disabled:opacity-60">
        {pending ? "Đang gửi…" : "Gửi liên hệ"}
      </button>
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      {message && <p className="text-sm font-semibold text-emerald-700">{message}</p>}
    </form>
  );
}
