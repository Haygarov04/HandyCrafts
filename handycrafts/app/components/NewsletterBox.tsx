"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "./lang";

const text = {
  bg: {
    kicker: "Бюлетин",
    title: ["Едно писмо", "на месец."],
    lead: "Идеи за подаръци преди празниците и нови модели от работилницата. Без реклами всеки ден.",
    placeholder: "Имейл",
    button: "Запиши ме",
    busy: "…",
    done: "Готово! Провери пощата си ♡",
    consent: ["Записвайки се, приемаш да получаваш имейли от HandyCrafts. Отписваш се с един клик.", "Условия"],
  },
  en: {
    kicker: "Newsletter",
    title: ["One letter", "a month."],
    lead: "Gift ideas before the holidays and new pieces from the workshop. No daily ads.",
    placeholder: "Email",
    button: "Sign me up",
    busy: "…",
    done: "Done! Check your inbox ♡",
    consent: ["By signing up you agree to receive emails from HandyCrafts. Unsubscribe in one click.", "Terms"],
  },
};

export default function NewsletterBox() {
  const { lang, href } = useLang();
  const t = text[lang];
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setState("busy");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-lang": lang },
      body: JSON.stringify({ email, lang, website }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "");
      setState("idle");
      return;
    }
    setState("done");
  }

  return (
    <section className="px-4 pb-20 sm:px-6">
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-[2rem] bg-ink px-6 py-10 text-paper sm:px-10 sm:py-12 md:grid-cols-[1fr_1fr]">
        <span className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-ember/25 blur-2xl" />
        <div className="relative">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-ember text-ink">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="m4 7 8 6 8-6" />
            </svg>
          </span>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-ember">{t.kicker}</p>
          <h2 className="mt-2 text-3xl leading-[1.05] sm:text-5xl">
            {t.title[0]}
            <span className="block text-paper/70">{t.title[1]}</span>
          </h2>
          <p className="mt-4 max-w-md leading-7 text-paper/70">{t.lead}</p>
        </div>

        <div className="relative">
          {state === "done" ? (
            <p className="rounded-2xl bg-white/10 px-5 py-4 text-lg font-semibold">{t.done}</p>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t.placeholder}
                aria-label={t.placeholder}
                className="min-w-0 flex-1 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-paper outline-none placeholder:text-paper/45 focus:border-ember"
              />
              <input
                tabIndex={-1}
                aria-hidden
                autoComplete="off"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />
              <button
                type="submit"
                disabled={state === "busy"}
                className="rounded-2xl bg-ember px-6 py-4 font-bold text-ink transition hover:bg-paper disabled:opacity-60"
              >
                {state === "busy" ? t.busy : t.button}
              </button>
            </form>
          )}
          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
          <p className="mt-4 text-xs leading-5 text-paper/50">
            {t.consent[0]}{" "}
            <Link href={href("/terms")} className="underline underline-offset-2">
              {t.consent[1]}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
