import Link from "next/link";
import { money } from "@/lib/catalog";
import { hasBlob } from "@/lib/files";
import { hasRedis } from "@/lib/kv";
import { listLeads } from "@/lib/leads";
import { isStatus, orderStatuses, statusLabel, statusTone, type Order } from "@/lib/order-types";
import { listDrafts, listOrders, type Draft } from "@/lib/orders";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ status?: string }> };

/** Tries from the last 7 days that never became an order (retries with the same photo count once). */
function lostThisWeek(drafts: Draft[], orders: Order[]) {
  const ordered = new Set(orders.flatMap((order) => order.items.map((item) => item.draftId)));
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const recent = drafts.filter((draft) => draft.createdAt >= weekAgo);
  const orderedRoots = new Set(recent.filter((draft) => ordered.has(draft.id)).map((draft) => draft.root || draft.id));
  return new Set(recent.map((draft) => draft.root || draft.id).filter((root) => !orderedRoots.has(root))).size;
}

export default async function ManagePage({ searchParams }: Props) {
  const { status } = await searchParams;
  const filter = isStatus(status) ? status : null;
  const [orders, leads, drafts] = await Promise.all([listOrders(), listLeads(), listDrafts()]);
  const openLeads = leads.filter((lead) => lead.status === "open").length;
  const lostTries = lostThisWeek(drafts, orders);
  const shown = filter ? orders.filter((order) => order.status === filter) : orders.filter((o) => o.status !== "cancelled" && o.status !== "completed");

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

      <Link href="/manage/leads" className="flex items-center justify-between gap-3 rounded-3xl bg-white px-5 py-4 transition hover:shadow-md">
        <span>
          <span className="block font-semibold">Незавършени поръчки</span>
          <span className="block text-sm text-ink/55">Започнали са поръчка, но не са я изпратили</span>
        </span>
        <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${openLeads ? "bg-ember text-ink" : "bg-ink/5 text-ink/50"}`}>
          {openLeads}
        </span>
      </Link>

      <Link href="/manage/previews" className="flex items-center justify-between gap-3 rounded-3xl bg-white px-5 py-4 transition hover:shadow-md">
        <span>
          <span className="block font-semibold">Визуализации без поръчка</span>
          <span className="block text-sm text-ink/55">Направили са визуализация тази седмица, но не са поръчали</span>
        </span>
        <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${lostTries ? "bg-ink text-paper" : "bg-ink/5 text-ink/50"}`}>
          {lostTries}
        </span>
      </Link>

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
