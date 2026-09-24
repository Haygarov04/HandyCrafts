"use client";

import Link from "next/link";
import { landingLinks } from "@/lib/landing-links";
import { useLang } from "./lang";

export default function Footer() {
  const { lang, t, href } = useLang();
  return (
    <footer className="bg-ink px-4 py-14 text-paper sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl">HandyCrafts</p>
          <p className="mt-4 max-w-xs text-sm leading-7 text-paper/65">{t.footer.about}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-paper/45">{t.footer.shop}</p>
          <div className="mt-4 space-y-2 text-sm text-paper/75">
            <Link href={href("/#how")} className="block hover:text-paper">{t.nav.how}</Link>
            {landingLinks.map((page) => (
              <Link key={page.path} href={href(page.path)} className="block hover:text-paper">
                {page.label[lang]}
              </Link>
            ))}
            <Link href={href("/#faq")} className="block hover:text-paper">{t.nav.faq}</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-paper/45">{t.footer.contact}</p>
          <div className="mt-4 space-y-2 text-sm text-paper/75">
            <a href="mailto:handycraftshelp@gmail.com" className="block hover:text-paper">handycraftshelp@gmail.com</a>
            <p>{t.footer.city}</p>
            <Link href={href("/contact")} className="block hover:text-paper">{t.footer.write}</Link>
            <Link href={href("/terms")} className="block hover:text-paper">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-white/10 pt-6 text-xs text-paper/40 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} HandyCrafts 3D</p>
        <p>{t.footer.bottom}</p>
      </div>
    </footer>
  );
}
