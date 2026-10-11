"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { money } from "@/lib/catalog";
import { expenseCategories, expenseLabel, type Expense, type ExpenseCategory } from "@/lib/expense-types";

const field = "mt-1.5 block w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-base text-ink outline-none focus:border-ember";
const today = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Sofia" });

/** Adds an expense, or edits one when `expense` is given. */
export default function ExpenseForm({ expense, onDone }: { expense?: Expense; onDone?: () => void }) {
  const router = useRouter();
  const [amount, setAmount] = useState(expense ? String(expense.amount) : "");
  const [date, setDate] = useState(expense?.date || today());
  const [category, setCategory] = useState<ExpenseCategory>(expense?.category || "materials");
  const [note, setNote] = useState(expense?.note || "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const res = await fetch(expense ? `/api/manage/expenses/${expense.id}` : "/api/manage/expenses", {
      method: expense ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, date, category, note }),
    }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    setBusy(false);
    if (!res?.ok) {
      setMessage(data?.error || "Не се записа.");
      return;
    }
    if (!expense) {
      setAmount("");
      setNote("");
      setMessage("Записано ✓");
    }
    onDone?.();
    router.refresh();
  }

  return (
    <form onSubmit={submit} className={expense ? "space-y-3 py-3" : "space-y-4 rounded-3xl bg-white p-5"}>
      {expense ? null : <p className="font-display text-lg">Нов разход</p>}
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-semibold">
          Сума, €
          <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="0" required className={`${field} font-display text-xl`} />
        </label>
        <label className="block text-sm font-semibold">
          Дата
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={field} />
        </label>
      </div>
      <label className="block text-sm font-semibold">
        За какво
        <select value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)} className={field}>
          {expenseCategories.map((key) => (
            <option key={key} value={key}>
              {expenseLabel[key]}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-semibold">
        Бележка <span className="font-normal text-ink/50">(по желание)</span>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="напр. 2 бутилки смола, Elegoo" className={field} />
      </label>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={busy} className="rounded-full bg-ember px-6 py-3 font-semibold text-ink disabled:opacity-60">
          {busy ? "Записва се…" : expense ? "Запази" : "Добави разхода"}
        </button>
        {expense ? (
          <button type="button" onClick={onDone} className="text-sm font-semibold text-ink/60">
            Отказ
          </button>
        ) : null}
        {message ? <span className="text-sm text-ink/60">{message}</span> : null}
      </div>
    </form>
  );
}

export function ExpenseRow({ expense, label }: { expense: Expense; label: string }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm("Да изтрия ли този разход?")) return;
    setBusy(true);
    await fetch(`/api/manage/expenses/${expense.id}`, { method: "DELETE" }).catch(() => null);
    router.refresh();
  }

  if (editing) {
    return (
      <li>
        <ExpenseForm expense={expense} onDone={() => setEditing(false)} />
      </li>
    );
  }

  const when = new Date(`${expense.date}T12:00:00Z`).toLocaleDateString("bg-BG", { day: "numeric", month: "short", timeZone: "UTC" });
  return (
    <li className={`flex items-center gap-3 py-3 ${busy ? "opacity-50" : ""}`}>
      <button type="button" onClick={() => setEditing(true)} className="min-w-0 flex-1 text-left">
        <span className="block truncate font-semibold">{expense.note || label}</span>
        <span className="block text-xs text-ink/50">
          {when} · {label}
        </span>
      </button>
      <span className="shrink-0 font-semibold">{money(expense.amount)}</span>
      <button type="button" onClick={remove} aria-label="Изтрий" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink/40 hover:bg-paper hover:text-red-700">
        ✕
      </button>
    </li>
  );
}
