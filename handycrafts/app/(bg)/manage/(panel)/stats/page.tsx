import Link from "next/link";
import { money } from "@/lib/catalog";
import { deliveryLabel, type Order } from "@/lib/order-types";
import { listOrders } from "@/lib/orders";
import { dayKey, visitSourceLabel, visitSources, visitsOnDays } from "@/lib/visits";
import Chart from "./chart";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ p?: string; from?: string; to?: string }> };

const DAY = 24 * 60 * 60 * 1000;
const MAX_DAYS = 400;

/** "YYYY-MM-DD" ↔ a UTC midnight timestamp, so day arithmetic never trips over time zones. */
const toTime = (day: string) => Date.parse(`${day}T00:00:00Z`);
const toDay = (time: number) => new Date(time).toISOString().slice(0, 10);
/** "1.7" — short enough for a bar label. */
const short = (day: string) => `${Number(day.slice(8))}.${Number(day.slice(5, 7))}`;
const isDay = (value?: string): value is string => Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(toTime(value)));

function mondayOf(day: string) {
  const t = toTime(day);
  return toDay(t - ((new Date(t).getUTCDay() + 6) % 7) * DAY);
}

const presets = [
  { key: "week", label: "Седмица" },
  { key: "month", label: "Месец" },
  { key: "lastmonth", label: "Миналия месец" },
] as const;

function period(params: { p?: string; from?: string; to?: string }) {
  const today = dayKey(new Date());
  if (params.p === "custom" && isDay(params.from) && isDay(params.to)) {
    let [from, to] = params.from <= params.to ? [params.from, params.to] : [params.to, params.from];
    if (to > today) to = today;
    if (from > to) from = to;
    if ((toTime(to) - toTime(from)) / DAY >= MAX_DAYS) from = toDay(toTime(to) - (MAX_DAYS - 1) * DAY);
    return { key: "custom", from, to };
  }
  if (params.p === "week") return { key: "week", from: mondayOf(today), to: today };
  if (params.p === "lastmonth") {
    const firstThis = `${today.slice(0, 7)}-01`;
    const lastPrev = toDay(toTime(firstThis) - DAY);
    return { key: "lastmonth", from: `${lastPrev.slice(0, 7)}-01`, to: lastPrev };
  }
  return { key: "month", from: `${today.slice(0, 7)}-01`, to: today };
}

function label(day: string, withYear = false) {
  return new Date(toTime(day)).toLocaleDateString("bg-BG", {
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  });
}

function tally(orders: Order[], key: (order: Order) => string[]) {
  const counts = new Map<string, number>();
  for (const order of orders) {
    for (const k of key(order)) counts.set(k, (counts.get(k) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

/** Daily bars for up to a month, weekly bars beyond that. */
function buckets(days: string[]) {
  if (days.length <= 31) return days.map((day) => ({ start: day, days: [day] }));
  const groups = new Map<string, string[]>();
  for (const day of days) {
    const monday = mondayOf(day);
    groups.set(monday, [...(groups.get(monday) || []), day]);
  }
  // Each bar is labelled with its first day inside the period, not the Monday before it.
  return [...groups.values()].map((list) => ({ start: list[0], days: list }));
}

export default async function StatsPage({ searchParams }: Props) {
  const range = period(await searchParams);
  const days = Array.from({ length: (toTime(range.to) - toTime(range.from)) / DAY + 1 }, (_, i) => toDay(toTime(range.from) + i * DAY));
  const daySet = new Set(days);

  const [all, visitDays] = await Promise.all([listOrders(5000), visitsOnDays(days)]);
  const inRange = all.filter((order) => daySet.has(dayKey(new Date(order.createdAt))));
  const orders = inRange.filter((order) => order.status !== "cancelled");

  // Revenue is booked on the day an order is marked "completed", not when it was placed.
  const doneOn = (order: Order) => dayKey(new Date(order.completedAt || order.updatedAt));
  const completed = all.filter((order) => order.status === "completed" && daySet.has(doneOn(order)));
  const revenue = completed.reduce((sum, o) => sum + o.total, 0);
  const placed = orders.reduce((sum, o) => sum + o.total, 0);
  const open = all.filter((o) => o.status !== "completed" && o.status !== "cancelled");
  const openValue = open.reduce((sum, o) => sum + o.total, 0);
  const average = orders.length ? placed / orders.length : 0;
  const cancelRate = inRange.length ? Math.round(((inRange.length - orders.length) / inRange.length) * 100) : 0;
  const visitTotal = visitDays.reduce((sum, d) => sum + d.total, 0);
  const tiktokTotal = visitDays.reduce((s, d) => s + d.bySource.tiktok, 0);
  const conversion = visitTotal ? ((orders.length / visitTotal) * 100).toFixed(1) : "0";

  const tiles = [
    { label: "Оборот", value: money(revenue), note: `${completed.length} приключени` },
    { label: "Нови поръчки", value: String(orders.length), note: `за ${money(placed)}` },
    { label: "В процес", value: money(openValue), note: `${open.length} неприключени сега` },
    { label: "Средна поръчка", value: money(Math.round(average)), note: `отказани ${cancelRate}%` },
    { label: "Посещения", value: String(visitTotal), note: `${tiktokTotal} от TikTok` },
    { label: "Конверсия", value: `${conversion}%`, note: "поръчки от посещения" },
  ];

  const groups = buckets(days);
  const weekly = days.length > 31;
  const when = (g: { start: string; days: string[] }) =>
    weekly ? `${label(g.days[0])} – ${label(g.days[g.days.length - 1])}` : label(g.start, true);
  const revenueBars = groups.map((g) => {
    const set = new Set(g.days);
    const list = completed.filter((o) => set.has(doneOn(o)));
    const value = list.reduce((sum, o) => sum + o.total, 0);
    return {
      key: g.start,
      label: short(g.start),
      title: when(g),
      value,
      rows: [["Приключени", String(list.length)], ...(list.length ? [["Средно", money(Math.round(value / list.length))]] : [])] as [string, string][],
    };
  });
  const orderBars = groups.map((g) => {
    const set = new Set(g.days);
    const list = orders.filter((o) => set.has(dayKey(new Date(o.createdAt))));
    return {
      key: g.start,
      label: short(g.start),
      title: when(g),
      value: list.length,
      rows: [["Стойност", money(list.reduce((sum, o) => sum + o.total, 0))]] as [string, string][],
    };
  });
  const visitBars = groups.map((g) => {
    const set = new Set(g.days);
    const list = visitDays.filter((d) => set.has(d.day));
    const value = list.reduce((sum, d) => sum + d.total, 0);
    const tiktok = list.reduce((sum, d) => sum + d.bySource.tiktok, 0);
    const got = orders.filter((o) => set.has(dayKey(new Date(o.createdAt)))).length;
    return {
      key: g.start,
      label: short(g.start),
      title: when(g),
      value,
      part: tiktok,
      rows: [
        ["TikTok", String(tiktok)],
        ["Други", String(value - tiktok)],
        ["Поръчки", String(got)],
      ] as [string, string][],
    };
  });
  const per = weekly ? "седмици" : "дни";

  const sources = visitSources
    .map((source) => [visitSourceLabel[source], visitDays.reduce((sum, d) => sum + d.bySource[source], 0)] as [string, number])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);
  const products = tally(orders, (o) => o.items.map((item) => item.label));
  const sizes = tally(orders, (o) => o.items.map((item) => `${item.label} ${item.cm} см`));
  const delivery = tally(orders, (o) => [deliveryLabel[o.customer.delivery]]);
  const cities = tally(orders, (o) => [o.customer.city.trim() || "—"]).slice(0, 5);

  const sameYear = range.from.slice(0, 4) === range.to.slice(0, 4);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl">Статистика</h1>

      <section className="space-y-3 rounded-3xl bg-white p-4">
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset) => (
            <Link
              key={preset.key}
              href={`/manage/stats?p=${preset.key}`}
              className={`rounded-full py-2.5 text-center text-sm font-semibold ${range.key === preset.key ? "bg-ink text-paper" : "bg-paper"}`}
            >
              {preset.label}
            </Link>
          ))}
        </div>
        <form method="get" action="/manage/stats" className="flex flex-wrap items-end gap-2">
          <input type="hidden" name="p" value="custom" />
          <label className="min-w-0 flex-1 text-xs text-ink/55">
            От
            <input type="date" name="from" defaultValue={range.from} className="mt-1 block w-full rounded-xl border border-ink/10 bg-paper px-3 py-2 text-sm text-ink" />
          </label>
          <label className="min-w-0 flex-1 text-xs text-ink/55">
            До
            <input type="date" name="to" defaultValue={range.to} className="mt-1 block w-full rounded-xl border border-ink/10 bg-paper px-3 py-2 text-sm text-ink" />
          </label>
          <button type="submit" className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${range.key === "custom" ? "bg-ink text-paper" : "bg-ember text-ink"}`}>
            Покажи
          </button>
        </form>
        <p className="px-1 text-sm text-ink/60">
          {label(range.from, !sameYear)} – {label(range.to, true)} · {days.length} {days.length === 1 ? "ден" : "дни"}
        </p>
      </section>

      <div className="grid grid-cols-2 gap-3">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-3xl bg-white p-4">
            <p className="text-xs text-ink/55">{tile.label}</p>
            <p className="mt-1 font-display text-2xl">{tile.value}</p>
            <p className="mt-0.5 text-xs text-ink/45">{tile.note}</p>
          </div>
        ))}
      </div>

      <Chart
        title={`Оборот по ${per}`}
        unit="money"
        total={money(revenue)}
        totalNote="от приключените поръчки за периода"
        bars={revenueBars}
        empty="Още няма приключени поръчки в този период."
      />
      <Chart
        title={`Нови поръчки по ${per}`}
        unit="count"
        total={String(orders.length)}
        totalNote="без отказаните"
        bars={orderBars}
      />
      <Chart
        title={`Посещения по ${per}`}
        unit="count"
        total={String(visitTotal)}
        totalNote={`${tiktokTotal} от TikTok`}
        bars={visitBars}
        legend={{ part: "TikTok", rest: "Други" }}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Breakdown title="Откъде идват" rows={sources} />
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
  const sum = rows.reduce((total, [, n]) => total + n, 0);
  return (
    <section className="rounded-3xl bg-white p-5">
      <h2 className="text-base">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-ink/45">Няма данни за този период.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map(([name, count]) => (
            <li key={name}>
              <div className="flex justify-between text-sm">
                <span>{name}</span>
                <span>
                  <span className="font-semibold">{count}</span>
                  <span className="ml-1.5 text-xs text-ink/45">{Math.round((count / sum) * 100)}%</span>
                </span>
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
