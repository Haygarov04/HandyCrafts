"use client";

import Link from "next/link";
import { useEffect } from "react";
import { money } from "@/lib/catalog";
import { useCart } from "./cart";
import QtyControl from "./QtyControl";

export default function CartDrawer() {
  const cart = useCart();

  useEffect(() => {
    if (!cart.open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && cart.setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cart]);

  return (
    <div
      className={`fixed inset-0 z-[60] ${cart.open ? "" : "pointer-events-none"}`}
      aria-hidden={!cart.open}
    >
      <button
        type="button"
        aria-label="Затвори количката"
        onClick={() => cart.setOpen(false)}
        className={`absolute inset-0 bg-ink/40 transition-opacity ${cart.open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label="Количка"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-300 ${
          cart.open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <p className="font-display text-xl">Количка {cart.count ? `(${cart.count})` : ""}</p>
          <button
            type="button"
            onClick={() => cart.setOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-sand"
            aria-label="Затвори"
          >
            ✕
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="font-display text-2xl">Количката е празна</p>
            <p className="text-sm leading-6 text-ink/60">
              Качи снимка, виж визуализацията и добави фигурката тук.
            </p>
            <Link
              href="/studio"
              onClick={() => cart.setOpen(false)}
              className="rounded-full bg-ember px-6 py-3 font-semibold text-ink"
            >
              Създай фигурка
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {cart.items.map((item) => (
                <li key={item.draftId} className="flex gap-4 rounded-3xl bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt=""
                    className="h-24 w-24 shrink-0 rounded-2xl bg-sand object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold">
                        {item.label} · {item.cm} см
                      </p>
                      <button
                        type="button"
                        onClick={() => cart.remove(item.draftId)}
                        className="text-xs text-ink/45 hover:text-ink"
                      >
                        Махни
                      </button>
                    </div>
                    <p className="text-sm text-ink/55">{money(item.price)} / бр.</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <QtyControl value={item.qty} onChange={(qty) => cart.setQty(item.draftId, qty)} />
                      <p className="font-semibold">{money(item.price * item.qty)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-ink/10 px-5 py-5">
              <div className="flex items-center justify-between text-lg">
                <span>Общо</span>
                <span className="font-semibold">{money(cart.total)}</span>
              </div>
              <p className="mt-1 text-xs text-ink/50">
                + доставка по тарифа на куриера. Плащаш при получаване.
              </p>
              <Link
                href="/cart"
                onClick={() => cart.setOpen(false)}
                className="mt-4 block rounded-full bg-ink py-3.5 text-center font-semibold text-paper transition hover:bg-ember hover:text-ink"
              >
                Към поръчката
              </Link>
              <button
                type="button"
                onClick={() => cart.setOpen(false)}
                className="mt-2 w-full py-2 text-sm text-ink/55 hover:text-ink"
              >
                Продължи да разглеждаш
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
