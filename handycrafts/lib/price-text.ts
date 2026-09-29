import { catalog, priceFor, productIds } from "@/lib/catalog";

// Texts write prices as tokens like "{fig10} €" so they follow the discount switch.
// fig/key = a person's figurine or keychain by size, "x2"/"x3" = for two or three people,
// pet = a pet figurine, from = the lowest price in the shop.

export function priceTokens(discountOn: boolean) {
  const tokens: Record<string, number> = {};
  for (const cm of catalog.figurine.sizes.map((s) => s.cm)) {
    tokens[`fig${cm}`] = priceFor("figurine", cm, 1, "person", discountOn)!;
    tokens[`fig${cm}x2`] = priceFor("figurine", cm, 2, "person", discountOn)!;
    tokens[`fig${cm}x3`] = priceFor("figurine", cm, 3, "person", discountOn)!;
    tokens[`pet${cm}`] = priceFor("figurine", cm, 1, "pet", discountOn)!;
  }
  for (const cm of catalog.keychain.sizes.map((s) => s.cm)) {
    tokens[`key${cm}`] = priceFor("keychain", cm, 1, "person", discountOn)!;
    tokens[`key${cm}x2`] = priceFor("keychain", cm, 2, "person", discountOn)!;
    tokens[`key${cm}x3`] = priceFor("keychain", cm, 3, "person", discountOn)!;
  }
  tokens.from = Math.min(
    ...productIds.flatMap((id) =>
      catalog[id].sizes.flatMap((s) => [priceFor(id, s.cm, 1, "person", discountOn)!, priceFor(id, s.cm, 1, "pet", discountOn)!])
    )
  );
  return tokens;
}

/** Puts current prices into every string of a text object (functions and non-plain objects are left alone). */
export function fillPrices<T>(value: T, discountOn: boolean): T {
  const tokens = priceTokens(discountOn);
  const walk = (item: unknown): unknown => {
    if (typeof item === "string") return item.replace(/\{(\w+)\}/g, (all, key) => (key in tokens ? String(tokens[key]) : all));
    if (Array.isArray(item)) return item.map(walk);
    if (item && typeof item === "object" && Object.getPrototypeOf(item) === Object.prototype) {
      return Object.fromEntries(Object.entries(item).map(([k, v]) => [k, walk(v)]));
    }
    return item;
  };
  return walk(value) as T;
}
