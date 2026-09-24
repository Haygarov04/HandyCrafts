"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { switchPath } from "@/lib/i18n";
import { useLang } from "./lang";
import { useCart } from "./cart";


export function CartButton({ className = "" }: { className?: string }) {
  const cart = useCart();
  const { t } = useLang();
  return (
    <button
      type="button"
      onClick={() => cart.setOpen(true)}
      className={`relative grid h-11 w-11 place-items-center rounded-full transition hover:bg-sand ${className}`}
      aria-label={t.nav.cart(cart.count)}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
        <path d="M2.5 3.5h2.6l2.4 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2l1.6-6.8H6.3" />
      </svg>
      {cart.ready && cart.count > 0 ? (
        <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1 text-[11px] font-bold text-ink">
          {cart.count}
        </span>
      ) : null}
    </button>
  );
}

export function LangSwitch({ className = "" }: { className?: string }) {
  const pathname = usePathname() || "/";
  const { t } = useLang();
  return (
    <a
      href={switchPath(pathname)}
      hrefLang={t.nav.switchTo.toLowerCase()}
      aria-label={t.nav.switchLabel}
      className={`grid h-11 min-w-11 place-items-center rounded-full px-2 text-sm font-bold transition hover:bg-sand ${className}`}
    >
      {t.nav.switchTo}
    </a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { lang, t, href } = useLang();
  const pathname = usePathname() || "/";
  const links = [
    { href: href("/studio?product=figurine"), label: t.nav.figurines },
    { href: href("/studio?product=figurine&subject=pet"), label: t.nav.pets },
    { href: href("/studio?product=keychain"), label: t.nav.keychains },
    { href: href("/idei"), label: lang === "en" ? "Ideas" : "Идеи" },
    { href: href("/#how"), label: t.nav.how },
    { href: href("/#faq"), label: t.nav.faq },
    { href: href("/contact"), label: t.nav.contact, mobileOnly: true },
  ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-paper/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6">
        <Link href={href("/")} onClick={() => setOpen(false)} className="flex shrink-0 items-center gap-2.5">
          <Image src="/logo-remove.png" alt="" width={40} height={40} className="h-10 w-10" priority />
          <span className="leading-none">
            <span className="block font-display text-[19px] font-semibold">HandyCrafts</span>
            <span className="mt-1 hidden text-[11px] uppercase tracking-[0.18em] text-ink/50 sm:block">
              {lang === "en" ? "Figurine workshop" : "Работилница за фигурки"}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-[15px] lg:flex">
          {links.filter((item) => !item.mobileOnly).map((item) => (
            <Link key={item.href} href={item.href} className="relative py-1 transition after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:origin-left after:scale-x-0 after:bg-ember after:transition hover:after:scale-x-100">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <LangSwitch className="hidden sm:grid" />
          <CartButton />
          <Link
            href={href("/studio")}
            className="hidden rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-ember hover:text-ink sm:inline-flex"
          >
            {t.nav.order}
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand lg:hidden"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
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
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-ink/10 bg-paper px-4 pb-6 pt-2 lg:hidden">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-b border-ink/10 py-4 font-display text-2xl"
            >
              {item.label}
            </Link>
          ))}
          <a href={switchPath(pathname)} className="block py-4 text-sm font-semibold text-ink/60">
            {t.nav.switchLabel} · {t.nav.switchTo}
          </a>
          <Link
            href={href("/studio")}
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-xl bg-ink py-4 text-center font-semibold text-paper"
          >
            {t.nav.order}
          </Link>
        </div>
      ) : null}
    </header>
  );
}
