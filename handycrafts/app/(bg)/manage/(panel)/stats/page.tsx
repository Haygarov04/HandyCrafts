import { money } from "@/lib/catalog";
import { deliveryLabel, type Order } from "@/lib/order-types";
import { listOrders } from "@/lib/orders";
import { visitSourceLabel, visitSources, visitsByDay } from "@/lib/visits";

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
  const [all, visitDays] = await Promise.all([listOrders(1000), visitsByDay(30)]);
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

  const sumVisits = (days: typeof visitDays) =>
    visitSources.map((source) => [visitSourceLabel[source], days.reduce((sum, d) => sum + d.bySource[source], 0)] as [string, number]);
  const visits30 = sumVisits(visitDays).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
  const visitsToday = visitDays[visitDays.length - 1];
  const last14 = visitDays.slice(-14);
  const tiktokPeak = Math.max(1, ...last14.map((d) => d.bySource.tiktok));
  const tiktok7 = visitDays.slice(-7).reduce((sum, d) => sum + d.bySource.tiktok, 0);
  const total7 = visitDays.slice(-7).reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl">Статистика</h1>

      <section className="rounded-3xl bg-white p-5">
        <h2 className="text-base">Посещения</h2>
        <p className="text-xs text-ink/50">Броят се веднъж на посещение, без лични данни</p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-paper p-3">
            <p className="font-display text-2xl">{visitsToday?.total ?? 0}</p>
            <p className="text-[11px] text-ink/55">днес</p>
          </div>
          <div className="rounded-2xl bg-paper p-3">
            <p className="font-display text-2xl">{total7}</p>
            <p className="text-[11px] text-ink/55">7 дни</p>
          </div>
          <div className="rounded-2xl bg-ember/15 p-3">
            <p className="font-display text-2xl">{tiktok7}</p>
            <p className="text-[11px] text-ink/55">от TikTok · 7 дни</p>
          </div>
        </div>

        <p className="mt-6 text-sm font-semibold">TikTok по дни</p>
        <div className="mt-3 flex h-28 items-end gap-1.5 border-b border-ink/15" role="img" aria-label="Посещения от TikTok по дни">
          {last14.map((d) => (
            <div key={d.day} className="group relative flex h-full flex-1 items-end justify-center">
              <span className="pointer-events-none absolute -top-1 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-[11px] text-paper group-hover:block">
                {d.day.slice(8)}.{d.day.slice(5, 7)} · {d.bySource.tiktok}
              </span>
              <span
                className="block w-full max-w-8 rounded-t-[4px] bg-ember"
                style={{ height: `${d.bySource.tiktok ? Math.max(4, (d.bySource.tiktok / tiktokPeak) * 100) : 0}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex gap-1.5 text-[10px] text-ink/45">
          {last14.map((d, i) => (
            <span key={d.day} className="flex-1 text-center">
              {i % 2 === 0 || i === last14.length - 1 ? `${Number(d.day.slice(8))}.${Number(d.day.slice(5, 7))}` : ""}
            </span>
          ))}
        </div>
      </section>

      <Breakdown title="Откъде идват · 30 дни" rows={visits30} />

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
