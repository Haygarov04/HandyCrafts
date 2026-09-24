export const currency = "€";

export const catalog = {
  figurine: {
    label: "Фигурка",
    short: "Цяла фигура върху основа",
    line: "Цял ръст, върху ниска кръгла основа. Стои на рафт, бюро или торта.",
    sizes: [
      { cm: 10, price: 50 },
      { cm: 15, price: 80 },
      { cm: 20, price: 100 },
    ],
  },
  keychain: {
    label: "Ключодържател",
    short: "Мини фигура с халка",
    line: "Малка плътна фигурка с метална халка. Винаги в джоба.",
    sizes: [
      { cm: 5, price: 30 },
      { cm: 6, price: 40 },
    ],
  },
} as const;

export type ProductId = keyof typeof catalog;

export const productIds = Object.keys(catalog) as ProductId[];

export function isProductId(value: unknown): value is ProductId {
  return typeof value === "string" && value in catalog;
}

export function priceFor(product: ProductId, cm: number) {
  const size = catalog[product].sizes.find((item) => item.cm === cm);
  return size ? size.price : null;
}

export function fromPrice(product: ProductId) {
  return Math.min(...catalog[product].sizes.map((item) => item.price));
}

export function money(value: number) {
  return `${value.toFixed(value % 1 ? 2 : 0)} ${currency}`;
}

export const productionDays = "7–12 работни дни";
export const maxQty = 5;
