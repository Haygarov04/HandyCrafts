import { catalog, priceFor, productionDays, productIds } from "@/lib/catalog";
import { absolute, business, siteName } from "@/lib/site";

// Machine-readable catalog for AI assistants and agents (linked from llms.txt): every product, size
// and price, and how to order. Prices come straight from the catalog, so they are always current.
export const dynamic = "force-static";

const links: Record<string, { bg: string; en: string }> = {
  figurine: { bg: "/figurka-po-snimka", en: "/en/custom-figurine-from-photo" },
  keychain: { bg: "/figurka-na-domashen-lyubimets", en: "/en/pet-figurine-from-photo" },
  kit: { bg: "/figurka-za-otsvetyavane", en: "/en/paint-your-own-figurine" },
};

const descriptions: Record<string, string> = {
  figurine: "Custom 3D printed figurine of a person, couple, family (up to 3 people on one base) or pet, made from one photo and hand-painted.",
  keychain: "Small keychain figurine of a pet, made from a photo, with a metal ring. Pets only.",
  kit: "Paint-it-yourself kit: the same custom figurine from a photo, sent white and primed with 6 paints in its own colours, 2 brushes and a colour guide.",
};

export function GET() {
  const products = productIds.map((id) => ({
    id,
    name: catalog[id].label,
    description: descriptions[id],
    url: { bg: absolute(links[id].bg), en: absolute(links[id].en) },
    order_url: absolute(`/en/studio?product=${id}`),
    sizes: catalog[id].sizes.map((size) => ({
      height_cm: size.cm,
      price_eur: {
        one_person: id === "keychain" ? undefined : size.price,
        two_people: id === "keychain" ? undefined : priceFor(id, size.cm, 2),
        three_people: id === "keychain" ? undefined : priceFor(id, size.cm, 3),
        pet: priceFor(id, size.cm, 1, "pet"),
      },
    })),
  }));
  return Response.json(
    {
      shop: siteName,
      url: absolute("/"),
      description: "Custom 3D printed, hand-painted figurines from a photo, made in Ruse, Bulgaria. Free preview in about a minute before ordering.",
      contact: business.email,
      currency: "EUR",
      production_time: productionDays.replace("работни дни", "working days"),
      delivery: "Bulgaria: Econt or Speedy, 1–2 working days, cash on delivery. Other countries: on request by email (deposit in advance).",
      how_to_order: [
        "Open the studio (order_url), choose the product and size.",
        "Upload one clear photo and see a free preview in about a minute.",
        "Add it to the cart and order; we confirm by phone or email before making it.",
      ],
      products,
    },
    { headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=3600" } }
  );
}
