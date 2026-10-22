"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { deliveryLabel, orderSources, orderStatuses, sourceLabel, statusLabel, type Order } from "@/lib/order-types";

const field = "mt-1.5 block w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-base text-ink outline-none focus:border-ember";
const caption = "block text-sm font-semibold";

/** Sofia's date for an ISO time, as "YYYY-MM-DD" for the date input. */
const day = (iso?: string) => new Date(iso || Date.now()).toLocaleDateString("sv-SE", { timeZone: "Europe/Sofia" });

/** The form for an order that came in through Facebook, TikTok, the phone… Nothing is required. */
export default function ManualOrderForm({ order }: { order?: Order }) {
  const router = useRouter();
  const item = order?.items[0];
  const [product, setProduct] = useState(item?.product || "figurine");
  const [subject, setSubject] = useState(item?.subject || "person");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [photoName, setPhotoName] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch(order ? `/api/manage/orders/${order.id}` : "/api/manage/orders", {
      method: order ? "PUT" : "POST",
      body: new FormData(event.currentTarget),
    }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    if (!res?.ok || !data?.id) {
      setBusy(false);
      setError(data?.error || "Не се записа. Опитай пак.");
      return;
    }
    router.push(`/manage/${data.id}`);
    router.refresh();
  }

  async function remove() {
    if (!order || !confirm("Да изтрия ли тази поръчка? Няма връщане назад.")) return;
    setBusy(true);
    await fetch(`/api/manage/orders/${order.id}`, { method: "DELETE" }).catch(() => null);
    router.push("/manage");
    router.refresh();
  }

  const pill = (on: boolean) => `rounded-full px-4 py-2.5 text-sm font-semibold transition ${on ? "bg-ink text-paper" : "bg-paper hover:bg-sand"}`;

  return (
    <form onSubmit={submit} className="space-y-5">
      <section className="space-y-4 rounded-3xl bg-white p-5">
        <p className="font-display text-lg">Откъде е</p>
        <div className="flex flex-wrap gap-2">
          {orderSources.map((source) => (
            <label key={source} className="cursor-pointer">
              <input type="radio" name="source" value={source} defaultChecked={(order?.source || "facebook") === source} className="peer sr-only" />
              <span className="block rounded-full bg-paper px-4 py-2.5 text-sm font-semibold transition peer-checked:bg-ink peer-checked:text-paper">
                {sourceLabel[source]}
              </span>
            </label>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className={caption}>
            Дата
            <input type="date" name="date" defaultValue={day(order?.createdAt)} className={field} />
          </label>
          <label className={caption}>
            Статус
            <select name="status" defaultValue={order?.status || "confirmed"} className={field}>
              {orderStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabel[status]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl bg-white p-5">
        <p className="font-display text-lg">Какво поръча</p>
        <input type="hidden" name="product" value={product} />
        <input type="hidden" name="subject" value={subject} />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setProduct("figurine")} className={pill(product === "figurine")}>
            Фигурка
          </button>
          <button type="button" onClick={() => setProduct("keychain")} className={pill(product === "keychain")}>
            Ключодържател
          </button>
          <button type="button" onClick={() => setProduct("kit")} className={pill(product === "kit")}>
            Оцвети сам
          </button>
          {product !== "keychain" ? (
            <>
              <span className="mx-1 w-px bg-ink/10" />
              <button type="button" onClick={() => setSubject("person")} className={pill(subject === "person")}>
                Хора
              </button>
              <button type="button" onClick={() => setSubject("pet")} className={pill(subject === "pet")}>
                Животно
              </button>
            </>
          ) : null}
        </div>
        <label className={caption}>
          Описание
          <input name="label" defaultValue={item?.label || ""} placeholder="напр. Фигурка на двойка с куче" className={field} />
        </label>
        <div className="grid grid-cols-3 gap-3">
          {product !== "keychain" && subject === "person" ? (
            <label className={caption}>
              Души
              <input name="people" type="number" min={1} max={3} defaultValue={item?.people || 1} className={field} />
            </label>
          ) : null}
          <label className={caption}>
            Размер, см
            <input name="cm" type="number" min={0} max={100} inputMode="numeric" defaultValue={item?.cm || ""} placeholder="17" className={field} />
          </label>
          <label className={caption}>
            Брой
            <input name="qty" type="number" min={1} max={99} defaultValue={item?.qty || 1} className={field} />
          </label>
        </div>
        <label className={caption}>
          Цена за брой, €
          <input name="price" inputMode="decimal" defaultValue={item?.price ?? ""} placeholder="60" className={`${field} font-display text-xl`} />
        </label>
        <label className={caption}>
          Снимка {item?.photo ? <span className="font-normal text-ink/50">(има качена — избери нова, за да я смениш)</span> : <span className="font-normal text-ink/50">(по желание)</span>}
          <span className="mt-1.5 flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-ink/20 bg-paper px-4 py-3 text-sm font-normal">
            <span className="truncate text-ink/60">{photoName || "Избери снимка от телефона"}</span>
            <span className="shrink-0 font-semibold text-ember-deep">Избери</span>
            <input
              type="file"
              name="photo"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => setPhotoName(event.target.files?.[0]?.name || "")}
              className="sr-only"
            />
          </span>
        </label>
      </section>

      <section className="space-y-4 rounded-3xl bg-white p-5">
        <p className="font-display text-lg">Клиент</p>
        <label className={caption}>
          Име
          <input name="name" defaultValue={order?.customer.name === "Ръчна поръчка" ? "" : order?.customer.name || ""} autoComplete="off" className={field} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={caption}>
            Телефон
            <input name="phone" type="tel" defaultValue={order?.customer.phone || ""} className={field} />
          </label>
          <label className={caption}>
            Имейл
            <input name="email" type="email" defaultValue={order?.customer.email || ""} className={field} />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className={caption}>
            Град
            <input name="city" defaultValue={order?.customer.city || ""} className={field} />
          </label>
          <label className={caption}>
            Доставка
            <select name="delivery" defaultValue={order?.customer.delivery || "econt"} className={field}>
              {Object.entries(deliveryLabel).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className={caption}>
          Офис или адрес
          <input name="address" defaultValue={order?.customer.address || ""} className={field} />
        </label>
        <label className={caption}>
          Бележка
          <textarea name="note" defaultValue={order?.note || ""} placeholder="Каквото сте се разбрали — дрехи, поза, срок…" className={`${field} min-h-24`} />
        </label>
      </section>

      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}

      <div className="sticky bottom-0 -mx-4 bg-paper/95 px-4 pb-2 pt-3 backdrop-blur">
        <button type="submit" disabled={busy} className="w-full rounded-full bg-ember py-4 font-semibold text-ink shadow-[0_10px_24px_rgba(255,122,0,0.3)] disabled:opacity-60">
          {busy ? "Записва се…" : order ? "Запази промените" : "Добави поръчката"}
        </button>
      </div>

      {order ? (
        <button type="button" onClick={remove} disabled={busy} className="mx-auto block text-sm font-semibold text-red-700 underline underline-offset-4">
          Изтрий поръчката
        </button>
      ) : null}
    </form>
  );
}
