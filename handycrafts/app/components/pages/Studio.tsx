"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/app/components/Analytics";
import { CartButton } from "@/app/components/Navbar";
import HandyAI from "@/app/components/HandyAI";
import { useCart } from "@/app/components/cart";
import { useLang } from "@/app/components/lang";
import VisualTag from "@/app/components/VisualTag";
import { INPUT_MAX, preparePhoto } from "@/app/components/prepare-photo";
import { loadPhoto, loadState, savePhoto, saveState } from "@/app/components/studio-store";
import {
  catalog,
  isProductId,
  isSubjectId,
  maxPeople,
  normalizePeople,
  priceFor,
  productIds,
  currentCm,
  isOffered,
  productsFor,
  type ProductId,
  type SubjectId,
} from "@/lib/catalog";

/** Shared with checkout, so an email left here and the details typed there end up as one unfinished order. */
const LEAD_KEY = "hc_lead_id";

type Preview = { draftId: string; url: string; product: ProductId; subject: SubjectId; people?: number; clothes?: string; pose?: string };

export default function StudioPage() {
  const cart = useCart();
  const { lang, t, href } = useLang();
  const s = t.studio;
  const copy = s.copy;
  const steps = s.steps;
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [product, setProduct] = useState<ProductId>("figurine");
  const [subject, setSubject] = useState<SubjectId>("person");
  const [peopleChoice, setPeopleChoice] = useState(1);
  const [cm, setCm] = useState<number>(catalog.figurine.sizes[0].cm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [clothes, setClothes] = useState("");
  const [pose, setPose] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  // Removed from the cart elsewhere (drawer, cart page): let the customer add it again.
  useEffect(() => {
    if (!added || !cart.ready || !preview) return;
    if (!cart.items.some((item) => item.draftId === preview.draftId)) queueMicrotask(() => setAdded(false));
  }, [added, cart.ready, cart.items, preview]);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [restored, setRestored] = useState(false);
  const [converting, setConverting] = useState(false);
  // Full previews made from this photo; after a few, changes go through Handy AI instead of starting over.
  const [freshCount, setFreshCount] = useState(0);
  const [aiRequest, setAiRequest] = useState<{ id: number; text: string } | null>(null);
  const askAi = (text: string) => setAiRequest({ id: Date.now(), text });
  const [mail, setMail] = useState({ email: "", website: "", sending: false, sentTo: "", error: "" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("product");
    const size = Number(params.get("cm"));
    const who = params.get("subject");
    const saved = loadState();
    if (saved && (saved.step > 0 || !requested)) {
      // Pick up where the customer left off. A preview that was still running is lost, so go back to the details.
      setStep(saved.step === 3 && !saved.preview ? 2 : saved.step);
      // Keychains are only for pets now: an old saved keychain of a person starts again as a figurine.
      const kept = isOffered(saved.product, saved.subject) ? saved.product : "figurine";
      const keptCm = currentCm(kept, saved.cm);
      if (kept !== saved.product) {
        setStep(0);
        saved.preview = null;
      }
      setProduct(kept);
      setSubject(saved.subject);
      setPeopleChoice(saved.people || 1);
      setCm(priceFor(kept, keptCm) !== null ? keptCm : catalog[kept].sizes[0].cm);
      setClothes(saved.clothes || "");
      setPose(saved.pose || "");
      setPreview(saved.preview);
      setAdded(Boolean(saved.added));
    } else {
      if (isSubjectId(who)) setSubject(who);
      const many = Number(params.get("people"));
      if (many > 1 && who !== "pet") setPeopleChoice(Math.min(maxPeople, many));
      if (isProductId(requested) && isOffered(requested, isSubjectId(who) ? who : requested === "keychain" ? "pet" : "person")) {
        if (requested === "keychain") setSubject("pet");
        setProduct(requested);
        const wanted = currentCm(requested, size);
        setCm(priceFor(requested, wanted) !== null ? wanted : catalog[requested].sizes[0].cm);
      }
    }
    loadPhoto().then((file) => {
      if (file) {
        setPhotoFile(file);
        setPhotoUrl(URL.createObjectURL(file));
      }
      setRestored(true);
    });
    fetch("/api/studio/status")
      .then((res) => res.json())
      .then((data) => setEnabled(Boolean(data.previews)))
      .catch(() => setEnabled(false));
  }, []);

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  // iOS Safari can leave the fixed bottom bar halfway up the screen after the keyboard closes.
  // Nudging the scroll position once the keyboard is gone makes it lay the bar out again.
  useEffect(() => {
    const settle = () => window.setTimeout(() => window.scrollTo(window.scrollX, window.scrollY), 120);
    document.addEventListener("focusout", settle);
    window.visualViewport?.addEventListener("resize", settle);
    return () => {
      document.removeEventListener("focusout", settle);
      window.visualViewport?.removeEventListener("resize", settle);
    };
  }, []);

  useEffect(() => {
    if (!restored) return;
    saveState({ step, product, subject, people: peopleChoice, cm, clothes, pose, preview, added });
  }, [restored, step, product, subject, peopleChoice, cm, clothes, pose, preview, added]);

  // Only person figurines can have more than one person; other choices fall back to one.
  const people = normalizePeople(product, subject, peopleChoice);
  const price = priceFor(product, cm, people) ?? 0;

  function choosePeople(n: number) {
    setPeopleChoice(n);
    if (preview && (preview.people || 1) !== n) setPreview(null);
  }

  function chooseProduct(id: ProductId) {
    setProduct(id);
    setCm(catalog[id].sizes[0].cm);
    if (preview && preview.product !== id) setPreview(null);
  }

  function chooseSubject(id: SubjectId) {
    setSubject(id);
    // Keychains are only made of pets.
    if (!isOffered(product, id)) chooseProduct("figurine");
    if (preview && preview.subject !== id) setPreview(null);
  }

  async function choosePhoto(picked: File | null) {
    if (!picked) return;
    if (picked.size > INPUT_MAX) {
      setError(s.tooBig);
      return;
    }
    setError("");
    setConverting(true);
    let file: File;
    try {
      file = await preparePhoto(picked);
    } catch {
      setError(s.badType);
      return;
    } finally {
      setConverting(false);
    }
    setPhotoFile(file);
    setPhotoUrl(URL.createObjectURL(file));
    setPreview(null);
    savePhoto(file);
    setFreshCount(0);
  }

  async function generate() {
    if (!photoFile && !preview) {
      setStep(1);
      return;
    }
    setStep(3);
    setBusy(true);
    setAdded(false);
    setError("");
    setProgress(4);
    const timer = window.setInterval(() => setProgress((value) => (value < 92 ? value + 2 : value)), 900);
    try {
      const body = new FormData();
      body.set("product", product);
      body.set("subject", subject);
      body.set("people", String(people));
      body.set("cm", String(cm));
      body.set("clothes", clothes);
      body.set("pose", pose);
      if (photoFile) body.set("photo", photoFile);
      else if (preview) body.set("draftId", preview.draftId);
      const res = await fetch("/api/studio/preview", { method: "POST", body, headers: { "x-lang": lang } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.draftId) throw new Error(data.error || s.failed);
      // Load the finished image before showing it, so nothing else flashes in its place.
      await new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = data.previewUrl;
      });
      setProgress(100);
      trackEvent("generate_preview", { product, subject });
      setPreview({ draftId: data.draftId, url: data.previewUrl, product, subject, people, clothes, pose });
      setMail((prev) => ({ ...prev, sentTo: "", error: "" }));
      setFreshCount((n) => n + 1);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : s.wrong);
    } finally {
      window.clearInterval(timer);
      setBusy(false);
    }
  }

  function addToCart() {
    if (!preview) return;
    cart.add({
      draftId: preview.draftId,
      product: preview.product,
      subject: preview.subject,
      people: preview.people || 1,
      label: t.itemLabel(preview.product, preview.subject, preview.people || 1),
      cm,
      price,
      qty: 1,
      previewUrl: preview.url,
    });
    setAdded(true);
    fetch(`/api/studio/draft/${preview.draftId}`, { method: "POST", keepalive: true }).catch(() => {});
    trackEvent("add_to_cart", { currency: "EUR", value: price, items: [{ item_id: preview.product, item_name: t.itemLabel(preview.product, preview.subject, preview.people || 1), price }] });
  }

  // Emails the preview and keeps the address as an unfinished order, under the same id checkout uses.
  async function emailPreview(event: React.FormEvent) {
    event.preventDefault();
    if (!preview || mail.sending) return;
    setMail((prev) => ({ ...prev, sending: true, error: "" }));
    let id = "";
    try {
      id = localStorage.getItem(LEAD_KEY) || "";
    } catch {}
    try {
      const res = await fetch("/api/leads/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, draftId: preview.draftId, cm, email: mail.email, website: mail.website, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || t.studio.wrong);
      try {
        if (data.id) localStorage.setItem(LEAD_KEY, data.id);
      } catch {}
      setMail((prev) => ({ ...prev, sending: false, sentTo: prev.email }));
      trackEvent("preview_email", { product: preview.product });
    } catch (err) {
      setMail((prev) => ({ ...prev, sending: false, error: err instanceof Error ? err.message : t.studio.wrong }));
    }
  }

  // Back from "Промени детайлите" without changing anything: show the same preview, don't draw a new one.
  const sameDetails = Boolean(
    preview && preview.product === product && preview.subject === subject && (preview.people || 1) === people && (preview.clothes ?? "") === clothes && (preview.pose ?? "") === pose
  );

  // Only the clothes or pose changed: refine the current preview with Handy AI instead of starting over.
  const onlyLooks = Boolean(
    preview && !sameDetails && preview.product === product && preview.subject === subject && (preview.people || 1) === people
  );

  function next() {
    if (step === 2 && sameDetails) setStep(3);
    else if (step === 2 && onlyLooks && preview) {
      const parts = [
        clothes !== (preview.clothes ?? "") ? `${s.clothesPrefix} ${clothes || s.asInPhoto}` : "",
        pose !== (preview.pose ?? "") ? `${s.posePrefix} ${pose || s.asInPhoto}` : "",
      ].filter(Boolean);
      setPreview({ ...preview, clothes, pose });
      setStep(3);
      askAi(parts.join(". "));
    }
    else if (step === 2) generate();
    else setStep((value) => Math.min(3, value + 1));
  }

  return (
    <div className="min-h-screen bg-paper pb-36">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href={href("/")} className="flex items-center gap-2">
            <Image src="/logo-remove.png" alt="HandyCrafts" width={40} height={40} className="h-10 w-10" />
            <span className="hidden font-display font-semibold sm:inline">HandyCrafts</span>
          </Link>
          <ol className="flex items-center gap-1.5 sm:gap-3">
            {steps.map((label, index) => (
              <li key={label} className="flex items-center gap-1.5 sm:gap-3">
                <button
                  type="button"
                  disabled={busy || index > step || (index === 3 && !preview)}
                  onClick={() => setStep(index)}
                  className={`flex items-center gap-2 rounded-full text-sm ${index === step ? "font-semibold" : "text-ink/45"}`}
                >
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
                      index === step ? "bg-ember text-ink" : index < step ? "bg-ink text-paper" : "bg-white text-ink/40"
                    }`}
                  >
                    {index < step ? "✓" : index + 1}
                  </span>
                  <span className="hidden md:inline">{label}</span>
                </button>
                {index < steps.length - 1 ? <span className="h-px w-3 bg-ink/15 sm:w-6" /> : null}
              </li>
            ))}
          </ol>
          <div className="flex items-center gap-2">
            <CartButton />
            <Link href={href("/")} className="hidden h-11 w-11 place-items-center rounded-full border border-ink/15 bg-white sm:grid" aria-label={s.close}>
              ✕
            </Link>
          </div>
        </div>
      </header>

      <main id="studio-main" className="mx-auto max-w-3xl px-4 pt-8 sm:px-6 sm:pt-12">
        {step === 0 ? (
          <section>
            <h1 className="text-center text-3xl sm:text-4xl">{s.chooseTitle}</h1>
            <p className="mt-3 text-center text-ink/60">{s.chooseText}</p>
            <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-2 rounded-full bg-white p-1.5">
              {(["person", "pet"] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => chooseSubject(id)}
                  className={`rounded-full py-3 text-sm font-semibold transition ${subject === id ? "bg-ink text-paper" : "hover:bg-paper"}`}
                >
                  {id === "person" ? s.person : s.pet}
                </button>
              ))}
            </div>
            <div className={`mt-8 grid gap-3 sm:gap-4 ${productsFor(subject).length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
              {productsFor(subject).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => chooseProduct(id)}
                  className={`overflow-hidden rounded-[1.8rem] border-2 bg-white text-left transition ${productsFor(subject).length > 1 ? "" : "flex items-center"} ${
                    product === id ? "border-ember shadow-[0_16px_40px_rgba(255,122,0,0.18)]" : "border-transparent hover:border-ink/15"
                  }`}
                >
                  <span className={`relative block overflow-hidden bg-sand ${productsFor(subject).length > 1 ? "aspect-[9/16]" : "aspect-[3/4] w-36 shrink-0 self-stretch sm:w-48"}`}>
                    <Image
                      src={id === "figurine" && subject === "person" ? `/shop/people-${people}.webp` : `/shop/${subject === "pet" ? "pet-" : ""}${id}.webp`}
                      alt=""
                      fill
                      style={{ objectPosition: subject === "pet" ? "40% 50%" : "50% 50%" }}
                      className="object-cover transition-opacity duration-300"
                      sizes="(min-width: 640px) 360px, 50vw"
                    />
                    <VisualTag label={t.visual} className="left-2 top-2" />
                  </span>
                  <span className="block min-w-0 p-3.5 sm:p-5">
                    <span className="block truncate text-base font-bold sm:font-display sm:text-xl sm:font-medium">{t.product[id].label}</span>
                    <span className="mt-0.5 block text-sm text-ink/55">{t.from} {t.money(priceFor(id, catalog[id].sizes[0].cm, subject === "person" ? people : 1) ?? 0)}</span>
                    <span className={`mt-1 text-sm text-ink/60 ${productsFor(subject).length > 1 ? "hidden sm:block" : "block"}`}>{t.product[id].short}</span>
                  </span>
                </button>
              ))}
            </div>
            {subject === "person" ? (
              <div className="mt-8">
                <p className="text-sm font-semibold">{s.peopleTitle}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                  {Array.from({ length: maxPeople }, (_, index) => index + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => choosePeople(n)}
                      className={`rounded-2xl border-2 bg-white px-3 py-3 text-left transition ${
                        people === n ? "border-ember" : "border-transparent hover:border-ink/15"
                      }`}
                    >
                      <span className="flex items-end gap-0.5 text-ink/70" aria-hidden>
                        {Array.from({ length: n }, (_, i) => (
                          <svg key={i} width="16" height="18" viewBox="0 0 16 18" fill="currentColor">
                            <circle cx="8" cy="4.5" r="3.5" />
                            <path d="M1.5 17c0-4 2.9-7 6.5-7s6.5 3 6.5 7z" />
                          </svg>
                        ))}
                      </span>
                      <span className="mt-1.5 block text-sm font-semibold">{s.peopleOption(n)}</span>
                      <span className="text-xs text-ink/55">{t.money(priceFor(product, cm, n) ?? 0)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <SizePicker product={product} people={people} cm={cm} onChange={setCm} label={s.size} unit={t.cm} money={t.money} />
          </section>
        ) : null}

        {step === 1 ? (
          <section>
            <h1 className="text-center text-3xl sm:text-4xl">{s.uploadTitle}</h1>
            <p className="mx-auto mt-3 max-w-md text-center text-ink/60">
              {copy[subject].photo}
              {people > 1 ? <span className="mt-2 block font-semibold text-ink/80">{s.peoplePhoto(people)}</span> : null}
            </p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mx-auto mt-8 block w-full max-w-lg overflow-hidden rounded-[2rem] border-2 border-dashed border-ink/20 bg-white transition hover:border-ember"
            >
              {converting ? (
                <span className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                  <span className="h-12 w-12 animate-spin rounded-full border-4 border-sand border-t-ember" />
                  <span className="text-sm text-ink/60">{s.converting}</span>
                </span>
              ) : photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt={s.uploaded} className="max-h-[26rem] w-full object-contain" />
              ) : (
                <span className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-ember/15 text-3xl text-ember-deep">+</span>
                  <span className="font-semibold">{s.pick}</span>
                  <span className="text-sm text-ink/50">{s.formats}</span>
                </span>
              )}
            </button>
            {photoUrl ? (
              <button type="button" onClick={() => fileRef.current?.click()} className="mx-auto mt-3 block text-sm font-semibold underline decoration-ember underline-offset-4">
                {s.change}
              </button>
            ) : null}
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.heic,.heif"
              hidden
              onChange={(event) => {
                choosePhoto(event.target.files?.[0] || null);
                event.target.value = "";
              }}
            />
            <ul className="mx-auto mt-8 grid max-w-lg gap-2 text-sm text-ink/65 sm:grid-cols-3">
              {copy[subject].tips.map((tip) => (
                <li key={tip} className="rounded-2xl bg-white px-4 py-3">
                  {tip}
                </li>
              ))}
            </ul>
            <p className="mx-auto mt-4 max-w-lg text-center text-xs text-ink/45">
              {s.private}
            </p>
          </section>
        ) : null}

        {step === 2 ? (
          <section>
            <h1 className="text-center text-3xl sm:text-4xl">{s.detailsTitle}</h1>
            <p className="mt-3 text-center text-ink/60">{s.detailsText}</p>
            <div className="mx-auto mt-5 flex max-w-lg items-center gap-3 rounded-2xl border border-ember/30 bg-ember/10 px-4 py-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-ember to-ember-deep text-paper" aria-hidden>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l1.9 5.6L19.5 9.5 13.9 11.4 12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2zM19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9L19 15z" />
                </svg>
              </span>
              <span className="text-sm leading-snug">
                <b className="block font-semibold">{s.aiTeaserTitle}</b>
                <span className="text-ink/65">{s.aiTeaserText}</span>
              </span>
            </div>
            <label className="mt-8 block text-sm font-semibold">
              {copy[subject].extrasLabel}
              <textarea
                value={clothes}
                onChange={(event) => setClothes(event.target.value)}
                maxLength={500}
                placeholder={copy[subject].extrasHint}
                className="mt-2 min-h-28 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 font-normal outline-none focus:border-ember"
              />
            </label>
            <label className="mt-5 block text-sm font-semibold">
              {s.pose}
              <textarea
                value={pose}
                onChange={(event) => setPose(event.target.value)}
                maxLength={300}
                placeholder={copy[subject].poseHint}
                className="mt-2 min-h-24 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 font-normal outline-none focus:border-ember"
              />
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              {copy[subject].poses.map((idea) => (
                <button key={idea} type="button" onClick={() => setPose(idea)} className="rounded-full bg-white px-3 py-1.5 text-sm hover:bg-sand">
                  {idea}
                </button>
              ))}
            </div>
            {enabled === false ? (
              <p className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
                {s.disabled}
              </p>
            ) : null}
          </section>
        ) : null}

        {step === 3 ? (
          <section>
            <h1 className="text-center text-3xl sm:text-4xl">{busy ? s.making : s.yours}</h1>
            <div className="relative mx-auto mt-8 aspect-square w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_70px_rgba(22,21,19,0.12)]">
              {preview && !busy ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview.url} alt={s.previewAlt} className="h-full w-full object-cover" />
              ) : (
                <>
                  {busy ? <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-sand via-paper to-blush/60" /> : null}
                  <div className="absolute inset-0 grid place-items-center">
                    {busy ? (
                      <div className="text-center">
                        <div className="mx-auto h-20 w-20 animate-spin rounded-full border-4 border-white border-t-ember" />
                        <p className="mt-5 font-display text-4xl">{progress}%</p>
                        <p className="mt-2 text-sm text-ink/60">{s.aboutMinute}</p>
                      </div>
                    ) : (
                      <p className="max-w-xs px-6 text-center text-sm text-ink/70">{error || s.noPreview}</p>
                    )}
                  </div>
                </>
              )}
            </div>
            {preview && !busy ? (
              <p className="mx-auto mt-3 max-w-lg text-center text-xs text-ink/45">
                {s.previewNote}
              </p>
            ) : null}
            {preview && !busy ? (
              <div className="mx-auto max-w-lg">
                <HandyAI
                  lang={lang}
                  current={{ draftId: preview.draftId, url: preview.url }}
                  added={added}
                  checkoutHref={href("/cart")}
                  onAddToCart={addToCart}
                  request={aiRequest}
                  onVersion={(version) => {
                    // Already in the cart: swap the cart item for the version just chosen, so the order matches it.
                    if (added && version.draftId !== preview.draftId) {
                      cart.remove(preview.draftId);
                      cart.add({
                        draftId: version.draftId,
                        product: preview.product,
                        subject: preview.subject,
                        people: preview.people || 1,
                        label: t.itemLabel(preview.product, preview.subject, preview.people || 1),
                        cm,
                        price,
                        qty: 1,
                        previewUrl: version.url,
                      });
                      // A quiet swap: don't pop the cart open over the chat.
                      cart.setOpen(false);
                    }
                    setPreview({ ...preview, ...version });
                    setMail((prev) => ({ ...prev, sentTo: "", error: "" }));
                  }}
                />
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/40">{s.quickTitle}</p>
                  <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
                    {copy[preview.subject].poses
                      .filter((idea) => idea !== (preview.pose ?? ""))
                      .map((idea) => (
                        <button
                          key={idea}
                          type="button"
                          onClick={() => askAi(`${s.posePrefix} ${idea}`)}
                          className="shrink-0 rounded-full border border-ink/10 bg-white px-3.5 py-2 text-sm transition hover:border-ember"
                        >
                          {idea}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            ) : null}

            {!busy ? (
              <div className="mx-auto mt-6 max-w-lg">
                {error && preview ? <p className="mb-3 text-center text-sm text-red-700">{error}</p> : null}
                {preview ? <SizePicker product={preview.product} people={preview.people || 1} cm={cm} onChange={setCm} compact label={s.size} unit={t.cm} money={t.money} /> : null}
                {preview ? (
                  <p className="mt-5 text-center text-sm text-ink/50">
                    {freshCount < 3 ? (
                      <>
                        {s.notAtAll}{" "}
                        <button type="button" onClick={generate} className="font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ember">
                          {s.startOver}
                        </button>
                      </>
                    ) : (
                      <>
                        {s.enoughFresh}{" "}
                        <button
                          type="button"
                          onClick={() => window.dispatchEvent(new Event("handy-ai:open"))}
                          className="font-semibold text-ink underline decoration-ember underline-offset-4"
                        >
                          {s.useAi}
                        </button>
                      </>
                    )}
                  </p>
                ) : (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button type="button" onClick={() => setStep(2)} className="rounded-full border border-ink/15 bg-white px-5 py-3 font-semibold">
                      {s.editDetails}
                    </button>
                    <button type="button" onClick={generate} className="rounded-full border border-ink/15 bg-white px-5 py-3 font-semibold">
                      {s.retry}
                    </button>
                  </div>
                )}
                {preview && !added ? (
                  <div className="mt-5 rounded-3xl bg-white p-5">
                    {mail.sentTo ? (
                      <p className="text-center font-semibold">{s.mailSent(mail.sentTo)}</p>
                    ) : (
                      <form onSubmit={emailPreview}>
                        <p className="font-semibold">{s.mailTitle}</p>
                        <p className="mt-1 text-sm text-ink/60">{s.mailText}</p>
                        <input
                          type="text"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                          value={mail.website}
                          onChange={(event) => setMail({ ...mail, website: event.target.value })}
                          className="hidden"
                          aria-hidden
                        />
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                          <input
                            type="email"
                            required
                            inputMode="email"
                            autoComplete="email"
                            value={mail.email}
                            onChange={(event) => setMail({ ...mail, email: event.target.value, error: "" })}
                            placeholder={s.mailPlaceholder}
                            className="min-w-0 flex-1 rounded-full border border-ink/15 bg-paper px-4 py-3 outline-none focus:border-ink"
                          />
                          <button type="submit" disabled={mail.sending} className="shrink-0 rounded-full bg-ink px-5 py-3 font-semibold text-paper disabled:opacity-50">
                            {mail.sending ? "…" : s.mailSend}
                          </button>
                        </div>
                        {mail.error ? <p className="mt-2 text-sm text-red-700">{mail.error}</p> : null}
                        <p className="mt-2 text-xs text-ink/45">{s.mailFine}</p>
                      </form>
                    )}
                  </div>
                ) : null}
                {added ? (
                  <div className="mt-5 rounded-3xl bg-white p-5 text-center">
                    <p className="font-semibold">{s.added}</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <Link href={href("/cart")} className="rounded-full bg-ink px-5 py-3 font-semibold text-paper">
                        {s.checkout}
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setPhotoFile(null);
                          setPhotoUrl("");
                          savePhoto(null);
                          setClothes("");
                          setPose("");
                          setAdded(false);
                          setStep(0);
                        }}
                        className="rounded-full border border-ink/15 px-5 py-3 font-semibold"
                      >
                        {s.another}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>
        ) : null}

        {error && step !== 3 ? <p className="mt-6 text-center text-sm text-red-700">{error}</p> : null}
      </main>

      <div id="studio-bar" className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 px-4 py-3 backdrop-blur sm:py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              // With Handy AI open, "Назад" closes the chat instead of leaving the preview.
              if (document.body.classList.contains("hc-chat-open")) {
                window.dispatchEvent(new Event("handy-ai:close"));
                return;
              }
              setStep((value) => Math.max(0, value - 1));
            }}
            disabled={step === 0 || busy}
            className="shrink-0 whitespace-nowrap rounded-full border border-ink/15 px-4 py-3 text-sm disabled:opacity-30"
          >
            {s.back}
          </button>
          <p className="min-w-0 text-center text-xs leading-tight sm:text-sm">
            <span className="block truncate font-semibold">
              {t.itemLabel(product, subject, people)} · {cm} {t.cm}
            </span>
            <span className="whitespace-nowrap font-display text-lg">{t.money(price)}</span>
          </p>
          {step < 3 ? (
            <button
              type="button"
              onClick={next}
              disabled={(step === 1 && ((!photoFile && !preview) || converting)) || (step === 2 && enabled === false)}
              className="shrink-0 whitespace-nowrap rounded-full bg-ember px-5 py-3 font-semibold text-ink transition hover:bg-ember-deep disabled:opacity-40 sm:px-7"
            >
              {step === 2 && onlyLooks ? s.applyAi : step === 2 && !sameDetails ? s.create : s.next}
            </button>
          ) : (
            <button
              type="button"
              onClick={addToCart}
              disabled={!preview || busy || added}
              className="shrink-0 whitespace-nowrap rounded-full bg-ink px-5 py-3 font-semibold text-paper transition hover:bg-ember hover:text-ink disabled:opacity-40 sm:px-7"
            >
              {added ? s.addedShort : s.addToCart}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SizePicker({
  product,
  people = 1,
  cm,
  onChange,
  compact,
  label,
  unit,
  money,
}: {
  product: ProductId;
  people?: number;
  cm: number;
  onChange: (cm: number) => void;
  compact?: boolean;
  label: string;
  unit: string;
  money: (value: number) => string;
}) {
  return (
    <div className={compact ? "" : "mt-8"}>
      <p className="text-sm font-semibold">{label}</p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {catalog[product].sizes.map((size) => (
          <button
            key={size.cm}
            type="button"
            onClick={() => onChange(size.cm)}
            className={`rounded-2xl border-2 bg-white px-4 py-4 text-left transition ${
              cm === size.cm ? "border-ember" : "border-transparent hover:border-ink/15"
            }`}
          >
            <span className="block font-display text-xl">{size.cm} {unit}</span>
            <span className="text-sm text-ink/60">{money(priceFor(product, size.cm, people) ?? size.price)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
