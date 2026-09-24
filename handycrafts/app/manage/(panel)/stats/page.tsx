import { money } from "@/lib/catalog";
import { deliveryLabel, type Order } from "@/lib/order-types";
import { listOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

const WEEKS = 8;
const DAY = 24 * 60 * 60 * 1000;

function startOfWeek(date: Date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = (d.getUTCDay() + 6) % 7; // Monday = 0
  return new Date(d.getTime() - day * DAY);
}

function shortDate(date: Date) {
  return date.toLocaleDateString("bg-BG", { day: "numeric", month: "short", timeZone: "UTC" });
}

function tally(orders: Order[], key: (order: Order) => string[]) {
  const counts = new Map<string, number>();
  for (const order of orders) {
    for (const k of key(order)) counts.set(k, (counts.get(k) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export default async function StatsPage() {
  const all = await listOrders(1000);
  const orders = all.filter((order) => order.status !== "cancelled");
  const now = new Date();
  const month = now.toISOString().slice(0, 7);
  const thisMonth = orders.filter((order) => order.createdAt.startsWith(month));

  const revenue = thisMonth.reduce((sum, order) => sum + order.total, 0);
  const collected = orders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.status !== "delivered").reduce((sum, o) => sum + o.total, 0);
  const average = orders.length ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length : 0;
  const cancelRate = all.length ? Math.round(((all.length - orders.length) / all.length) * 100) : 0;

  const firstWeek = new Date(startOfWeek(now).getTime() - (WEEKS - 1) * 7 * DAY);
  const weeks = Array.from({ length: WEEKS }, (_, i) => {
    const start = new Date(firstWeek.getTime() + i * 7 * DAY);
    const end = start.getTime() + 7 * DAY;
    const inWeek = orders.filter((o) => {
      const t = Date.parse(o.createdAt);
      return t >= start.getTime() && t < end;
    });
    return { start, total: inWeek.reduce((sum, o) => sum + o.total, 0), count: inWeek.length };
  });
  const peak = Math.max(1, ...weeks.map((w) => w.total));

  const products = tally(orders, (o) => o.items.map((item) => item.label));
  const sizes = tally(orders, (o) => o.items.map((item) => `${item.label} ${item.cm} см`));
  const delivery = tally(orders, (o) => [deliveryLabel[o.customer.delivery]]);
  const cities = tally(orders, (o) => [o.customer.city.trim() || "—"]).slice(0, 5);

  const tiles = [
    { label: "Оборот този месец", value: money(revenue), note: `${thisMonth.length} поръчки` },
    { label: "Средна поръчка", value: money(Math.round(average)), note: `${orders.length} общо` },
    { label: "Прибрани", value: money(collected), note: "получени пратки" },
    { label: "Очаквани", value: money(pending), note: `отказани ${cancelRate}%` },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-3xl">Статистика</h1>

      <div className="grid grid-cols-2 gap-3">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-3xl bg-white p-4">
            <p className="text-xs text-ink/55">{tile.label}</p>
            <p className="mt-1 font-display text-2xl">{tile.value}</p>
            <p className="mt-0.5 text-xs text-ink/45">{tile.note}</p>
          </div>
        ))}
      </div>

      <section className="rounded-3xl bg-white p-5">
        <h2 className="text-base">Оборот по седмици</h2>
        <p className="text-xs text-ink/50">Последните {WEEKS} седмици, без отказаните поръчки</p>
        <div className="mt-6 flex h-44 items-end gap-2 border-b border-ink/15" role="img" aria-label="Оборот по седмици">
          {weeks.map((week) => {
            const height = week.total ? Math.max(4, (week.total / peak) * 100) : 0;
            return (
              <div key={week.start.toISOString()} className="group relative flex h-full flex-1 items-end justify-center">
                <span className="pointer-events-none absolute -top-1 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-[11px] text-paper group-hover:block">
                  {shortDate(week.start)} · {money(week.total)} · {week.count} бр.
                </span>
                <span
                  className="block w-full max-w-10 rounded-t-[4px] bg-ember transition group-hover:bg-ember-deep"
                  style={{ height: `${height}%` }}
                  title={`${shortDate(week.start)}: ${money(week.total)}`}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex gap-2 text-[10px] text-ink/45">
          {weeks.map((week, i) => (
            <span key={week.start.toISOString()} className="flex-1 text-center">
              {i % 2 === 0 || i === WEEKS - 1 ? shortDate(week.start) : ""}
            </span>
          ))}
        </div>
        <table className="sr-only">
          <tbody>
            {weeks.map((week) => (
              <tr key={week.start.toISOString()}>
                <td>{shortDate(week.start)}</td>
                <td>{money(week.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <Breakdown title="Продукти" rows={products} />
        <Breakdown title="Размери" rows={sizes} />
        <Breakdown title="Доставка" rows={delivery} />
        <Breakdown title="Градове" rows={cities} />
      </div>
    </div>
  );
}

function Breakdown({ title, rows }: { title: string; rows: [string, number][] }) {
  const top = Math.max(1, ...rows.map(([, n]) => n));
  return (
    <section className="rounded-3xl bg-white p-5">
      <h2 className="text-base">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-ink/45">Още няма данни.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map(([label, count]) => (
            <li key={label}>
              <div className="flex justify-between text-sm">
                <span>{label}</span>
                <span className="font-semibold">{count}</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-paper">
                <div className="h-2 rounded-full bg-ember" style={{ width: `${(count / top) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
