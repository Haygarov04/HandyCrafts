export const currency = "€";

export const catalog = {
  figurine: {
    label: "Фигурка",
    short: "Цяла фигура върху основа",
    line: "Цял ръст, върху ниска кръгла основа. Стои на рафт, бюро или торта.",
    sizes: [
      { cm: 14, price: 40, group: { 2: 60, 3: 70 } },
      { cm: 17, price: 60, group: { 2: 80, 3: 90 } },
      { cm: 20, price: 80, group: { 2: 100, 3: 110 } },
    ],
  },
  // Only for pets now; keychains of people are no longer made (older orders still show them).
  keychain: {
    label: "Ключодържател",
    short: "Мини фигура с халка",
    line: "Малка плътна фигурка с метална халка. Винаги в джоба.",
    sizes: [
      { cm: 6, price: 30, group: { 2: 30, 3: 30 } },
      { cm: 10, price: 40, group: { 2: 40, 3: 40 } },
    ],
  },
} as const;

export type ProductId = keyof typeof catalog;

export const subjects = {
  person: { label: "Човек", of: "" },
  pet: { label: "Домашен любимец", of: "на любимец" },
} as const;

export type SubjectId = keyof typeof subjects;

export function isSubjectId(value: unknown): value is SubjectId {
  return typeof value === "string" && value in subjects;
}

/** Figurines of people can show up to three people together. */
export const maxPeople = 3;
/** Each extra person costs a little less than a whole figurine: 2 people ≈ 1.8×, 3 people ≈ 2.6×. */
const peopleFactor: Record<number, number> = { 1: 1, 2: 1.8, 3: 2.6 };

/** How many people a piece can have: only pieces of people go above one. */
export function normalizePeople(product: ProductId, subject: SubjectId, value: unknown) {
  if (subject !== "person") return 1;
  const n = Math.floor(Number(value) || 1);
  return Math.min(maxPeople, Math.max(1, n));
}

/** "Фигурка", "Фигурка на любимец", "Фигурка на 2 души"… */
export function itemLabel(product: ProductId, subject: SubjectId = "person", people = 1) {
  if (people > 1) return `${catalog[product].label} на ${people} души`;
  return [catalog[product].label, subjects[subject].of].filter(Boolean).join(" ");
}

/** What the shop sells now. Keychains are only for pets — see `isOffered`. */
export const productIds: ProductId[] = ["figurine", "keychain"];

/** Products on offer for a subject: keychains only of pets. */
export function productsFor(subject: SubjectId): ProductId[] {
  return subject === "pet" ? productIds : productIds.filter((id) => id !== "keychain");
}

export function isOffered(product: ProductId, subject: SubjectId = "person") {
  return productsFor(subject).includes(product);
}

/**
 * Sizes that were renamed: figurines 10 → 14 cm and 15 → 17 cm, pet keychains 5 → 6 cm (same prices).
 * The old 6 cm keychain became 10 cm, but 6 cm is a size again, so it can't be told apart and stays 6 cm.
 */
const renamedSizes: Partial<Record<ProductId, Record<number, number>>> = { figurine: { 10: 14, 15: 17 }, keychain: { 5: 6 } };

/** The current size for a stored one, so a preview made before the change can still be ordered. */
export function currentCm(product: ProductId, cm: number) {
  return renamedSizes[product]?.[cm] ?? cm;
}

export function isProductId(value: unknown): value is ProductId {
  return typeof value === "string" && value in catalog;
}

export function priceFor(product: ProductId, cm: number, people = 1) {
  const size = catalog[product].sizes.find((item) => item.cm === cm);
  if (!size) return null;
  if (people > 1 && "group" in size) return size.group[people as 2 | 3] ?? size.price;
  const factor = peopleFactor[people] ?? 1;
  return factor === 1 ? size.price : Math.round((size.price * factor) / 5) * 5;
}

export function fromPrice(product: ProductId) {
  return Math.min(...catalog[product].sizes.map((item) => item.price));
}

export function money(value: number) {
  return `${value.toFixed(value % 1 ? 2 : 0)} ${currency}`;
}

export const productionDays = "7–12 работни дни";
export const maxQty = 5;
