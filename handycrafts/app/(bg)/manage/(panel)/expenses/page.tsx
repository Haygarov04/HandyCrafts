import { money } from "@/lib/catalog";
import { expenseLabel, listExpenses } from "@/lib/expenses";
import ExpenseForm, { ExpenseRow } from "./expense-form";

export const dynamic = "force-dynamic";

const monthName = (month: string) =>
  new Date(`${month}-15T12:00:00Z`).toLocaleDateString("bg-BG", { month: "long", year: "numeric", timeZone: "UTC" });

export default async function ExpensesPage() {
  const expenses = await listExpenses();
  const months = new Map<string, typeof expenses>();
  for (const expense of expenses) {
    const month = expense.date.slice(0, 7);
    months.set(month, [...(months.get(month) || []), expense]);
  }
  const thisMonth = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Sofia" }).slice(0, 7);
  const monthTotal = (months.get(thisMonth) || []).reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl">Разходи</h1>
          <p className="mt-1 text-sm text-ink/55">Материали, бои, реклама… Влизат в статистиката и от тях се смята печалбата.</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-ink/50">Този месец</p>
          <p className="font-display text-xl">{money(monthTotal)}</p>
        </div>
      </div>

      <ExpenseForm />

      {expenses.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center text-ink/55">Още няма записани разходи.</div>
      ) : (
        [...months.entries()].map(([month, list]) => (
          <section key={month} className="rounded-3xl bg-white p-5">
            <header className="flex items-baseline justify-between">
              <h2 className="text-base capitalize">{monthName(month)}</h2>
              <p className="font-semibold">{money(list.reduce((sum, e) => sum + e.amount, 0))}</p>
            </header>
            <ul className="mt-3 divide-y divide-ink/5">
              {list.map((expense) => (
                <ExpenseRow key={expense.id} expense={expense} label={expenseLabel[expense.category]} />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
