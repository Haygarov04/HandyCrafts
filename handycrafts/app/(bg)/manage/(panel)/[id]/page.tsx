import Link from "next/link";
import { notFound } from "next/navigation";
import { money } from "@/lib/catalog";
import { deliveryLabel, statusLabel, statusTone } from "@/lib/order-types";
import { getOrder } from "@/lib/orders";
import OrderControls from "../order-controls";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function OrderPage({ params }: Props) {
  const order = await getOrder((await params).id);
  if (!order) notFound();

  const file = (kind: "photo" | "preview", index: number) => `/api/orders/${order.id}/file?kind=${kind}&item=${index}`;
  const c = order.customer;
  const phone = c.phone.replace(/[^\d+]/g, "");

  return (
    <div className="space-y-5">
      <Link href="/manage" className="text-sm text-ink/55 hover:text-ink">
        ‹ Всички поръчки
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-ink/50">
            {order.number} ·{" "}
            {new Date(order.createdAt).toLocaleString("bg-BG", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Sofia" })}
          </p>
          <h1 className="mt-1 text-3xl">{c.name}</h1>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${statusTone[order.status]}`}>{statusLabel[order.status]}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a href={`tel:${phone}`} className="rounded-full bg-ink py-3 text-center font-semibold text-paper">
          Обади се
        </a>
        <a href={`viber://chat?number=${encodeURIComponent(phone)}`} className="rounded-full border border-ink/15 bg-white py-3 text-center font-semibold">
          Viber
        </a>
      </div>

      <section className="rounded-3xl bg-white p-5">
        <dl className="grid gap-2 text-sm">
          <Row label="Телефон" value={c.phone} />
          <Row label="Имейл" value={c.email || "—"} />
          <Row label="Доставка" value={deliveryLabel[c.delivery]} />
          <Row label="Град" value={c.city} />
          <Row label={c.delivery === "address" ? "Адрес" : "Офис"} value={c.address} />
          <Row label="Плащане" value={`Наложен платеж · ${money(order.total)}`} />
          <Row label="Език" value={order.lang === "en" ? "Английски" : "Български"} />
        </dl>
        {order.note ? (
          <p className="mt-4 rounded-2xl bg-paper px-4 py-3 text-sm leading-6">
            <span className="font-semibold">Бележка: </span>
            {order.note}
          </p>
        ) : null}
      </section>

      <OrderControls
        id={order.id}
        status={order.status}
        internalNote={order.internalNote}
        tracking={order.tracking}
        hasEmail={Boolean(c.email)}
        emails={order.emails || []}
      />

      {order.items.map((item, index) => (
        <section key={item.draftId} className="rounded-3xl bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg">
              {item.label} · {item.cm} см {item.qty > 1 ? `× ${item.qty}` : ""}
            </p>
            <p className="font-semibold">{money(item.price * item.qty)}</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {(["preview", "photo"] as const).map((kind) => (
              <figure key={kind}>
                <a href={file(kind, index)} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={file(kind, index)} alt="" className="aspect-square w-full rounded-2xl bg-sand object-cover" />
                </a>
                <figcaption className="mt-2 flex justify-between text-xs text-ink/50">
                  {kind === "preview" ? "Визуализация" : "Снимка на клиента"}
                  <a href={`${file(kind, index)}&download=1`} className="font-semibold text-ink underline decoration-ember underline-offset-2">
                    Свали
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
          {item.clothes || item.pose ? (
            <dl className="mt-4 grid gap-2 text-sm">
              {item.clothes ? <Row label="Дрехи" value={item.clothes} /> : null}
              {item.pose ? <Row label="Поза" value={item.pose} /> : null}
            </dl>
          ) : null}
        </section>
      ))}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-ink/5 pb-2 last:border-0">
      <dt className="shrink-0 text-ink/45">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
