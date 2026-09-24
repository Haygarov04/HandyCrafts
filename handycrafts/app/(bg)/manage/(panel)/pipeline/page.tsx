import Link from "next/link";
import { money } from "@/lib/catalog";
import { nextStatus, orderStatuses, statusLabel, statusTone } from "@/lib/order-types";
import { listOrders } from "@/lib/orders";
import AdvanceButton from "./advance-button";

export const dynamic = "force-dynamic";

const stages = orderStatuses.filter((status) => status !== "cancelled");

export default async function PipelinePage() {
  const orders = await listOrders();
  const cancelled = orders.filter((order) => order.status === "cancelled").length;

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <h1 className="text-3xl">Pipeline</h1>
        {cancelled ? (
          <Link href="/manage?status=cancelled" className="text-sm text-ink/50 underline underline-offset-4">
            Отказани: {cancelled}
          </Link>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-ink/55">Плъзни настрани, за да видиш всички етапи.</p>

      <div className="-mx-4 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4">
        {stages.map((stage) => {
          const column = orders.filter((order) => order.status === stage);
          const total = column.reduce((sum, order) => sum + order.total, 0);
          const next = nextStatus[stage];
          return (
            <section key={stage} className="w-[78%] max-w-xs shrink-0 snap-start rounded-3xl bg-sand/60 p-3 sm:w-64">
              <header className="flex items-center justify-between px-1 pb-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone[stage]}`}>
                  {statusLabel[stage]} · {column.length}
                </span>
                <span className="text-xs text-ink/50">{money(total)}</span>
              </header>
              {column.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-ink/15 px-3 py-6 text-center text-xs text-ink/40">
                  Празно
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {column.map((order) => (
                    <li key={order.id} className="rounded-2xl bg-white p-3 shadow-sm">
                      <Link href={`/manage/${order.id}`} className="flex gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/api/orders/${order.id}/file?kind=preview&item=0`}
                          alt=""
                          loading="lazy"
                          className="h-14 w-14 shrink-0 rounded-xl bg-sand object-cover"
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold">{order.customer.name}</span>
                          <span className="block text-xs text-ink/50">
                            {order.number} · {order.customer.city}
                          </span>
                          <span className="mt-0.5 block truncate text-xs">
                            {order.items.map((item) => `${item.label} ${item.cm} см`).join(", ")} ·{" "}
                            <b>{money(order.total)}</b>
                          </span>
                        </span>
                      </Link>
                      {next ? <AdvanceButton id={order.id} to={next} /> : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
