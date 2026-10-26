"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function VisitBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    const key = `tp-visit:${pathname}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    void fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    });
  }, [pathname]);
  return null;
}
