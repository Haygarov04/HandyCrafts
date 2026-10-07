"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/app/components/Analytics";
import { preparePhoto } from "@/app/components/prepare-photo";
import type { Lang } from "@/lib/i18n";

type Version = { draftId: string; url: string };
type Entry =
  | { kind: "you"; text: string; photo?: string }
  | { kind: "version"; version: Version; n: number }
  | { kind: "error"; text: string };

const copy = {
  bg: {
    title: "Искаш промяна? Кажи ни като в чат",
    intro: "Пиши какво да променим и ще ти покажем нова версия. Можеш да добавиш и още снимка — например на лицето отблизо или на човек, който не е на първата.",
    ideas: ["По-дълга коса", "Махни очилата", "Друг цвят на дрехите", "По-широка усмивка", "Да се държат за ръце"],
    placeholder: "Напр. по-тъмна коса",
    send: "Изпрати",
    attach: "Добави снимка",
    removePhoto: "Махни снимката",
    working: "Правим промяната… около минута",
    version: (n: number) => (n === 1 ? "Първа версия" : `Версия ${n}`),
    current: "Тази е избрана",
    choose: "Избери тази",
    badPhoto: "Не успяхме да отворим тази снимка.",
    failed: "Нещо се обърка. Опитай пак.",
  },
  en: {
    title: "Want a change? Tell us like in a chat",
    intro: "Write what to change and we'll show you a new version. You can add another photo too — a close-up of the face, or someone who isn't in the first one.",
    ideas: ["Longer hair", "Remove the glasses", "Different clothes colour", "Bigger smile", "Holding hands"],
    placeholder: "E.g. darker hair",
    send: "Send",
    attach: "Add a photo",
    removePhoto: "Remove the photo",
    working: "Making the change… about a minute",
    version: (n: number) => (n === 1 ? "First version" : `Version ${n}`),
    current: "Selected",
    choose: "Choose this one",
    badPhoto: "We couldn't open this photo.",
    failed: "Something went wrong. Please try again.",
  },
};

const KEY = "hc_chat_v1";

/** The saved thread this version belongs to, so a reload keeps the conversation. */
function load(draftId: string): { first: string; entries: Entry[] } | null {
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) || "null") as { first: string; entries: Entry[] } | null;
    const mine = saved?.entries.some((entry) => entry.kind === "version" && entry.version.draftId === draftId);
    return mine ? saved : null;
  } catch {
    return null;
  }
}

/**
 * Under the first preview: the customer describes changes (and can add a photo) and gets new
 * versions until it looks right. Every version stays in the thread so they can go back to one.
 */
export default function PreviewChat({ lang, current, onVersion }: { lang: Lang; current: Version; onVersion: (version: Version) => void }) {
  const c = copy[lang];
  const fileRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [first, setFirst] = useState(() => load(current.draftId)?.first || current.draftId);
  const [entries, setEntries] = useState<Entry[]>(() => load(current.draftId)?.entries || [{ kind: "version", version: current, n: 1 }]);
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<{ file: File; url: string } | null>(null);
  const [busy, setBusy] = useState(false);

  // A brand-new preview (not one made here) starts a new thread; a reload picks the old one up.
  useEffect(() => {
    const known = entries.some((entry) => entry.kind === "version" && entry.version.draftId === current.draftId);
    if (known) return;
    queueMicrotask(() => {
      setFirst(current.draftId);
      setEntries([{ kind: "version", version: current, n: 1 }]);
    });
  }, [current, entries]);

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ first, entries: entries.map((e) => (e.kind === "you" ? { ...e, photo: undefined } : e)) }));
    } catch {}
  }, [first, entries]);

  const versions = entries.filter((entry): entry is Extract<Entry, { kind: "version" }> => entry.kind === "version");

  async function attach(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = event.target.files?.[0];
    event.target.value = "";
    if (!picked) return;
    try {
      const file = await preparePhoto(picked);
      setPhoto({ file, url: URL.createObjectURL(file) });
    } catch {
      setEntries((list) => [...list, { kind: "error", text: c.badPhoto }]);
    }
  }

  async function send(wish = text) {
    const message = wish.trim();
    if ((!message && !photo) || busy) return;
    const sentPhoto = photo;
    setEntries((list) => [...list, { kind: "you", text: message, photo: sentPhoto?.url }]);
    setText("");
    setPhoto(null);
    setBusy(true);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 50);
    try {
      const body = new FormData();
      body.set("draftId", current.draftId);
      body.set("message", message);
      if (sentPhoto) body.set("photo", sentPhoto.file);
      const res = await fetch("/api/studio/edit", { method: "POST", body, headers: { "x-lang": lang } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.draftId) throw new Error(data.error || c.failed);
      await new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = data.previewUrl;
      });
      const version = { draftId: data.draftId, url: data.previewUrl };
      setEntries((list) => [...list, { kind: "version", version, n: list.filter((e) => e.kind === "version").length + 1 }]);
      onVersion(version);
      trackEvent("edit_preview", { photo: Boolean(sentPhoto) });
    } catch (issue) {
      setEntries((list) => [...list, { kind: "error", text: issue instanceof Error ? issue.message : c.failed }]);
    } finally {
      setBusy(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 50);
    }
  }

  return (
    <div className="mt-6 rounded-3xl bg-white p-4 sm:p-5">
      <p className="font-semibold">{c.title}</p>
      <p className="mt-1 text-sm text-ink/60">{c.intro}</p>

      {versions.length > 1 || entries.length > 1 ? (
        <ul className="mt-4 space-y-3">
          {entries.map((entry, index) =>
            entry.kind === "you" ? (
              <li key={index} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm text-paper">
                {entry.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={entry.photo} alt="" className="mb-2 h-20 w-20 rounded-xl object-cover" />
                ) : null}
                {entry.text}
              </li>
            ) : entry.kind === "error" ? (
              <li key={index} className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-red-50 px-4 py-2.5 text-sm text-red-800">
                {entry.text}
              </li>
            ) : (
              <li key={index} className="flex w-fit max-w-[85%] items-center gap-3 rounded-2xl rounded-bl-md bg-paper p-2 pr-4">
                <button type="button" onClick={() => onVersion(entry.version)} className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.version.url}
                    alt=""
                    className={`h-20 w-20 rounded-xl object-cover ${entry.version.draftId === current.draftId ? "ring-2 ring-ember" : ""}`}
                  />
                </button>
                <span className="text-sm">
                  <span className="block font-semibold">{c.version(entry.n)}</span>
                  {entry.version.draftId === current.draftId ? (
                    <span className="text-ember-deep">{c.current}</span>
                  ) : (
                    <button type="button" onClick={() => onVersion(entry.version)} className="underline decoration-ember underline-offset-2">
                      {c.choose}
                    </button>
                  )}
                </span>
              </li>
            )
          )}
          {busy ? (
            <li className="flex w-fit items-center gap-3 rounded-2xl rounded-bl-md bg-paper px-4 py-3 text-sm text-ink/70">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/15 border-t-ember" />
              {c.working}
            </li>
          ) : null}
        </ul>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {c.ideas.map((idea) => (
            <button key={idea} type="button" onClick={() => setText(idea)} className="rounded-full border border-ink/15 px-3 py-1.5 text-sm">
              {idea}
            </button>
          ))}
        </div>
      )}
      <div ref={endRef} />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
        className="mt-4"
      >
        {photo ? (
          <div className="mb-2 flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt="" className="h-14 w-14 rounded-xl object-cover" />
            <button type="button" onClick={() => setPhoto(null)} className="text-sm text-ink/55 underline">
              {c.removePhoto}
            </button>
          </div>
        ) : null}
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            aria-label={c.attach}
            title={c.attach}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ink/15 disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 12.5 12.6 21a5.5 5.5 0 0 1-7.8-7.8l8.9-8.9a3.7 3.7 0 0 1 5.2 5.2l-8.9 8.9a1.8 1.8 0 0 1-2.6-2.6l8.2-8.2" />
            </svg>
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={attach} className="hidden" />
          <textarea
            rows={1}
            maxLength={300}
            value={text}
            disabled={busy}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            placeholder={c.placeholder}
            className="min-h-12 min-w-0 flex-1 resize-none rounded-3xl border border-ink/15 bg-paper px-4 py-3 outline-none focus:border-ink disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={busy || (!text.trim() && !photo)}
            className="h-12 shrink-0 rounded-full bg-ink px-5 font-semibold text-paper disabled:opacity-40"
          >
            {c.send}
          </button>
        </div>
      </form>
    </div>
  );
}
