"use client";

import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle, Phone } from "lucide-react";
import { telHref } from "@/lib/utils";

export function FloatDock({
  phone,
  zalo,
  messenger,
}: {
  phone: string;
  zalo: string;
  messenger: string;
}) {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const zaloHref = zalo ? `https://zalo.me/${zalo.replace(/\D/g, "")}` : "#";

  return (
    <div className="fixed right-4 bottom-5 z-40 flex flex-col items-center gap-3">
      <a href={telHref(phone)} aria-label="Gọi hotline" className="grid h-12 w-12 place-items-center rounded-full bg-[#ff0007] text-white shadow-lg transition hover:scale-105">
        <Phone size={18} />
      </a>
      <a href={zaloHref} target="_blank" rel="noreferrer" aria-label="Zalo" className="grid h-12 w-12 place-items-center rounded-full bg-[#0068ff] text-sm font-bold text-white shadow-lg transition hover:scale-105">
        Zalo
      </a>
      <a href={messenger || "#"} target="_blank" rel="noreferrer" aria-label="Messenger" className="grid h-12 w-12 place-items-center rounded-full bg-[#0099ff] text-white shadow-lg transition hover:scale-105">
        <MessageCircle size={18} />
      </a>
      {showTop && (
        <button
          type="button"
          aria-label="Lên đầu trang"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-white text-[#3A2A24] shadow-lg transition hover:scale-105"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}
