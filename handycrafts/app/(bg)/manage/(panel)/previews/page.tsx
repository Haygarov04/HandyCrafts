import Link from "next/link";
import { itemLabel } from "@/lib/catalog";
import { listLeads } from "@/lib/leads";
import { listDrafts, listOrders, type Draft } from "@/lib/orders";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ show?: string }> };

const filters = [
  { key: "lost", label: "Без поръчка" },
  { key: "ordered", label: "Поръчани" },
  { key: "all", label: "Всички" },
] as const;

type Stage = "ordered" | "lead" | "cart" | "preview";

const stageLabel: Record<Stage, string> = {
  ordered: "Поръча",
  lead: "Остави имейл",
  cart: "Стигна до количката",
  preview: "Само визуализация",
};

const stageTone: Record<Stage, string> = {
  ordered: "bg-emerald-100 text-emerald-800",
  lead: "bg-sky-100 text-sky-800",
  cart: "bg-ember/15 text-ember-deep",
  preview: "bg-ink/10 text-ink/60",
};

function ago(iso: string) {
  const minutes = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (minutes < 60) return `преди ${Math.max(1, minutes)} мин`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `преди ${hours} ч`;
  return new Date(iso).toLocaleString("bg-BG", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Sofia" });
}

const percent = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 100)}%` : "—");

export default async function PreviewsPage({ searchParams }: Props) {
  const show = (await searchParams).show || "lost";
  const [drafts, orders, leads] = await Promise.all([listDrafts(), listOrders(), listLeads()]);

  const orderOf = new Map<string, string>();
  for (const order of orders) for (const item of order.items) orderOf.set(item.draftId, order.number);
  const leadOf = new Map<string, string>();
  for (const lead of leads) for (const item of lead.items) leadOf.set(item.draftId, lead.customer.email || lead.customer.phone);

  // "Нов опит" makes another preview from the same photo: count those as one try.
  const groups = new Map<string, Draft[]>();
  for (const draft of drafts) {
    const key = draft.root || draft.id;
    groups.set(key, [...(groups.get(key) || []), draft]);
  }
  const tries = [...groups.values()].map((list) => {
    const latest = list[0];
    const order = list.map((d) => orderOf.get(d.id)).find(Boolean);
    const contact = list.map((d) => leadOf.get(d.id)).find(Boolean);
    const stage: Stage = order ? "ordered" : contact ? "lead" : list.some((d) => d.cartAt) ? "cart" : "preview";
    return { latest, count: list.length, order, contact, stage, started: list[list.length - 1].createdAt };
  });

  const total = tries.length;
  const reachedCart = tries.filter((t) => t.stage !== "preview").length;
  const ordered = tries.filter((t) => t.stage === "ordered").length;
  const summary = [
    { label: "Визуализации", value: String(total), note: "последните 30 дни" },
    { label: "Стигнаха до количката", value: String(reachedCart), note: percent(reachedCart, total) },
    { label: "Поръчаха", value: String(ordered), note: percent(ordered, total) },
  ];

  const shown = tries.filter((t) => (show === "ordered" ? t.stage === "ordered" : show === "all" ? true : t.stage !== "ordered"));

  return (
    <div className="space-y-5">
      <Link href="/manage" className="text-sm text-ink/55 hover:text-ink">
        ‹ Поръчки
      </Link>
      <div>
        <h1 className="text-3xl">Визуализации</h1>
        <p className="mt-1 text-sm text-ink/55">
          Всеки, който е направил визуализация в студиото, и докъде е стигнал. Нов опит със същата снимка се брои като един. Пазят се 30 дни.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {summary.map((item) => (
          <div key={item.label} className="rounded-3xl bg-white p-4">
            <p className="text-xs text-ink/50">{item.label}</p>
            <p className="mt-1 font-display text-xl sm:text-2xl">{item.value}</p>
            <p className="text-xs text-ink/45">{item.note}</p>
          </div>
        ))}
      </div>

      <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {filters.map((item) => (
          <Link
            key={item.key}
            href={`/manage/previews?show=${item.key}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm ${show === item.key ? "bg-ink text-paper" : "bg-white"}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {shown.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center text-ink/55">Няма нищо тук.</div>
      ) : (
        <ul className="grid gap-3">
          {shown.map(({ latest, count, order, contact, stage, started }) => (
            <li key={latest.id} className="flex gap-4 rounded-3xl bg-white p-3">
              <a href={`/api/studio/draft/${latest.id}`} target="_blank" rel="noreferrer" className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/studio/draft/${latest.id}`} alt="" loading="lazy" className="h-20 w-20 rounded-2xl bg-sand object-cover" />
              </a>
              <div className="min-w-0 flex-1 py-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 font-semibold leading-snug">
                    {itemLabel(latest.product, latest.subject, latest.people)} · {latest.cm} см
                  </p>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${stageTone[stage]}`}>
                    {order || stageLabel[stage]}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-ink/55">
                  {ago(started)}
                  {count > 1 ? ` · ${count} опита` : ""}
                </p>
                {latest.clothes || latest.pose ? (
                  <p className="mt-1 line-clamp-2 text-xs text-ink/50">{[latest.clothes, latest.pose].filter(Boolean).join(" · ")}</p>
                ) : null}
                {latest.edits?.length ? (
                  <p className="mt-1 line-clamp-2 text-xs text-ink/50">Чат: {latest.edits.join(" → ")}</p>
                ) : null}
                {contact ? (
                  <Link href="/manage/leads" className="mt-1 inline-block text-sm text-sky-800 underline">
                    {contact}
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
