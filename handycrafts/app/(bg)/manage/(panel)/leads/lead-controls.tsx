"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { LeadStatus } from "@/lib/leads";

type Props = { id: string; phone: string; email: string; status: LeadStatus; note: string };

export default function LeadControls({ id, phone, email, status, note }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState(note);

  async function send(method: "PATCH" | "DELETE", body: Record<string, string>) {
    setBusy(true);
    await fetch("/api/manage/leads", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    }).catch(() => null);
    setBusy(false);
    router.refresh();
  }

  const pill = "rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-50";

  return (
    <div className="mt-4 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {phone ? (
          <>
            <a href={`tel:${phone}`} className={`${pill} bg-ink text-center text-paper`}>
              Обади се
            </a>
            <a href={`viber://chat?number=${encodeURIComponent(phone)}`} className={`${pill} border border-ink/15 text-center`}>
              Viber
            </a>
          </>
        ) : (
          <a href={`mailto:${email}`} className={`${pill} col-span-2 bg-ink text-center text-paper`}>
            Пиши имейл
          </a>
        )}
      </div>
      {status !== "won" ? (
        <div className="flex flex-wrap gap-2">
          {status !== "contacted" ? (
            <button type="button" disabled={busy} onClick={() => send("PATCH", { status: "contacted" })} className={`${pill} bg-sky-100 text-sky-800`}>
              Свързах се
            </button>
          ) : null}
          {status !== "lost" ? (
            <button type="button" disabled={busy} onClick={() => send("PATCH", { status: "lost" })} className={`${pill} bg-ink/5`}>
              Не иска
            </button>
          ) : (
            <button type="button" disabled={busy} onClick={() => send("PATCH", { status: "open" })} className={`${pill} bg-ink/5`}>
              Върни
            </button>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={() => confirm("Да изтрия ли този лийд?") && send("DELETE", {})}
            className={`${pill} ml-auto text-ink/45`}
          >
            Изтрий
          </button>
        </div>
      ) : null}
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={() => text !== note && send("PATCH", { internalNote: text })}
        placeholder="Бележка — напр. ще поръча в петък"
        className="w-full rounded-2xl border border-ink/10 bg-paper px-4 py-2.5 text-sm outline-none focus:border-ember"
      />
    </div>
  );
}
