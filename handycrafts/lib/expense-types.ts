// Shared by the panel pages and the browser; the storage lives in lib/expenses.ts.

export const expenseCategories = ["materials", "paint", "packaging", "shipping", "ads", "tools", "software", "other"] as const;
export type ExpenseCategory = (typeof expenseCategories)[number];

export const expenseLabel: Record<ExpenseCategory, string> = {
  materials: "Материали (смола, филамент)",
  paint: "Бои и консумативи",
  packaging: "Опаковки",
  shipping: "Доставки и куриери",
  ads: "Реклама",
  tools: "Техника и инструменти",
  software: "Софтуер и AI",
  other: "Друго",
};

export type Expense = {
  id: string;
  /** "YYYY-MM-DD" — the day the money was spent. */
  date: string;
  amount: number;
  category: ExpenseCategory;
  note: string;
  createdAt: string;
};

export function isExpenseCategory(value: unknown): value is ExpenseCategory {
  return (expenseCategories as readonly unknown[]).includes(value);
}
