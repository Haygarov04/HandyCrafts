export const currency = "€";

export const catalog = {
  figurine: {
    label: "Фигурка",
    short: "Цяла фигура върху основа",
    line: "Цял ръст, върху ниска кръгла основа. Стои на рафт, бюро или торта.",
    sizes: [{ cm: 10 }, { cm: 15 }, { cm: 20 }],
  },
  keychain: {
    label: "Ключодържател",
    short: "Мини фигура с халка",
    line: "Малка плътна фигурка с метална халка. Винаги в джоба.",
    sizes: [{ cm: 5 }, { cm: 6 }],
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

/** Figurines and keychains of people can show up to three people together. */
export const maxPeople = 3;
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

export const productIds = Object.keys(catalog) as ProductId[];

export function isProductId(value: unknown): value is ProductId {
  return typeof value === "string" && value in catalog;
}

/** Regular prices by size, for 1, 2 and 3 people. Pets are always one. */
const regular: Record<ProductId, Record<SubjectId, Record<number, number[]>>> = {
  figurine: {
    person: { 10: [60, 100, 130], 15: [90, 155, 210], 20: [110, 190, 260] },
    pet: { 10: [50], 15: [80], 20: [100] },
  },
  keychain: {
    person: { 5: [40, 50, 70], 6: [50, 65, 90] },
    pet: { 5: [40], 6: [50] },
  },
};

/** Taken off the regular price while the discount is switched on in /manage → Настройки. */
export const discount = 10;

/** Pieces the discount applies to: pets, single keychains and figurines of one or two people. */
function discounted(product: ProductId, subject: SubjectId, people: number) {
  if (subject === "pet") return true;
  return product === "keychain" ? people === 1 : people <= 2;
}

/** What the customer pays. */
export function priceFor(product: ProductId, cm: number, people = 1, subject: SubjectId = "person", discountOn = true) {
  const price = regular[product][subject][cm]?.[subject === "pet" ? 0 : people - 1];
  if (price === undefined) return null;
  return discountOn && discounted(product, subject, people) ? price - discount : price;
}

/** The crossed-out regular price, or null when nothing is taken off. */
export function regularPrice(product: ProductId, cm: number, people = 1, subject: SubjectId = "person", discountOn = true) {
  if (!discountOn || !discounted(product, subject, people)) return null;
  return regular[product][subject][cm]?.[subject === "pet" ? 0 : people - 1] ?? null;
}

/** How much the discount takes off a cart. */
export function discountTotal(
  items: { product: ProductId; subject?: SubjectId; cm: number; people?: number; qty: number }[],
  discountOn: boolean
) {
  return items.reduce((sum, item) => {
    const was = regularPrice(item.product, item.cm, item.people || 1, item.subject, discountOn);
    const now = priceFor(item.product, item.cm, item.people || 1, item.subject, discountOn);
    return sum + (was && now ? (was - now) * item.qty : 0);
  }, 0);
}

export function fromPrice(product: ProductId, subject: SubjectId = "person", discountOn = true) {
  return priceFor(product, catalog[product].sizes[0].cm, 1, subject, discountOn) ?? 0;
}

export function money(value: number) {
  return `${value.toFixed(value % 1 ? 2 : 0)} ${currency}`;
}

export const productionDays = "7–12 работни дни";
export const maxQty = 5;
