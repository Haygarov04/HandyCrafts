import Link from "next/link";
import { money } from "@/lib/catalog";
import { hasBlob } from "@/lib/files";
import { hasRedis } from "@/lib/kv";
import { isStatus, orderStatuses, statusLabel, statusTone } from "@/lib/order-types";
import { listOrders } from "@/lib/orders";
import PushToggle from "../PushToggle";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ status?: string }> };

export default async function ManagePage({ searchParams }: Props) {
  const { status } = await searchParams;
  const filter = isStatus(status) ? status : null;
  const orders = await listOrders();
  const shown = filter ? orders.filter((order) => order.status === filter) : orders.filter((o) => o.status !== "cancelled");

  const month = new Date().toISOString().slice(0, 7);
  const active = orders.filter((o) => o.status !== "cancelled");
  const stats = [
    { label: "Нови", value: String(orders.filter((o) => o.status === "new").length) },
    { label: "В работа", value: String(orders.filter((o) => o.status === "confirmed" || o.status === "printing").length) },
    {
      label: "Този месец",
      value: money(active.filter((o) => o.createdAt.startsWith(month)).reduce((sum, o) => sum + o.total, 0)),
    },
  ];

  return (
    <div className="space-y-6">
      {!hasRedis() || !hasBlob() ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {!hasRedis() ? "Няма REDIS_URL — поръчките се пазят локално. " : ""}
          {!hasBlob() ? "Няма BLOB_READ_WRITE_TOKEN — снимките се пазят локално." : ""}
        </p>
      ) : null}

      <div className="grid grid-cols-3 gap-3">
        {stats.map((item) => (
          <div key={item.label} className="rounded-3xl bg-white p-4">
            <p className="text-xs text-ink/50">{item.label}</p>
            <p className="mt-1 font-display text-xl sm:text-2xl">{item.value}</p>
          </div>
        ))}
      </div>

      <PushToggle />

      <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <Link href="/manage" className={`shrink-0 rounded-full px-4 py-2 text-sm ${!filter ? "bg-ink text-paper" : "bg-white"}`}>
          Активни
        </Link>
        {orderStatuses.map((item) => (
          <Link
            key={item}
            href={`/manage?status=${item}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm ${filter === item ? "bg-ink text-paper" : "bg-white"}`}
          >
            {statusLabel[item]}
          </Link>
        ))}
      </nav>

      {shown.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center text-ink/55">Няма поръчки тук.</div>
      ) : (
        <ul className="grid gap-3">
          {shown.map((order) => (
            <li key={order.id}>
              <Link href={`/manage/${order.id}`} className="flex gap-4 rounded-3xl bg-white p-3 transition hover:shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/orders/${order.id}/file?kind=preview&item=0`}
                  alt=""
                  loading="lazy"
                  className="h-20 w-20 shrink-0 rounded-2xl bg-sand object-cover"
                />
                <div className="min-w-0 flex-1 py-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-semibold">{order.customer.name}</p>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone[order.status]}`}>
                      {statusLabel[order.status]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-ink/55">
                    {order.number} · {order.customer.city} ·{" "}
                    {new Date(order.createdAt).toLocaleString("bg-BG", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Sofia" })}
                  </p>
                  <p className="mt-1 text-sm">
                    {order.items.map((item) => `${item.label} ${item.cm} см${item.qty > 1 ? ` ×${item.qty}` : ""}`).join(", ")}
                    <span className="font-semibold"> · {money(order.total)}</span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
