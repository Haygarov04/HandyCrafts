"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { switchPath } from "@/lib/i18n";
import { useLang } from "./lang";

const DISMISSED = "hc_lang_hint";

/** Offers the English site to visitors on a Bulgarian page from outside Bulgaria. Never redirects. */
export default function LangHint() {
  const { lang } = useLang();
  const pathname = usePathname() || "/";
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (lang !== "bg") return;
    try {
      if (localStorage.getItem(DISMISSED)) return;
    } catch {}
    let cancelled = false;
    fetch("/api/geo")
      .then((res) => res.json())
      .catch(() => ({ country: "" }))
      .then(({ country }: { country?: string }) => {
        // Abroad by IP, or (when the country isn't known) a browser that doesn't speak Bulgarian.
        const abroad = country ? country !== "BG" : !navigator.languages.some((language) => language.toLowerCase().startsWith("bg"));
        if (!cancelled && abroad) setShow(true);
      });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  if (!show || lang !== "bg") return null;

  function dismiss() {
    setShow(false);
    try {
      localStorage.setItem(DISMISSED, "1");
    } catch {}
  }

  return (
    <div className="fixed inset-x-4 top-[4.75rem] z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-ink/10 bg-white/95 px-4 py-3 shadow-[0_12px_30px_rgba(22,21,19,0.15)] backdrop-blur sm:left-auto sm:right-4 sm:mx-0">
      <span aria-hidden className="text-xl">🌍</span>
      <p className="min-w-0 flex-1 text-sm leading-snug">
        <b className="font-semibold">This page is in Bulgarian.</b> <span className="text-ink/60">The whole site is in English too.</span>
      </p>
      <a href={switchPath(pathname)} hrefLang="en" onClick={dismiss} className="shrink-0 rounded-full bg-ink px-3.5 py-2 text-sm font-semibold text-paper transition hover:bg-ember hover:text-ink">
        English
      </a>
      <button type="button" onClick={dismiss} aria-label="Close" className="shrink-0 px-1 text-ink/40 hover:text-ink">
        ✕
      </button>
    </div>
  );
}
