"use client";

import Link from "next/link";
import { landingLinks } from "@/lib/landing-links";
import { socials } from "@/lib/site";
import { useLang } from "./lang";

const icons: Record<string, React.ReactNode> = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </>
  ),
  TikTok: <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.4 2.6 2.2 4.4 5 4.6" />,
  Facebook: <path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4A21 21 0 0 0 15.3 4.3c-2.3 0-3.8 1.4-3.8 3.9v2.3H9v3h2.5V21" />,
};

const legal = [
  { path: "/terms", label: { bg: "Общи условия", en: "Terms and conditions" } },
  { path: "/poveritelnost", label: { bg: "Поверителност", en: "Privacy policy" } },
  { path: "/dostavka", label: { bg: "Доставка и плащане", en: "Delivery and payment" } },
  { path: "/vrashtane", label: { bg: "Връщане и рекламации", en: "Returns and complaints" } },
];

export default function Footer({ sellerLine }: { sellerLine?: string }) {
  const { lang, t, href } = useLang();
  return (
    <footer className="bg-ink px-4 py-14 text-paper sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl">HandyCrafts</p>
          <p className="mt-4 max-w-xs text-sm leading-7 text-paper/65">{t.footer.about}</p>
          <div className="mt-5 flex gap-2.5">
            {socials.map((profile) => (
              <a
                key={profile.name}
                href={profile.url}
                target="_blank"
                rel="noopener"
                aria-label={profile.name}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-paper/80 transition hover:bg-ember hover:text-ink"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {icons[profile.name]}
                </svg>
              </a>
            ))}
          </div>
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
            <Link href={href("/idei")} className="block hover:text-paper">{lang === "en" ? "Gift ideas" : "Идеи за подаръци"}</Link>
            <Link href={href("/#faq")} className="block hover:text-paper">{t.nav.faq}</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-paper/45">{t.footer.contact}</p>
          <div className="mt-4 space-y-2 text-sm text-paper/75">
            <a href="mailto:handycraftshelp@gmail.com" className="block hover:text-paper">handycraftshelp@gmail.com</a>
            {lang === "bg" ? (
              <Link href="/figurka-po-snimka/ruse" className="block hover:text-paper">Фигурки в Русе</Link>
            ) : (
              <p>{t.footer.city}</p>
            )}
            <Link href={href("/contact")} className="block hover:text-paper">{t.footer.write}</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-paper/45">{lang === "en" ? "Legal" : "Информация"}</p>
          <div className="mt-4 space-y-2 text-sm text-paper/75">
            {legal.map((page) => (
              <Link key={page.path} href={href(page.path)} className="block hover:text-paper">
                {page.label[lang]}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-white/10 pt-6 text-xs text-paper/40 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} HandyCrafts{sellerLine ? ` · ${sellerLine}` : ""}</p>
        <p>{t.footer.bottom}</p>
      </div>
    </footer>
  );
}
