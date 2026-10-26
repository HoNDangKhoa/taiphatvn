"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  variantName: string;
  qty: number;
  price: number;
};

type CartApi = {
  lines: CartLine[];
  count: number;
  total: number;
  add: (line: Omit<CartLine, "key" | "qty"> & { qty?: number }) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartApi | null>(null);
const KEY = "taiphat-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const api = useMemo<CartApi>(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const total = lines.reduce((s, l) => s + l.qty * l.price, 0);
    return {
      lines,
      count,
      total,
      add: (line) => {
        const key = `${line.productId}:${line.variantName}`;
        setLines((prev) => {
          const found = prev.find((p) => p.key === key);
          if (found) return prev.map((p) => (p.key === key ? { ...p, qty: p.qty + (line.qty || 1) } : p));
          return [...prev, { ...line, key, qty: line.qty || 1 }];
        });
      },
      setQty: (key, qty) => {
        setLines((prev) => prev.flatMap((p) => (p.key === key ? (qty <= 0 ? [] : [{ ...p, qty }]) : [p])));
      },
      remove: (key) => setLines((prev) => prev.filter((p) => p.key !== key)),
      clear: () => setLines([]),
    };
  }, [lines]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("Cart missing");
  return ctx;
}
