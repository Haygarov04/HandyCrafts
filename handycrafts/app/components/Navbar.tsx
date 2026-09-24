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
      className={`relative grid h-11 w-11 place-items-center rounded-full transition hover:bg-paper ${className}`}
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
      className={`grid h-11 min-w-11 place-items-center rounded-full px-2 text-sm font-bold transition hover:bg-paper ${className}`}
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

  const pill = "rounded-[1.6rem] bg-white/95 shadow-[0_10px_30px_rgba(22,21,19,0.08)] backdrop-blur";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <Link href={href("/")} onClick={() => setOpen(false)} className={`${pill} flex h-16 shrink-0 items-center gap-2.5 px-2.5 sm:px-4`}>
          <Image src="/logo-remove.png" alt="" width={44} height={44} className="h-11 w-11" priority />
          <span className="hidden font-display text-[17px] font-semibold tracking-tight sm:inline">HandyCrafts</span>
        </Link>

        <nav className={`${pill} hidden h-16 items-center gap-6 px-7 text-[15px] lg:flex`}>
          {links.filter((item) => !item.mobileOnly).map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ember-deep">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={`${pill} flex h-16 shrink-0 items-center gap-0.5 pl-2.5 pr-1.5 sm:gap-1 sm:pr-2`}>
          <LangSwitch className="hidden sm:grid" />
          <Link
            href={href("/studio")}
            className="rounded-2xl bg-ember px-4 py-3 text-sm font-bold text-ink shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)] transition hover:bg-ember-deep sm:px-5"
          >
            {t.nav.order}
          </Link>
          <CartButton />
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full hover:bg-paper lg:hidden"
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
          <a
            href={switchPath(pathname)}
            className="block rounded-2xl px-4 py-3.5 text-lg font-semibold hover:bg-paper"
          >
            {t.nav.switchLabel} · {t.nav.switchTo}
          </a>
        </div>
      ) : null}
    </header>
  );
}
