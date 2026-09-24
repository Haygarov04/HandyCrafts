"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { maxQty, type ProductId } from "@/lib/catalog";

export type CartItem = {
  draftId: string;
  product: ProductId;
  label: string;
  cm: number;
  price: number;
  qty: number;
  previewUrl: string;
};

type Cart = {
  items: CartItem[];
  count: number;
  total: number;
  ready: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (item: CartItem) => void;
  setQty: (draftId: string, qty: number) => void;
  remove: (draftId: string) => void;
  clear: () => void;
};

const STORAGE = "hc_cart_v1";
const CartContext = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE) || "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once
      if (Array.isArray(saved)) setItems(saved.filter((item) => item && item.draftId));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const add = useCallback((item: CartItem) => {
    setItems((list) => [...list.filter((entry) => entry.draftId !== item.draftId), item]);
    setOpen(true);
  }, []);

  const setQty = useCallback((draftId: string, qty: number) => {
    setItems((list) =>
      list.map((item) =>
        item.draftId === draftId ? { ...item, qty: Math.min(maxQty, Math.max(1, qty)) } : item
      )
    );
  }, []);

  const remove = useCallback((draftId: string) => {
    setItems((list) => list.filter((item) => item.draftId !== draftId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      ready,
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
      count: items.reduce((sum, item) => sum + item.qty, 0),
      total: items.reduce((sum, item) => sum + item.qty * item.price, 0),
    }),
    [items, ready, open, add, setQty, remove, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart outside CartProvider");
  return cart;
}
