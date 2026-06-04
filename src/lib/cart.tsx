"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "./types";

const STORAGE_KEY = "jhonfoos_cart_v1";

interface CartContextValue {
  items: CartItem[];
  count: number; // total de pares
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  setQty: (productId: string, size: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function keyOf(productId: string, size: string) {
  return `${productId}::${size}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Cargar desde localStorage al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Persistir
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (p) => keyOf(p.productId, p.size) === keyOf(item.productId, item.size)
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + item.qty, unitPrice: item.unitPrice };
        return next;
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: string, size: string) => {
    setItems((prev) =>
      prev.filter((p) => keyOf(p.productId, p.size) !== keyOf(productId, size))
    );
  };

  const setQty = (productId: string, size: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((p) =>
          keyOf(p.productId, p.size) === keyOf(productId, size)
            ? { ...p, qty: Math.max(0, qty) }
            : p
        )
        .filter((p) => p.qty > 0)
    );
  };

  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((a, b) => a + b.qty, 0), [items]);
  const total = useMemo(
    () => items.reduce((a, b) => a + b.unitPrice * b.qty, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    count,
    total,
    addItem,
    removeItem,
    setQty,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
