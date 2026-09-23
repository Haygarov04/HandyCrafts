export const orderStatuses = [
  "new",
  "review",
  "approved",
  "printing",
  "done",
  "cancelled",
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export const statusLabel: Record<OrderStatus, string> = {
  new: "Нова",
  review: "Преглед",
  approved: "Одобрена",
  printing: "В печат",
  done: "Готова",
  cancelled: "Отказана",
};

export type OrderFileKind = "photo" | "preview" | "glb" | "stl";

export type Order = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  name: string;
  email: string;
  phone: string;
  product: string;
  size: string;
  people: number;
  clothes: string;
  pose: string;
  box: "standard" | "premium";
  rush: boolean;
  secondCopy: boolean;
  files: Partial<Record<OrderFileKind, string>>;
};
