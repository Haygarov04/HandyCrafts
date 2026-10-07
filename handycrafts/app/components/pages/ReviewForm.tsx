"use client";

import Link from "next/link";
import { useState } from "react";
import { localize, type Lang } from "@/lib/i18n";

const copy = {
  bg: {
    title: "Как ти хареса фигурката?",
    lead: (n: string) => `Поръчка ${n}. Няколко изречения са напълно достатъчни.`,
    rating: "Оценка",
    text: "Твоят отзив",
    placeholder: "Какво ти хареса? Как реагира човекът, за когото беше подаръкът?",
    name: "Име, което да покажем",
    consent: "Съгласен/на съм отзивът да се публикува на сайта с името и града ми.",
    send: "Изпрати отзива",
    sending: "Изпращане…",
    invalid: "Този линк не е валиден или е изтекъл. Пиши ни на handycraftshelp@gmail.com.",
    thanks: "Благодарим ти! ❤",
    thanksText: "Получихме отзива. Ще го публикуваме на сайта след като го прегледаме.",
    google: "Сподели го и в Google",
    googleText: "Ако имаш още минута — отзив в Google помага много на други хора да ни открият.",
    again: "Направи още една фигурка",
    failed: "Нещо се обърка. Опитай пак.",
  },
  en: {
    title: "How do you like your figurine?",
    lead: (n: string) => `Order ${n}. A few sentences are plenty.`,
    rating: "Rating",
    text: "Your review",
    placeholder: "What did you like? How did the person you gave it to react?",
    name: "Name to show",
    consent: "I agree that the review may be published on the site with my name and city.",
    send: "Send review",
    sending: "Sending…",
    invalid: "This link isn't valid or has expired. Write to us at handycraftshelp@gmail.com.",
    thanks: "Thank you! ❤",
    thanksText: "We've got your review. We'll publish it on the site once we've read it.",
    google: "Share it on Google too",
    googleText: "If you have one more minute — a Google review helps other people find us.",
    again: "Make another figurine",
    failed: "Something went wrong. Please try again.",
  },
};

type Props = { lang: Lang; order: { id: string; number: string; name: string } | null; token: string };

export default function ReviewForm({ lang, order, token }: Props) {
  const c = copy[lang];
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [name, setName] = useState(order?.name || "");
  const [consent, setConsent] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ google: string } | null>(null);

  if (!order) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 pt-24 text-center">
        <p className="w-full rounded-[2rem] bg-white p-8 text-ink/70">{c.invalid}</p>
      </div>
    );
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ o: order!.id, t: token, rating, text, name, consent, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || c.failed);
      setDone({ google: data.google || "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : c.failed);
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-xl flex-col items-center justify-center px-4 pb-20 pt-32 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-ember text-4xl">✓</span>
        <h1 className="mt-8 text-3xl sm:text-5xl">{c.thanks}</h1>
        <p className="mt-4 text-lg text-ink/70">{c.thanksText}</p>
        {done.google ? (
          <div className="mt-8 w-full rounded-[2rem] bg-white p-6">
            <p className="text-sm text-ink/65">{c.googleText}</p>
            <a href={done.google} target="_blank" rel="noreferrer" className="mt-4 inline-block rounded-full bg-ink px-7 py-3.5 font-semibold text-paper">
              {c.google}
            </a>
          </div>
        ) : null}
        <Link href={localize(lang, "/studio")} className="mt-6 font-semibold underline decoration-ember underline-offset-4">
          {c.again}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 pb-24 pt-28 sm:pt-36">
      <h1 className="text-3xl sm:text-5xl">{c.title}</h1>
      <p className="mt-3 text-ink/60">{c.lead(order.number)}</p>
      <form onSubmit={submit} className="mt-8 space-y-5 rounded-[2rem] bg-white p-6">
        <fieldset>
          <legend className="text-sm font-semibold">{c.rating}</legend>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`${n}`}
                aria-pressed={rating === n}
                className={`text-4xl leading-none transition ${n <= rating ? "text-ember" : "text-ink/15"}`}
              >
                ★
              </button>
            ))}
          </div>
        </fieldset>
        <label className="block">
          <span className="text-sm font-semibold">{c.text}</span>
          <textarea
            required
            minLength={10}
            maxLength={1200}
            rows={5}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={c.placeholder}
            className="mt-2 w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 outline-none focus:border-ink"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">{c.name}</span>
          <input
            required
            maxLength={40}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-full border border-ink/15 bg-paper px-4 py-3 outline-none focus:border-ink"
          />
        </label>
        <label className="flex items-start gap-3 text-sm text-ink/70">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-ember" />
          {c.consent}
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" disabled={sending} className="w-full rounded-full bg-ink px-6 py-3.5 font-semibold text-paper disabled:opacity-50">
          {sending ? c.sending : c.send}
        </button>
      </form>
    </div>
  );
}
