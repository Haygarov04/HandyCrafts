"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/app/components/cart";
import QtyControl from "@/app/components/QtyControl";
import { useLang } from "@/app/components/lang";
import { deliveryLabel, type Delivery } from "@/lib/order-types";

const field =
  "w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-ember";

export default function CartPage() {
  const cart = useCart();
  const router = useRouter();
  const { lang, t, href } = useLang();
  const c = t.cart;
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    delivery: "econt" as Delivery,
    address: "",
    note: "",
    website: "",
  });
  const [agree, setAgree] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: event.target.value });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!agree) {
      setError(c.mustAgree);
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-lang": lang },
        body: JSON.stringify({
          lang,
          customer: form,
          note: form.note,
          website: form.website,
          items: cart.items.map((item) => ({ draftId: item.draftId, qty: item.qty, cm: item.cm })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || c.failed);
      cart.clear();
      router.push(href(`/thanks?n=${encodeURIComponent(data.number)}`));
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : c.failed);
      setSending(false);
    }
  }

  if (cart.ready && cart.items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 pt-28 text-center">
        <h1 className="text-3xl sm:text-4xl">{c.emptyTitle}</h1>
        <p className="mt-4 text-ink/60">{c.emptyText}</p>
        <Link href={href("/studio")} className="mt-8 rounded-full bg-ember px-7 py-3.5 font-semibold text-ink">
          {c.create}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6 sm:pt-36">
      <h1 className="text-3xl sm:text-5xl">{c.title}</h1>
      <p className="mt-3 text-ink/60">{c.intro}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={submit} className="order-2 space-y-8 lg:order-1">
          <fieldset className="rounded-[2rem] bg-white p-6 sm:p-8">
            <legend className="float-left mb-5 w-full font-display text-xl">{c.you}</legend>
            <div className="grid clear-both gap-3 sm:grid-cols-2">
              <input required autoComplete="name" placeholder={c.name} value={form.name} onChange={set("name")} className={field} />
              <input required type="tel" autoComplete="tel" placeholder={c.phone} value={form.phone} onChange={set("phone")} className={field} />
              <input type="email" autoComplete="email" placeholder={c.email} value={form.email} onChange={set("email")} className={`${field} sm:col-span-2`} />
            </div>
            <input
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              value={form.website}
              onChange={set("website")}
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
              name="website"
            />
          </fieldset>

          <fieldset className="rounded-[2rem] bg-white p-6 sm:p-8">
            <legend className="float-left mb-5 w-full font-display text-xl">{c.delivery}</legend>
            <div className="clear-both grid gap-2 sm:grid-cols-3">
              {(Object.keys(deliveryLabel) as Delivery[]).map((key) => (
                <label
                  key={key}
                  className={`cursor-pointer rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition ${
                    form.delivery === key ? "border-ember bg-ember/5" : "border-ink/10"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={key}
                    checked={form.delivery === key}
                    onChange={() => setForm({ ...form, delivery: key })}
                    className="sr-only"
                  />
                  {t.delivery[key]}
                </label>
              ))}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-[0.8fr_1.2fr]">
              <input required autoComplete="address-level2" placeholder={c.city} value={form.city} onChange={set("city")} className={field} />
              <input
                required
                autoComplete={form.delivery === "address" ? "street-address" : "off"}
                placeholder={form.delivery === "address" ? c.street : c.office}
                value={form.address}
                onChange={set("address")}
                className={field}
              />
            </div>
            <textarea
              placeholder={c.note}
              value={form.note}
              onChange={set("note")}
              maxLength={600}
              className={`${field} mt-3 min-h-24`}
            />
          </fieldset>

          <div className="rounded-[2rem] bg-white p-6 sm:p-8">
            <p className="font-display text-xl">{c.payment}</p>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-ember bg-ember/5 px-4 py-3">
              <span className="grid h-5 w-5 place-items-center rounded-full border-2 border-ember">
                <span className="h-2 w-2 rounded-full bg-ember" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{c.cod}</span>
                <span className="block text-xs text-ink/55">{c.codText}</span>
              </span>
            </div>
            <label className="mt-5 flex items-start gap-3 text-sm text-ink/70">
              <input type="checkbox" checked={agree} onChange={(event) => setAgree(event.target.checked)} className="mt-1 h-4 w-4 accent-[#ff7a00]" />
              <span>
                {c.agree[0]}{" "}
                <Link href={href("/terms")} target="_blank" className="underline decoration-ember underline-offset-4">
                  {c.agree[1]}
                </Link>{" "}
                {c.agree[2]}
              </span>
            </label>
            {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
            <button
              type="submit"
              disabled={sending || !cart.ready}
              className="mt-6 w-full rounded-full bg-ink py-4 font-semibold text-paper transition hover:bg-ember hover:text-ink disabled:opacity-50"
            >
              {sending ? c.sending : `${c.submit} ${t.money(cart.total)}`}
            </button>
          </div>
        </form>

        <aside className="order-1 lg:order-2">
          <div className="rounded-[2rem] bg-white p-6 sm:p-8 lg:sticky lg:top-32">
            <p className="font-display text-xl">{c.inCart}</p>
            <ul className="mt-5 space-y-4">
              {cart.items.map((item) => (
                <li key={item.draftId} className="flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.previewUrl} alt="" className="h-20 w-20 shrink-0 rounded-2xl bg-sand object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="text-sm font-semibold">
                        {item.label} · {item.cm} {t.cm}
                      </p>
                      <p className="text-sm font-semibold">{t.money(item.price * item.qty)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <QtyControl value={item.qty} onChange={(qty) => cart.setQty(item.draftId, qty)} />
                      <button type="button" onClick={() => cart.remove(item.draftId)} className="text-xs text-ink/45 hover:text-ink">
                        {c.remove}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2 border-t border-ink/10 pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/60">{c.products}</dt>
                <dd>{t.money(cart.total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/60">{c.shipping}</dt>
                <dd>{c.shippingValue}</dd>
              </div>
              <div className="flex justify-between pt-2 text-lg font-semibold">
                <dt>{c.total}</dt>
                <dd>{t.money(cart.total)}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-5 text-ink/50">{c.timing}</p>
            <Link href={href("/studio")} className="mt-4 inline-block text-sm font-semibold underline decoration-ember underline-offset-4">
              {c.addMore}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
