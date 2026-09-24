"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./cart";

const links = [
  { href: "/studio?product=figurine", label: "Фигурки" },
  { href: "/studio?product=keychain", label: "Ключодържатели" },
  { href: "/#how", label: "Как работи" },
  { href: "/#faq", label: "Въпроси" },
  { href: "/contact", label: "Контакти" },
];

export function CartButton({ className = "" }: { className?: string }) {
  const cart = useCart();
  return (
    <button
      type="button"
      onClick={() => cart.setOpen(true)}
      className={`relative grid h-11 w-11 place-items-center rounded-full transition hover:bg-paper ${className}`}
      aria-label={`Количка, ${cart.count} продукта`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 7h12l-1 13H7L6 7Z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
      {cart.ready && cart.count > 0 ? (
        <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1 text-[11px] font-bold text-ink">
          {cart.count}
        </span>
      ) : null}
    </button>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const pill = "rounded-[1.6rem] bg-white/95 shadow-[0_10px_30px_rgba(22,21,19,0.08)] backdrop-blur";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <Link href="/" onClick={() => setOpen(false)} className={`${pill} flex h-16 shrink-0 items-center gap-2.5 px-2.5 sm:px-4`}>
          <Image src="/logo-remove.png" alt="" width={44} height={44} className="h-11 w-11" priority />
          <span className="hidden font-display text-[17px] font-semibold tracking-tight sm:inline">HandyCrafts</span>
        </Link>

        <nav className={`${pill} hidden h-16 items-center gap-7 px-7 text-[15px] lg:flex`}>
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ember-deep">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={`${pill} flex h-16 shrink-0 items-center gap-0.5 pl-2.5 pr-1.5 sm:gap-1 sm:pr-2`}>
          <Link
            href="/studio"
            className="rounded-2xl bg-ember px-4 py-3 text-sm font-bold text-ink shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)] transition hover:bg-ember-deep sm:px-5"
          >
            Поръчай
          </Link>
          <CartButton />
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full hover:bg-paper lg:hidden"
            aria-label={open ? "Затвори менюто" : "Отвори менюто"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="relative block h-4 w-5">
              <span className={`absolute left-0 top-1/2 h-[2px] w-5 rounded bg-ink transition ${open ? "rotate-45" : "-translate-y-[6px]"}`} />
              <span className={`absolute left-0 top-1/2 h-[2px] w-5 rounded bg-ink transition ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-1/2 h-[2px] w-5 rounded bg-ink transition ${open ? "-rotate-45" : "translate-y-[6px]"}`} />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div className={`${pill} mx-auto mt-3 max-w-6xl p-3 lg:hidden`}>
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3.5 text-lg hover:bg-paper"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
