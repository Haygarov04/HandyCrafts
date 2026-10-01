import Link from "next/link";
import { money } from "@/lib/catalog";
import { deliveryLabel, type Order } from "@/lib/order-types";
import { listOrders } from "@/lib/orders";
import { dayKey, visitSourceLabel, visitSources, visitsOnDays } from "@/lib/visits";

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

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const collected = orders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.total, 0);
  const pending = revenue - collected;
  const average = orders.length ? revenue / orders.length : 0;
  const cancelRate = inRange.length ? Math.round(((inRange.length - orders.length) / inRange.length) * 100) : 0;
  const visitTotal = visitDays.reduce((sum, d) => sum + d.total, 0);
  const conversion = visitTotal ? ((orders.length / visitTotal) * 100).toFixed(1) : "0";

  const tiles = [
    { label: "Оборот", value: money(revenue), note: `${orders.length} поръчки` },
    { label: "Средна поръчка", value: money(Math.round(average)), note: `отказани ${cancelRate}%` },
    { label: "Прибрани", value: money(collected), note: "получени пратки" },
    { label: "Очаквани", value: money(pending), note: "още не са получени" },
    { label: "Посещения", value: String(visitTotal), note: `${visitDays.reduce((s, d) => s + d.bySource.tiktok, 0)} от TikTok` },
    { label: "Конверсия", value: `${conversion}%`, note: "поръчки от посещения" },
  ];

  const groups = buckets(days);
  const weekly = days.length > 31;
  const revenueBars = groups.map((g) => {
    const set = new Set(g.days);
    const list = orders.filter((o) => set.has(dayKey(new Date(o.createdAt))));
    return { start: g.start, value: list.reduce((sum, o) => sum + o.total, 0), count: list.length };
  });
  const visitBars = groups.map((g) => {
    const set = new Set(g.days);
    const list = visitDays.filter((d) => set.has(d.day));
    return { start: g.start, value: list.reduce((sum, d) => sum + d.total, 0), tiktok: list.reduce((sum, d) => sum + d.bySource.tiktok, 0) };
  });

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

      <Bars
        title={weekly ? "Оборот по седмици" : "Оборот по дни"}
        note="Без отказаните поръчки"
        bars={revenueBars.map((b) => ({ key: b.start, label: short(b.start), value: b.value, tip: `${label(b.start)} · ${money(b.value)} · ${b.count} бр.` }))}
      />
      <Bars
        title={weekly ? "Посещения по седмици" : "Посещения по дни"}
        note="Тъмната част е от TikTok"
        bars={visitBars.map((b) => ({ key: b.start, label: short(b.start), value: b.value, part: b.tiktok, tip: `${label(b.start)} · ${b.value} посещения · ${b.tiktok} TikTok` }))}
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

function Bars({
  title,
  note,
  bars,
}: {
  title: string;
  note: string;
  bars: { key: string; label: string; value: number; part?: number; tip: string }[];
}) {
  const peak = Math.max(1, ...bars.map((b) => b.value));
  const every = Math.ceil(bars.length / 6);
  return (
    <section className="rounded-3xl bg-white p-5">
      <h2 className="text-base">{title}</h2>
      <p className="text-xs text-ink/50">{note}</p>
      <div className="mt-6 flex h-40 items-end gap-1 border-b border-ink/15" role="img" aria-label={title}>
        {bars.map((bar) => (
          <div key={bar.key} className="group relative flex h-full flex-1 items-end justify-center">
            <span className="pointer-events-none absolute -top-1 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-[11px] text-paper group-hover:block">
              {bar.tip}
            </span>
            <span
              className="flex w-full max-w-10 flex-col justify-end overflow-hidden rounded-t-[4px] bg-ember/45"
              style={{ height: `${bar.value ? Math.max(3, (bar.value / peak) * 100) : 0}%` }}
            >
              <span className="block w-full bg-ember" style={{ height: bar.part === undefined ? "100%" : `${bar.value ? (bar.part / bar.value) * 100 : 0}%` }} />
            </span>
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-1 text-[10px] text-ink/45">
        {bars.map((bar, i) => (
          <span key={bar.key} className="flex-1 truncate text-center">
            {i % every === 0 || i === bars.length - 1 ? bar.label : ""}
          </span>
        ))}
      </div>
    </section>
  );
}

function Breakdown({ title, rows }: { title: string; rows: [string, number][] }) {
  const top = Math.max(1, ...rows.map(([, n]) => n));
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
