export const orderStatuses = [
  "new",
  "confirmed",
  "printing",
  "shipped",
  "delivered",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export const statusLabel: Record<OrderStatus, string> = {
  new: "Нова",
  confirmed: "Потвърдена",
  printing: "В изработка",
  shipped: "Изпратена",
  delivered: "Получена",
  completed: "Приключена",
  cancelled: "Отказана",
};

export const statusTone: Record<OrderStatus, string> = {
  new: "bg-ember/15 text-ember-deep",
  confirmed: "bg-sky-100 text-sky-800",
  printing: "bg-violet-100 text-violet-800",
  shipped: "bg-amber-100 text-amber-900",
  delivered: "bg-emerald-100 text-emerald-800",
  completed: "bg-ink text-paper",
  cancelled: "bg-ink/10 text-ink/60",
};

export const deliveryLabel = {
  econt: "Офис на Еконт",
  speedy: "Офис на Спиди",
  address: "До адрес",
} as const;

export type Delivery = keyof typeof deliveryLabel;

/** Statuses that never email the customer on their own. The review request for "completed" goes out by hand. */
export const silentStatuses: readonly OrderStatus[] = ["new", "completed"];

/** Couriers need a first and a last name: two words of at least two letters each. */
export function isFullName(name: string) {
  return name.trim().split(/\s+/).filter((word) => /\p{L}{2,}/u.test(word)).length >= 2;
}

export function isStatus(value: unknown): value is OrderStatus {
  return (orderStatuses as readonly unknown[]).includes(value);
}

export type OrderItem = {
  draftId: string;
  product: "figurine" | "keychain";
  subject: "person" | "pet";
  people?: number;
  label: string;
  cm: number;
  price: number;
  qty: number;
  clothes: string;
  pose: string;
  photo?: string;
  preview?: string;
};

export type Order = {
  id: string;
  number: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  payment: "cod";
  /** Language the customer ordered in; older orders have none (Bulgarian). */
  lang?: "bg" | "en";
  customer: {
    name: string;
    phone: string;
    email: string;
    city: string;
    delivery: Delivery;
    address: string;
  };
  note: string;
  internalNote: string;
  items: OrderItem[];
  total: number;
  tracking?: { courier: "econt" | "speedy"; number: string };
  /** When the order was marked "completed" — revenue counts on this day. */
  completedAt?: string;
  /** Emails sent to the customer, newest last. */
  emails?: { type: string; at: string; ok: boolean }[];
};

/** The stage an order normally moves to next; null at the end of the line. */
export const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  new: "confirmed",
  confirmed: "printing",
  printing: "shipped",
  shipped: "delivered",
  delivered: "completed",
  completed: null,
  cancelled: null,
};
