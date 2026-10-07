import Link from "next/link";
import { after } from "next/server";
import { money } from "@/lib/catalog";
import { emailLabel, nextReminderAt, sendDueReminders } from "@/lib/lead-mail";
import { leadLabel, leadTone, listLeads } from "@/lib/leads";
import { deliveryLabel } from "@/lib/order-types";
import LeadControls from "./lead-controls";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ show?: string }> };

const filters = [
  { key: "todo", label: "За обаждане" },
  { key: "won", label: "Поръчаха" },
  { key: "lost", label: "Не искат" },
] as const;

const when = (iso: string) =>
  new Date(iso).toLocaleString("bg-BG", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Sofia" });

function until(at: number) {
  const minutes = Math.round((at - Date.now()) / 60000);
  if (minutes <= 1) return "всеки момент";
  if (minutes < 60) return `след ${minutes} мин`;
  const hours = Math.round(minutes / 60);
  return hours < 24 ? `след ${hours} ч` : `след ${Math.round(hours / 24)} дни`;
}

function ago(iso: string) {
  const minutes = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (minutes < 60) return `преди ${Math.max(1, minutes)} мин`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `преди ${hours} ч`;
  return new Date(iso).toLocaleString("bg-BG", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Sofia" });
}

export default async function LeadsPage({ searchParams }: Props) {
  const show = (await searchParams).show || "todo";
  after(() => sendDueReminders().catch(() => undefined));
  const leads = await listLeads();
  const shown = leads.filter((lead) =>
    show === "won" ? lead.status === "won" : show === "lost" ? lead.status === "lost" : lead.status === "open" || lead.status === "contacted"
  );

  return (
    <div className="space-y-5">
      <Link href="/manage" className="text-sm text-ink/55 hover:text-ink">
        ‹ Поръчки
      </Link>
      <div>
        <h1 className="text-3xl">Незавършени поръчки</h1>
        <p className="mt-1 text-sm text-ink/55">
          Хора, които са написали телефон или имейл в количката, но не са натиснали „Поръчай“, или са поискали визуализацията си на имейл от студиото. Пазят се 30 дни.
        </p>
      </div>

      <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {filters.map((item) => (
          <Link
            key={item.key}
            href={`/manage/leads?show=${item.key}`}
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
          {shown.map((lead) => {
            const c = lead.customer;
            const phone = c.phone.replace(/[^\d+]/g, "");
            return (
              <li key={lead.id} className="rounded-3xl bg-white p-4">
                <div className="flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/manage/leads/${lead.id}/file?item=0`}
                    alt=""
                    loading="lazy"
                    className="h-20 w-20 shrink-0 rounded-2xl bg-sand object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-semibold">{c.name || "Без име"}</p>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${leadTone[lead.status]}`}>
                        {lead.status === "won" && lead.orderNumber ? lead.orderNumber : leadLabel[lead.status]}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-ink/55">
                      {[c.phone, c.email].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-1 text-sm">
                      {lead.items.map((item) => `${item.label} ${item.cm} см${item.qty > 1 ? ` ×${item.qty}` : ""}`).join(", ")}
                      <span className="font-semibold"> · {money(lead.total)}</span>
                    </p>
                    <p className="mt-1 text-xs text-ink/45">
                      {ago(lead.updatedAt)}
                      {c.city ? ` · ${c.city}` : ""}
                      {c.city && c.address ? ` · ${deliveryLabel[c.delivery]}: ${c.address}` : ""}
                      {lead.lang === "en" ? " · EN" : ""}
                      {lead.source === "studio" ? " · имейл от студиото" : ""}
                    </p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 rounded-2xl bg-paper px-4 py-3 text-xs text-ink/60">
                  {(lead.emails || []).map((mail) => (
                    <li key={mail.at} className={mail.ok ? "" : "text-red-700"}>
                      {mail.ok ? "✓" : "✗"} {emailLabel(lead, mail.step)} · {when(mail.at)}
                      {mail.ok ? "" : " · не мина"}
                    </li>
                  ))}
                  <li>
                    {!c.email
                      ? "Няма имейл — само обаждане."
                      : lead.optOut
                        ? "Клиентът спря напомнянията."
                        : (() => {
                            const at = nextReminderAt(lead);
                            if (at) return `Следващ имейл: ${emailLabel(lead, (lead.emails || []).length)} — ${until(at)}`;
                            if (lead.status === "won" || lead.status === "lost") return "Имейлите са спрени.";
                            return "Всички напомняния са пратени.";
                          })()}
                  </li>
                </ul>
                <LeadControls
                  id={lead.id}
                  phone={phone}
                  email={c.email}
                  status={lead.status}
                  note={lead.internalNote || ""}
                  mailing={nextReminderAt(lead) !== null}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
