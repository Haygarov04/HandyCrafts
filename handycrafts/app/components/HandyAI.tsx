"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { trackEvent } from "@/app/components/Analytics";
import { preparePhoto } from "@/app/components/prepare-photo";
import type { Lang } from "@/lib/i18n";

type Version = { draftId: string; url: string };
type Quick = "cart" | "more" | "prev" | `idea:${string}`;
type Entry =
  | { kind: "bot"; text: string; quick?: Quick[]; checkout?: boolean }
  | { kind: "you"; text: string; photo?: string }
  | { kind: "version"; version: Version; n: number };

const copy = {
  bg: {
    launch: "Редактирай с Handy AI",
    launchText: "Коса, дрехи, поза, още човек — кажи с думи или прати снимка.",
    online: "Онлайн",
    thinking: "пише…",
    drawing: "рисува новата версия…",
    left: (n: number) =>
      n === 1 ? "остава 1 промяна" : `остават ${n} промени`,
    close: "Затвори",
    hello:
      "Здравей! Аз съм Handy AI ✦ Кажи ми какво да променя по фигурката — коса, дрехи, поза, аксесоари — или ми прати още снимка, например на човек, който не е на първата.",
    ideas: [
      "По-дълга коса",
      "Друга прическа",
      "Друг цвят на дрехите",
      "По-широка усмивка",
    ],
    placeholder: "Напиши какво да променя…",
    attach: "Добави снимка",
    removePhoto: "Махни",
    send: "Изпрати",
    drawingNote: "Около минута — можеш да разгледаш размерите междувременно.",
    version: (n: number) => (n === 1 ? "Първа версия" : `Версия ${n}`),
    selected: "Избрана",
    pick: "Избери",
    newVersion: (n: number) => `Ето версия ${n} ✨ Как ти се струва?`,
    quick: {
      cart: "Харесва ми — в количката",
      more: "Още промяна",
      prev: "Върни предишната",
    },
    liked: "Харесва ми!",
    more: "Искам още промяна",
    prev: "Върни предишната",
    prevDone:
      "Върнах предишната версия. Кажи, ако искаш да пробваме нещо друго.",
    moreReply: "Разбира се — пиши ми какво още да променя.",
    added:
      "Супер! Добавих я в количката 🎉 Плащаш чак когато получиш пратката. Остава само да попълниш адреса.",
    checkout: "Към поръчката →",
    badPhoto: "Не успях да отворя тази снимка. Опитай с друга.",
    failed: "Нещо се обърка от моя страна. Опитай пак след малко.",
  },
  en: {
    launch: "Edit with Handy AI",
    launchText:
      "Hair, clothes, pose, another person — say it in words or send a photo.",
    online: "Online",
    thinking: "typing…",
    drawing: "drawing the new version…",
    left: (n: number) => (n === 1 ? "1 change left" : `${n} changes left`),
    close: "Close",
    hello:
      "Hi! I'm Handy AI ✦ Tell me what to change on the figurine — hair, clothes, pose, accessories — or send me another photo, for example of someone who isn't in the first one.",
    ideas: [
      "Longer hair",
      "A different hairstyle",
      "Different clothes colour",
      "Bigger smile",
    ],
    placeholder: "Tell me what to change…",
    attach: "Add a photo",
    removePhoto: "Remove",
    send: "Send",
    drawingNote: "About a minute — feel free to look at the sizes meanwhile.",
    version: (n: number) => (n === 1 ? "First version" : `Version ${n}`),
    selected: "Selected",
    pick: "Choose",
    newVersion: (n: number) => `Here's version ${n} ✨ What do you think?`,
    quick: {
      cart: "I love it — add to cart",
      more: "One more change",
      prev: "Go back to the previous one",
    },
    liked: "I love it!",
    more: "I'd like another change",
    prev: "Go back to the previous one",
    prevDone:
      "I've put the previous version back. Tell me if you'd like to try something else.",
    moreReply: "Of course — tell me what else to change.",
    added:
      "Great! It's in your cart 🎉 You only pay when the parcel arrives. Just the address left to fill in.",
    checkout: "Go to checkout →",
    badPhoto: "I couldn't open that photo. Try another one.",
    failed: "Something went wrong on my side. Please try again in a moment.",
  },
};

const KEY = "hc_handy_ai_v1";
type Saved = { first: string; entries: Entry[]; editsLeft: number | null };

/** The saved conversation this version belongs to, so a reload keeps it. */
function load(draftId: string): Saved | null {
  try {
    const saved = JSON.parse(
      sessionStorage.getItem(KEY) || "null",
    ) as Saved | null;
    return saved?.entries.some(
      (e) => e.kind === "version" && e.version.draftId === draftId,
    )
      ? saved
      : null;
  } catch {
    return null;
  }
}

function fresh(lang: Lang, version: Version): Entry[] {
  return [
    { kind: "version", version, n: 1 },
    {
      kind: "bot",
      text: copy[lang].hello,
      quick: copy[lang].ideas.map((idea) => `idea:${idea}` as Quick),
    },
  ];
}

function Avatar({ size = 40 }: { size?: number }) {
  return (
    <span
      className="relative grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-ember via-[#ff9a3c] to-ember-deep text-paper shadow-[0_6px_18px_rgba(255,122,0,0.35)]"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2l1.9 5.6L19.5 9.5 13.9 11.4 12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2zM19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9L19 15z" />
      </svg>
    </span>
  );
}

type Props = {
  lang: Lang;
  current: Version;
  added: boolean;
  checkoutHref: string;
  onVersion: (version: Version) => void;
  onAddToCart: () => void;
};

/**
 * "Edit with Handy AI": a launcher under the preview and a chat sheet that sits between the studio's
 * step header and its bottom bar, so the steps and "Add to cart" stay in view the whole time.
 */
export default function HandyAI({
  lang,
  current,
  added,
  checkoutHref,
  onVersion,
  onAddToCart,
}: Props) {
  const c = copy[lang];
  const [open, setOpen] = useState(false);
  const [first, setFirst] = useState(
    () => load(current.draftId)?.first || current.draftId,
  );
  const [entries, setEntries] = useState<Entry[]>(
    () => load(current.draftId)?.entries || fresh(lang, current),
  );
  const [editsLeft, setEditsLeft] = useState<number | null>(
    () => load(current.draftId)?.editsLeft ?? null,
  );
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<{ file: File; url: string } | null>(null);
  const [phase, setPhase] = useState<"idle" | "thinking" | "drawing">("idle");
  const [progress, setProgress] = useState(0);
  const [barHeight, setBarHeight] = useState(72);
  const [desktop, setDesktop] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const wasAdded = useRef(added);

  // The studio can open the chat from elsewhere, e.g. the button over the preview image.
  useEffect(() => {
    const show = () => {
      setOpen(true);
      trackEvent("handy_ai_open", { from: "preview" });
    };
    const hide = () => setOpen(false);
    window.addEventListener("handy-ai:open", show);
    window.addEventListener("handy-ai:close", hide);
    return () => {
      window.removeEventListener("handy-ai:open", show);
      window.removeEventListener("handy-ai:close", hide);
    };
  }, []);

  const versions = entries.filter(
    (e): e is Extract<Entry, { kind: "version" }> => e.kind === "version",
  );
  const busy = phase !== "idle";

  // A brand-new preview made outside the chat ("Нов опит") starts a new conversation.
  useEffect(() => {
    if (versions.some((v) => v.version.draftId === current.draftId)) return;
    queueMicrotask(() => {
      setFirst(current.draftId);
      setEntries(fresh(lang, current));
      setEditsLeft(null);
    });
  }, [current, versions, lang]);

  useEffect(() => {
    try {
      const keep = entries.map((e) =>
        e.kind === "you" ? { ...e, photo: undefined } : e,
      );
      sessionStorage.setItem(
        KEY,
        JSON.stringify({ first, entries: keep, editsLeft } satisfies Saved),
      );
    } catch {}
  }, [first, entries, editsLeft]);

  const scrollDown = useCallback(() => {
    requestAnimationFrame(() =>
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      }),
    );
  }, []);

  useEffect(() => {
    if (open) scrollDown();
  }, [open, entries.length, phase, scrollDown]);

  // The studio's bottom bar changes height between phone and desktop; keep the sheet right above it.
  useEffect(() => {
    if (!open) return;
    const bar = document.getElementById("studio-bar");
    const measure = () => {
      setBarHeight(bar?.offsetHeight || 72);
      setDesktop(window.innerWidth >= 1280);
    };
    measure();
    const observer = bar ? new ResizeObserver(measure) : null;
    if (bar && observer) observer.observe(bar);
    window.addEventListener("resize", measure);
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    // On phones the sheet covers the page, so the page itself shouldn't scroll underneath.
    const lock = window.matchMedia("(max-width: 1279px)").matches;
    if (lock) document.body.style.overflow = "hidden";
    // On wide screens the studio slides left to make room for the panel (see globals.css).
    document.body.classList.add("hc-ai-open", "hc-chat-open");
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("keydown", onKey);
      if (lock) document.body.style.overflow = "";
      document.body.classList.remove("hc-ai-open", "hc-chat-open");
    };
  }, [open]);

  // "Add to cart" from the bottom bar or from the chat: confirm it in the conversation.
  useEffect(() => {
    if (added && !wasAdded.current) {
      queueMicrotask(() =>
        setEntries((list) => [
          ...list,
          { kind: "bot", text: c.added, checkout: true },
        ]),
      );
    }
    wasAdded.current = added;
  }, [added, c.added]);

  useEffect(() => {
    if (phase !== "drawing") return;
    const timer = window.setInterval(
      () => setProgress((p) => (p < 94 ? p + (p < 60 ? 3 : 1) : p)),
      900,
    );
    return () => window.clearInterval(timer);
  }, [phase]);

  const say = (entry: Entry) => setEntries((list) => [...list, entry]);

  async function attach(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = event.target.files?.[0];
    event.target.value = "";
    if (!picked) return;
    try {
      const file = await preparePhoto(picked);
      setPhoto({ file, url: URL.createObjectURL(file) });
      inputRef.current?.focus();
    } catch {
      say({ kind: "bot", text: c.badPhoto });
    }
  }

  async function send(raw = text) {
    const message = raw.trim().slice(0, 300);
    if ((!message && !photo) || busy) return;
    const sentPhoto = photo;
    const history = entries
      .filter(
        (e): e is Extract<Entry, { kind: "bot" | "you" }> =>
          e.kind === "bot" || e.kind === "you",
      )
      .slice(-8)
      .map((e) => ({ role: e.kind, text: e.text }));
    say({ kind: "you", text: message, photo: sentPhoto?.url });
    setText("");
    if (inputRef.current) inputRef.current.style.height = "";
    setPhoto(null);
    setPhase("thinking");
    try {
      const res = await fetch("/api/studio/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftId: current.draftId,
          message,
          hasPhoto: Boolean(sentPhoto),
          history,
          lang,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reply) throw new Error(c.failed);
      if (typeof data.editsLeft === "number") setEditsLeft(data.editsLeft);
      say({
        kind: "bot",
        text: data.reply,
        quick: data.action === "limit" ? ["cart"] : undefined,
      });
      trackEvent("handy_ai_message", { action: data.action });
      if (data.action !== "edit" || !data.ticket) return;

      setProgress(4);
      setPhase("drawing");
      const body = new FormData();
      body.set("ticket", data.ticket);
      if (sentPhoto) body.set("photo", sentPhoto.file);
      const draw = await fetch("/api/studio/edit", {
        method: "POST",
        body,
        headers: { "x-lang": lang },
      });
      const result = await draw.json().catch(() => ({}));
      if (!draw.ok || !result.draftId)
        throw new Error(result.error || c.failed);
      await new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = result.previewUrl;
      });
      setProgress(100);
      const version = { draftId: result.draftId, url: result.previewUrl };
      const n = versions.length + 1;
      if (typeof result.editsLeft === "number") setEditsLeft(result.editsLeft);
      setEntries((list) => [
        ...list,
        { kind: "version", version, n },
        { kind: "bot", text: c.newVersion(n), quick: ["cart", "more", "prev"] },
      ]);
      onVersion(version);
      trackEvent("edit_preview", { photo: Boolean(sentPhoto) });
    } catch (issue) {
      say({
        kind: "bot",
        text: issue instanceof Error ? issue.message : c.failed,
      });
    } finally {
      setPhase("idle");
    }
  }

  function quick(action: Quick) {
    if (busy) return;
    if (action.startsWith("idea:")) return send(action.slice(5));
    if (action === "cart") {
      say({ kind: "you", text: c.liked });
      if (added) say({ kind: "bot", text: c.added, checkout: true });
      else onAddToCart();
      return;
    }
    if (action === "more") {
      say({ kind: "you", text: c.more });
      say({ kind: "bot", text: c.moreReply });
      inputRef.current?.focus();
      return;
    }
    const index = versions.findIndex(
      (v) => v.version.draftId === current.draftId,
    );
    const previous =
      versions[Math.max(0, (index === -1 ? versions.length - 1 : index) - 1)];
    if (previous) {
      say({ kind: "you", text: c.prev });
      onVersion(previous.version);
      say({ kind: "bot", text: c.prevDone, quick: ["cart", "more"] });
    }
  }

  const lastBot = [...entries].reverse().find((e) => e.kind === "bot") as
    | Extract<Entry, { kind: "bot" }>
    | undefined;
  const status =
    phase === "thinking"
      ? c.thinking
      : phase === "drawing"
        ? c.drawing
        : editsLeft !== null
          ? `${c.online} · ${c.left(editsLeft)}`
          : c.online;

  return (
    <>
      {!added ? (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            trackEvent("handy_ai_open", {});
          }}
          className="group relative mt-6 flex w-full items-center gap-4 overflow-hidden rounded-3xl bg-ink p-4 text-left text-paper shadow-[0_18px_40px_rgba(22,21,19,0.22)] transition hover:-translate-y-0.5 sm:p-5"
        >
          <span
            className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-ember/40 blur-3xl transition group-hover:bg-ember/60"
            aria-hidden
          />
          <Avatar size={48} />
          <span className="relative min-w-0 flex-1">
            <span className="block font-display text-lg leading-tight sm:text-xl">
              {c.launch}
            </span>
            <span className="mt-1 block text-sm leading-snug text-paper/70">
              {c.launchText}
            </span>
          </span>
          {versions.length > 1 ? (
            <span className="relative shrink-0 rounded-full bg-paper/10 px-2.5 py-1 text-xs font-semibold">
              {versions.length}×
            </span>
          ) : null}
          <svg
            className="relative shrink-0 transition group-hover:translate-x-1"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      ) : null}

      {open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="false"
              aria-label="Handy AI"
              className="hc-sheet fixed inset-x-0 top-16 z-30 flex flex-col overflow-hidden border-t border-ink/10 bg-cream xl:inset-x-auto xl:right-6 xl:top-20 xl:w-[420px] xl:rounded-[1.75rem] xl:border xl:shadow-[0_30px_80px_rgba(22,21,19,0.25)]"
              style={{ bottom: barHeight + (desktop ? 16 : 0) }}
            >
              <div className="flex items-center gap-3 border-b border-ink/10 bg-white/80 px-4 py-3 backdrop-blur">
                <Avatar />
                <div className="min-w-0 flex-1">
                  <p className="font-display font-semibold leading-tight">
                    Handy AI
                  </p>
                  <p className="flex items-center gap-1.5 truncate text-xs text-ink/55">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${busy ? "animate-pulse bg-ember" : "bg-emerald-500"}`}
                    />
                    {status}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={c.close}
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-ink/5"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              {versions.length > 1 ? (
                <div className="flex gap-2 overflow-x-auto border-b border-ink/10 bg-white/60 px-4 py-2.5">
                  {versions.map((v) => {
                    const on = v.version.draftId === current.draftId;
                    return (
                      <button
                        key={v.version.draftId}
                        type="button"
                        disabled={busy}
                        onClick={() => onVersion(v.version)}
                        className="shrink-0 text-center"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={v.version.url}
                          alt={c.version(v.n)}
                          className={`h-14 w-14 rounded-xl object-cover transition ${on ? "ring-2 ring-ember ring-offset-2 ring-offset-cream" : "opacity-70 hover:opacity-100"}`}
                        />
                        <span
                          className={`mt-1 block text-[10px] ${on ? "font-semibold text-ember-deep" : "text-ink/45"}`}
                        >
                          {on ? c.selected : `${v.n}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}

              <div
                ref={listRef}
                className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
              >
                {entries.map((entry, index) => {
                  if (entry.kind === "you") {
                    return (
                      <div
                        key={index}
                        className="hc-pop ml-auto w-fit max-w-[82%] rounded-[1.25rem] rounded-br-md bg-ink px-4 py-2.5 text-[15px] leading-snug text-paper"
                      >
                        {entry.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={entry.photo}
                            alt=""
                            className="mb-2 h-24 w-24 rounded-xl object-cover"
                          />
                        ) : null}
                        {entry.text}
                      </div>
                    );
                  }
                  if (entry.kind === "version") {
                    const on = entry.version.draftId === current.draftId;
                    return (
                      <div key={index} className="hc-pop flex items-end gap-2">
                        <Avatar size={28} />
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onVersion(entry.version)}
                          className={`w-[68%] max-w-64 overflow-hidden rounded-[1.25rem] rounded-bl-md bg-white text-left shadow-sm transition ${on ? "ring-2 ring-ember" : "hover:shadow-md"}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={entry.version.url}
                            alt={c.version(entry.n)}
                            className="aspect-square w-full object-cover"
                          />
                          <span className="flex items-center justify-between px-3 py-2 text-sm">
                            <span className="font-semibold">
                              {c.version(entry.n)}
                            </span>
                            <span
                              className={
                                on
                                  ? "text-xs font-semibold text-ember-deep"
                                  : "text-xs underline decoration-ember underline-offset-2"
                              }
                            >
                              {on ? c.selected : c.pick}
                            </span>
                          </span>
                        </button>
                      </div>
                    );
                  }
                  return (
                    <div key={index} className="hc-pop flex items-end gap-2">
                      <Avatar size={28} />
                      <div className="max-w-[82%]">
                        <div className="rounded-[1.25rem] rounded-bl-md bg-white px-4 py-2.5 text-[15px] leading-snug shadow-sm">
                          {entry.text}
                        </div>
                        {entry.checkout ? (
                          <Link
                            href={checkoutHref}
                            className="mt-2 inline-block rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-ink shadow-sm"
                          >
                            {c.checkout}
                          </Link>
                        ) : null}
                        {entry.quick && entry === lastBot && !busy ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {entry.quick
                              .filter(
                                (q) =>
                                  !(q === "prev" && versions.length < 2) &&
                                  !(q === "cart" && added),
                              )
                              .map((q) => (
                                <button
                                  key={q}
                                  type="button"
                                  onClick={() => quick(q)}
                                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                                    q === "cart"
                                      ? "bg-ember text-ink hover:bg-ember-deep"
                                      : "border border-ink/15 bg-white hover:border-ink/40"
                                  }`}
                                >
                                  {q.startsWith("idea:")
                                    ? q.slice(5)
                                    : c.quick[q as "cart" | "more" | "prev"]}
                                </button>
                              ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}

                {phase === "thinking" ? (
                  <div className="hc-pop flex items-end gap-2">
                    <Avatar size={28} />
                    <div
                      className="flex gap-1 rounded-[1.25rem] rounded-bl-md bg-white px-4 py-3.5 shadow-sm"
                      aria-label={c.thinking}
                    >
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="hc-dot h-2 w-2 rounded-full bg-ink/60"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
                {phase === "drawing" ? (
                  <div className="hc-pop flex items-end gap-2">
                    <Avatar size={28} />
                    <div className="w-[68%] max-w-64 overflow-hidden rounded-[1.25rem] rounded-bl-md bg-white shadow-sm">
                      <div className="relative aspect-square w-full overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={current.url}
                          alt=""
                          className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
                        />
                        <div className="hc-shimmer absolute inset-0 opacity-60" />
                        <div className="absolute inset-0 grid place-items-center">
                          <span className="rounded-full bg-white/85 px-4 py-2 font-display text-2xl shadow-sm">
                            {progress}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1 bg-sand">
                        <div
                          className="h-full bg-ember transition-[width] duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="px-3 py-2 text-xs text-ink/55">
                        {c.drawingNote}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  send();
                }}
                className="border-t border-ink/10 bg-white px-3 py-3"
              >
                {photo ? (
                  <div className="mb-2 flex items-center gap-2 px-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt=""
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhoto(null)}
                      className="text-sm text-ink/55 underline"
                    >
                      {c.removePhoto}
                    </button>
                  </div>
                ) : null}
                {/* One pill: attach and send sit inside it, so the text gets the whole width. */}
                <div className="flex items-end gap-1 rounded-[1.6rem] border border-ink/15 bg-paper p-1 transition focus-within:border-ink">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={busy}
                    aria-label={c.attach}
                    title={c.attach}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink/60 transition hover:bg-ink/5 disabled:opacity-40"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M21 12.5 12.6 21a5.5 5.5 0 0 1-7.8-7.8l8.9-8.9a3.7 3.7 0 0 1 5.2 5.2l-8.9 8.9a1.8 1.8 0 0 1-2.6-2.6l8.2-8.2" />
                    </svg>
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={attach} className="hidden" />
                  <textarea
                    ref={inputRef}
                    rows={1}
                    maxLength={300}
                    value={text}
                    disabled={busy}
                    onChange={(event) => {
                      setText(event.target.value);
                      event.target.style.height = "auto";
                      event.target.style.height = `${Math.min(event.target.scrollHeight, 132)}px`;
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                        event.preventDefault();
                        send();
                      }
                    }}
                    placeholder={c.placeholder}
                    enterKeyHint="send"
                    className="max-h-[132px] min-h-10 min-w-0 flex-1 resize-none bg-transparent px-1 py-2 text-[16px] leading-6 outline-none placeholder:text-ink/40 disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={busy || (!text.trim() && !photo)}
                    aria-label={c.send}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ember text-ink transition hover:bg-ember-deep disabled:bg-ink/10 disabled:text-ink/30"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>,
            // Outside the studio's <main>, which slides on wide screens and would carry a fixed panel with it.
            document.body,
          )
        : null}
    </>
  );
}
