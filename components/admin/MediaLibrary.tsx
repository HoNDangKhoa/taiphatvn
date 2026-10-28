"use client";

import { useState } from "react";

type MediaItem = { url: string; label: string };

function CopyPath({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="mt-1 w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-xs font-semibold text-[#3f7d3a] hover:bg-[#3f7d3a]/5"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        } catch {
          window.prompt("Sao chép đường dẫn ảnh:", value);
        }
      }}
    >
      {copied ? "Đã copy" : "Copy đường dẫn"}
    </button>
  );
}

export function MediaGrid({ items }: { items: MediaItem[] }) {
  if (!items.length) {
    return <p className="text-sm text-ink/50">Chưa có ảnh.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <figure key={item.url} className="rounded-xl bg-[#f8f8f8] p-2">
          <a href={item.url} target="_blank" rel="noreferrer" className="block">
            <img src={item.url} alt="" className="h-28 w-full object-contain" />
          </a>
          <figcaption className="mt-1 break-all font-mono text-[11px] leading-snug text-ink/55" title={item.url}>
            {item.label}
          </figcaption>
          <CopyPath value={item.url} />
        </figure>
      ))}
    </div>
  );
}
