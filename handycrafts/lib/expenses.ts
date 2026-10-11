import { del, getJSON, setJSON, zadd, zrem, zrevrange } from "@/lib/kv";
import { cleanText } from "@/lib/security";
import { isExpenseCategory, type Expense } from "@/lib/expense-types";

export * from "@/lib/expense-types";

// Money spent on the business, written down by hand in the panel: materials, paint, ads…
// Each expense counts on its own date, so profit for a period is turnover minus these.

export async function saveExpense(expense: Expense) {
  await setJSON(`expense:${expense.id}`, expense);
  await zadd("expenses", Date.parse(`${expense.date}T12:00:00Z`), expense.id);
}

export async function getExpense(id: string) {
  if (!/^[a-f0-9-]{36}$/.test(id)) return null;
  return getJSON<Expense>(`expense:${id}`);
}

/** Newest first. */
export async function listExpenses(limit = 5000) {
  const ids = await zrevrange("expenses", 0, limit - 1);
  const list = await Promise.all(ids.map((id) => getJSON<Expense>(`expense:${id}`)));
  return list.filter((expense): expense is Expense => Boolean(expense));
}

export async function deleteExpense(id: string) {
  await del(`expense:${id}`);
  await zrem("expenses", id);
}

/** Checks what the panel sent. Returns an error message when the amount or date is missing. */
export function expenseFromBody(body: unknown, base: Pick<Expense, "id" | "createdAt">): Expense | string {
  const data = (body || {}) as Record<string, unknown>;
  const amount = Math.round(Number(String(data.amount ?? "").replace(",", ".")) * 100) / 100;
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000) return "Въведи сума.";
  const date = String(data.date || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) return "Избери дата.";
  return {
    ...base,
    date,
    amount,
    category: isExpenseCategory(data.category) ? data.category : "other",
    note: cleanText(data.note, 200),
  };
}
