"use client";

import { useRef, useState, type PointerEvent } from "react";
import { money } from "@/lib/catalog";

export type ChartBar = {
  key: string;
  /** Short axis label, e.g. "14.9". */
  label: string;
  /** Full date or week shown in the tooltip. */
  title: string;
  value: number;
  /** Darker share of the bar (TikTok visits); the rest is drawn lighter. */
  part?: number;
  /** Extra tooltip lines: [label, value]. */
  rows: [string, string][];
};

type Props = {
  title: string;
  unit: "money" | "count";
  /** Sum for the whole period, shown when nothing is selected. */
  total: string;
  totalNote: string;
  bars: ChartBar[];
  /** Names for the two shades when bars have a `part`. */
  legend?: { part: string; rest: string };
  empty?: string;
};

const format = (unit: Props["unit"], n: number) => (unit === "money" ? money(n) : String(n));

/** 1, 2, 5 × 10ⁿ — round numbers for the top gridline. */
function niceMax(value: number) {
  if (value <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((m) => m * power >= value) || 10;
  return step * power;
}

export default function Chart({ title, unit, total, totalNote, bars, legend, empty = "Няма данни за този период." }: Props) {
  const plot = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  let top = niceMax(Math.max(0, ...bars.map((b) => b.value)));
  if (unit === "count" && top % 2) top += 1; // keep the middle gridline a whole number
  const ticks = [top, top / 2, 0];
  const every = Math.ceil(bars.length / 6);
  const hasData = bars.some((b) => b.value > 0);
  const selected = active === null ? null : bars[active];
  const last = bars.length - 1;
  // Every n-th day, plus the last one when it isn't crammed against its neighbour.
  const showLabel = (i: number) => i % every === 0 || (i === last && last % every >= every * 0.6);

  function pick(event: PointerEvent<HTMLDivElement>) {
    const box = plot.current?.getBoundingClientRect();
    if (!box || !bars.length) return;
    const index = Math.floor(((event.clientX - box.left) / box.width) * bars.length);
    setActive(Math.min(bars.length - 1, Math.max(0, index)));
  }

  return (
    <section className="rounded-3xl bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base">{title}</h2>
          <p className="mt-1 font-display text-2xl">{selected ? format(unit, selected.value) : total}</p>
          <p className="text-xs text-ink/50">{selected ? selected.title : totalNote}</p>
          <p className="mt-1 flex min-h-4 flex-wrap gap-x-3 text-xs text-ink/60">
            {selected?.rows.map(([name, value]) => (
              <span key={name}>
                {name} <b className="font-semibold text-ink">{value}</b>
              </span>
            ))}
          </p>
        </div>
        {legend ? (
          <ul className="shrink-0 space-y-1 pt-1 text-xs text-ink/60">
            <li className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-ember" aria-hidden />
              {legend.part}
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-ember/35" aria-hidden />
              {legend.rest}
            </li>
          </ul>
        ) : null}
      </div>

      {hasData ? (
        <>
          <div className="relative mt-5 flex gap-2">
            <div
              ref={plot}
              className="relative h-44 flex-1 cursor-crosshair touch-pan-y select-none"
              onPointerDown={pick}
              onPointerMove={(event) => (event.pointerType === "mouse" || event.buttons ? pick(event) : undefined)}
              onPointerLeave={(event) => event.pointerType === "mouse" && setActive(null)}
              role="img"
              aria-label={`${title}: ${total}`}
            >
              {ticks.map((tick) => (
                <div
                  key={tick}
                  className={`absolute inset-x-0 border-t ${tick === 0 ? "border-ink/20" : "border-dashed border-ink/10"}`}
                  style={{ bottom: `${(tick / top) * 100}%` }}
                />
              ))}

              <div className="absolute inset-0 flex items-end gap-[2px]">
                {bars.map((bar, i) => {
                  const height = bar.value ? Math.max(2, (bar.value / top) * 100) : 0;
                  const dim = active !== null && active !== i;
                  return (
                    <div key={bar.key} className="relative flex h-full flex-1 items-end justify-center">
                      {active === i ? <div className="absolute inset-y-0 w-px bg-ink/15" /> : null}
                      <div
                        className={`relative flex w-full max-w-9 flex-col justify-end overflow-hidden rounded-t-[4px] transition-opacity ${
                          bar.part === undefined ? "bg-ember" : "bg-ember/35"
                        } ${dim ? "opacity-35" : ""}`}
                        style={{ height: `${height}%` }}
                      >
                        {bar.part !== undefined && bar.value ? (
                          <div
                            className="w-full border-t-2 border-white bg-ember"
                            style={{ height: `${(bar.part / bar.value) * 100}%` }}
                          />
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            <div className="relative h-44 w-11 shrink-0 text-[10px] text-ink/45">
              {ticks.map((tick) => (
                <span key={tick} className="absolute right-0 translate-y-1/2" style={{ bottom: `${(tick / top) * 100}%` }}>
                  {format(unit, tick)}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mr-[52px] mt-1.5 h-4 text-[10px] text-ink/45">
            {bars.map((bar, i) =>
              (active === null && showLabel(i)) || active === i ? (
                <span
                  key={bar.key}
                  className={`absolute -translate-x-1/2 whitespace-nowrap ${active === i ? "rounded bg-ink px-1 font-semibold text-paper" : ""}`}
                  style={{ left: `${((i + 0.5) / bars.length) * 100}%` }}
                >
                  {bar.label}
                </span>
              ) : null
            )}
          </div>
          <p className="mt-2 text-[11px] text-ink/40">Докосни или плъзни с пръст по графиката за точните стойности.</p>
        </>
      ) : (
        <p className="mt-4 rounded-2xl bg-paper px-4 py-8 text-center text-sm text-ink/45">{empty}</p>
      )}
    </section>
  );
}
