"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { orderStatuses, statusLabel, type Order, type OrderStatus } from "@/lib/order-types";

const emailLabel: Record<string, string> = {
  received: "Приета",
  confirmed: "Потвърдена",
  printing: "В изработка",
  shipped: "Изпратена",
  delivered: "Получена",
  cancelled: "Отказана",
};

export default function OrderControls({
  id,
  status,
  internalNote,
  tracking,
  hasEmail,
  emails,
}: {
  id: string;
  status: OrderStatus;
  internalNote: string;
  tracking?: Order["tracking"];
  hasEmail: boolean;
  emails: NonNullable<Order["emails"]>;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [note, setNote] = useState(internalNote);
  const [courier, setCourier] = useState<"econt" | "speedy">(tracking?.courier || "econt");
  const [number, setNumber] = useState(tracking?.number || "");
  const [notify, setNotify] = useState(true);
  const [state, setState] = useState("");

  async function save(change: Record<string, unknown>) {
    setState("Записва се…");
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(change),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setState("Не се записа");
      return;
    }
    setState(
      data.emailed === true ? "Записано ✓ · имейлът е изпратен" : data.emailed === false ? "Записано ✓ · имейлът НЕ тръгна" : "Записано ✓"
    );
    router.refresh();
  }

  async function changeStatus(next: OrderStatus) {
    setCurrent(next);
    // Save the tracking number together with "shipped" so it goes into that email.
    const withTracking = next === "shipped" && number.trim() ? { tracking: { courier, number: number.trim() } } : {};
    await save({ status: next, notify, ...withTracking });
  }

  return (
    <section className="space-y-5 rounded-3xl bg-white p-5">
      <div>
        <p className="text-sm font-semibold">Статус</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {orderStatuses.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => changeStatus(item)}
              className={`rounded-full px-4 py-2 text-sm ${current === item ? "bg-ink text-paper" : "bg-paper hover:bg-sand"}`}
            >
              {statusLabel[item]}
            </button>
          ))}
        </div>
        <label className={`mt-3 flex items-center gap-2 text-sm ${hasEmail ? "" : "opacity-50"}`}>
          <input
            type="checkbox"
            checked={notify && hasEmail}
            disabled={!hasEmail}
            onChange={(event) => setNotify(event.target.checked)}
            className="h-4 w-4 accent-[#ff7a00]"
          />
          {hasEmail ? "Прати имейл на клиента при смяна на статуса" : "Клиентът не е оставил имейл"}
        </label>
      </div>

      <div>
        <p className="text-sm font-semibold">Товарителница</p>
        <div className="mt-2 flex gap-2">
          <select
            value={courier}
            onChange={(event) => setCourier(event.target.value as "econt" | "speedy")}
            className="rounded-2xl border border-ink/10 bg-white px-3 py-2.5 text-sm"
          >
            <option value="econt">Еконт</option>
            <option value="speedy">Спиди</option>
          </select>
          <input
            value={number}
            onChange={(event) => setNumber(event.target.value)}
            inputMode="numeric"
            placeholder="Номер"
            className="min-w-0 flex-1 rounded-2xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-ember"
          />
          <button
            type="button"
            onClick={() => save({ tracking: number.trim() ? { courier, number: number.trim() } : null })}
            className="rounded-2xl bg-paper px-4 text-sm font-semibold hover:bg-sand"
          >
            Запази
          </button>
        </div>
        <p className="mt-1.5 text-xs text-ink/50">Попълни я преди „Изпратена“ — влиза в имейла с линк за проследяване.</p>
      </div>

      <label className="block text-sm font-semibold">
        Вътрешна бележка
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          onBlur={() => note !== internalNote && save({ internalNote: note })}
          placeholder="Само за работилницата — напр. уговорки по телефона"
          className="mt-2 min-h-20 w-full rounded-2xl border border-ink/10 px-4 py-3 font-normal outline-none focus:border-ember"
        />
      </label>

      {emails.length ? (
        <div>
          <p className="text-sm font-semibold">Имейли до клиента</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {emails
              .slice()
              .reverse()
              .map((mail) => (
                <li key={mail.at} className="flex justify-between gap-3">
                  <span>
                    {mail.ok ? "✓" : "✗"} {emailLabel[mail.type] || mail.type}
                  </span>
                  <span className="text-ink/45">
                    {new Date(mail.at).toLocaleString("bg-BG", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Sofia" })}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      {hasEmail && current !== "new" ? (
        <button type="button" onClick={() => save({ resend: true })} className="text-sm font-semibold underline decoration-ember underline-offset-4">
          Прати пак имейла за „{statusLabel[current]}“
        </button>
      ) : null}

      {state ? <p className="text-xs text-ink/55">{state}</p> : null}
    </section>
  );
}
