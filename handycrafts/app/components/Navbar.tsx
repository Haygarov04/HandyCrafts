"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./cart";

const links = [
  { href: "/studio?product=figurine", label: "Фигурки" },
  { href: "/studio?product=keychain", label: "Ключодържатели" },
  { href: "/#how", label: "Как работи" },
  { href: "/portfolio", label: "Портфолио" },
];

const services = [
  { href: "/services/printing", label: "3D принтиране" },
  { href: "/services/scanning", label: "3D сканиране" },
  { href: "/services/modeling", label: "3D моделиране" },
  { href: "/upload", label: "Качи файл за печат" },
];

export function CartButton({ className = "" }: { className?: string }) {
  const cart = useCart();
  return (
    <button
      type="button"
      onClick={() => cart.setOpen(true)}
      className={`relative grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-white transition hover:border-ink/40 ${className}`}
      aria-label={`Количка, ${cart.count} продукта`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 7h12l-1 13H7L6 7Z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
      {cart.ready && cart.count > 0 ? (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1 text-[11px] font-bold text-ink">
          {cart.count}
        </span>
      ) : null}
    </button>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-ink px-4 py-2 text-center text-[12px] font-medium tracking-wide text-paper sm:text-[13px]">
        Плащане с наложен платеж · Виждаш фигурката преди да поръчаш
      </div>
      <div
        className={`border-b transition ${
          scrolled || open ? "border-ink/10 bg-paper/95 backdrop-blur-md" : "border-transparent bg-paper/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <Image src="/logo-remove.png" alt="" width={44} height={44} className="h-11 w-11" priority />
            <span className="font-display text-[17px] font-semibold tracking-tight">HandyCrafts</span>
          </Link>

          <nav className="hidden items-center gap-7 text-[15px] lg:flex">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-ember-deep">
                {item.label}
              </Link>
            ))}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className="transition hover:text-ember-deep"
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen((value) => !value)}
              >
                Услуги ▾
              </button>
              <div className={`absolute left-1/2 top-full w-60 -translate-x-1/2 pt-3 ${servicesOpen ? "visible" : "invisible"}`}>
                <div className="rounded-2xl border border-ink/10 bg-paper p-2 shadow-[0_20px_50px_rgba(22,21,19,0.12)]">
                  {services.map((item) => (
                    <Link key={item.href} href={item.href} className="block rounded-xl px-3 py-2.5 hover:bg-sand">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/contact" className="transition hover:text-ember-deep">
              Контакти
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/studio"
              className="hidden rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-ember-deep sm:inline-flex"
            >
              Създай фигурка
            </Link>
            <CartButton />
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-white lg:hidden"
              aria-label={open ? "Затвори менюто" : "Отвори менюто"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              <span className="relative block h-4 w-4">
                <span className={`absolute left-0 top-1/2 h-[1.5px] w-4 bg-ink transition ${open ? "rotate-45" : "-translate-y-[5px]"}`} />
                <span className={`absolute left-0 top-1/2 h-[1.5px] w-4 bg-ink transition ${open ? "opacity-0" : ""}`} />
                <span className={`absolute left-0 top-1/2 h-[1.5px] w-4 bg-ink transition ${open ? "-rotate-45" : "translate-y-[5px]"}`} />
              </span>
            </button>
          </div>
        </div>

        {open ? (
          <div className="max-h-[calc(100vh-7rem)] overflow-y-auto border-t border-ink/10 bg-paper px-4 py-4 lg:hidden">
            <div className="mx-auto flex max-w-6xl flex-col">
              {[...links, ...services, { href: "/contact", label: "Контакти" }].map((item) => (
                <Link key={item.href} href={item.href} className="border-b border-ink/10 py-3.5 text-lg" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <Link
                href="/studio"
                onClick={() => setOpen(false)}
                className="mt-4 rounded-full bg-ember py-3.5 text-center font-semibold text-ink"
              >
                Създай фигурка
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
