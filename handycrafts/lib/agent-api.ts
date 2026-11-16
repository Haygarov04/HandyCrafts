import { catalog, isProductId, isSubjectId, maxPeople, priceFor, productIds, productionDays, type ProductId, type SubjectId } from "@/lib/catalog";
import { realPieces } from "@/lib/gallery";
import { dict } from "@/lib/i18n";
import { incr } from "@/lib/kv";
import { sendContactMail } from "@/lib/mail";
import { allow, cleanText } from "@/lib/security";
import { absolute, business, siteName } from "@/lib/site";

// The shop for AI agents: one set of read-only tools (products, prices, shipping, real photos, FAQ),
// an order link that opens the studio already set up, and an inquiry that reaches the shop by email.
// The public REST API (/api/public/v1/…) and the MCP server (/mcp) both call these, so they never differ.

export const apiVersion = "1.0.0";

export const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "Mcp-Session-Id, Mcp-Protocol-Version",
};

export class AgentError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

const descriptions: Record<ProductId, string> = {
  figurine: "Custom 3D printed figurine of a person, couple, family (up to 3 people on one base) or pet, made from one photo and painted by hand.",
  keychain: "Small keychain figurine of a pet, made from a photo, with a metal ring. Pets only.",
  kit: "Paint-it-yourself kit: the same custom figurine from a photo, sent white and primed, with 6 paints in its own colours, 2 brushes and a colour guide. A gift of time together for couples and families.",
};

const pages: Record<ProductId, { bg: string; en: string }> = {
  figurine: { bg: "/figurka-po-snimka", en: "/en/custom-figurine-from-photo" },
  keychain: { bg: "/figurka-na-domashen-lyubimets", en: "/en/pet-figurine-from-photo" },
  kit: { bg: "/figurka-za-otsvetyavane", en: "/en/paint-your-own-figurine" },
};

const production = productionDays.replace("работни дни", "working days");

export function shopInfo() {
  return {
    shop: siteName,
    url: absolute("/"),
    description: "Custom 3D printed, hand-painted figurines made from a photo, in a workshop in Ruse, Bulgaria. The customer sees a free AI preview in about a minute before ordering.",
    contact_email: business.email,
    currency: "EUR",
    production_time: production,
    languages: ["bg", "en"],
  };
}

export function listProducts() {
  return {
    currency: "EUR",
    production_time: production,
    products: productIds.map((id) => ({
      id,
      name: catalog[id].label,
      description: descriptions[id],
      subjects: id === "keychain" ? ["pet"] : ["person", "pet"],
      max_people: id === "keychain" ? 1 : maxPeople,
      page: { bg: absolute(pages[id].bg), en: absolute(pages[id].en) },
      sizes: catalog[id].sizes.map((size) => ({
        height_cm: size.cm,
        price_eur:
          id === "keychain"
            ? { pet: size.price }
            : { one_person: size.price, two_people: priceFor(id, size.cm, 2), three_people: priceFor(id, size.cm, 3), pet: priceFor(id, size.cm, 1, "pet") },
      })),
    })),
  };
}

type Choice = { product: ProductId; size_cm: number; subject: SubjectId; people: number };

/** Checks a product choice sent by an agent; throws an AgentError that says what is allowed. */
export function readChoice(input: Record<string, unknown>): Choice {
  const product = String(input.product ?? "figurine");
  if (!isProductId(product) || !productIds.includes(product)) throw new AgentError(`Unknown product. Use one of: ${productIds.join(", ")}.`);
  const subject = String(input.subject ?? (product === "keychain" ? "pet" : "person"));
  if (!isSubjectId(subject)) throw new AgentError("subject must be person or pet.");
  if (product === "keychain" && subject !== "pet") throw new AgentError("Keychains are made of pets only.");
  const sizes = catalog[product].sizes.map((size) => size.cm as number);
  const size = Number(input.size_cm ?? sizes[0]);
  if (!sizes.includes(size)) throw new AgentError(`size_cm for ${product} must be one of: ${sizes.join(", ")}.`);
  const people = subject === "pet" ? 1 : Math.floor(Number(input.people ?? 1));
  if (!(people >= 1 && people <= maxPeople)) throw new AgentError(`people must be 1 to ${maxPeople}.`);
  return { product, size_cm: size, subject, people };
}

export function quote(input: Record<string, unknown>) {
  const choice = readChoice(input);
  const price = priceFor(choice.product, choice.size_cm, choice.people, choice.subject)!;
  return {
    ...choice,
    price_eur: price,
    shipping: "Not included. Bulgaria: courier rate (Econt or Speedy), paid on delivery. Other countries: see get_shipping.",
    production_time: production,
    order_link: orderLink(choice).url,
  };
}

/** A studio link already set to the product, size and number of people. The customer uploads the photo there. */
export function orderLink(input: Record<string, unknown>) {
  const choice = readChoice(input);
  const lang = input.lang === "bg" ? "bg" : "en";
  const params = new URLSearchParams({
    product: choice.product,
    cm: String(choice.size_cm),
    subject: choice.subject,
    ...(choice.people > 1 ? { people: String(choice.people) } : {}),
    utm_source: "ai-agent",
    utm_medium: "mcp",
  });
  return {
    url: absolute(`${lang === "bg" ? "/studio" : "/en/studio"}?${params}`),
    next_steps: [
      "Open the link, upload one clear photo (faces visible; for a pet, the whole animal).",
      "A free preview of the figurine appears in about a minute; change it with the chat if needed.",
      "Add it to the cart and order. The shop confirms by phone or email before making it.",
    ],
  };
}

export function shipping(country?: unknown) {
  const code = typeof country === "string" ? country.trim().toUpperCase().slice(0, 2) : "";
  const bulgaria = {
    country: "BG",
    couriers: ["Econt", "Speedy"],
    delivery_time: "1–2 working days after making",
    cost: "Courier rate of Econt or Speedy, paid on delivery",
    payment: "Cash on delivery (pay when it arrives). Nothing to pay in advance.",
  };
  const abroad = {
    country: code && code !== "BG" ? code : "other",
    couriers: ["Speedy / DPD"],
    delivery_time: "2–5 working days after making (EU)",
    cost: "About 10–12 EUR to Greece; other countries on request",
    payment: "20 EUR deposit by Revolut or bank transfer to start; the rest before shipping, after photos of the finished figurine. Tracking number included.",
    how_to_order: `Order in the studio, or send an inquiry (send_inquiry) or email ${business.email}; the shop replies with the exact price.`,
  };
  return { production_time: production, ...(code === "BG" ? bulgaria : code ? abroad : { bulgaria, abroad }) };
}

export function realPhotos(limit?: unknown) {
  const n = Math.min(realPieces.length, Math.max(1, Math.floor(Number(limit) || realPieces.length)));
  return {
    note: "Photos of real finished figurines made by the shop (not AI renders).",
    gallery_page: absolute("/en#real"),
    photos: realPieces.slice(0, n).map((piece) => ({ image_url: absolute(piece.result), caption: piece.caption.en })),
  };
}

export function faq(lang?: unknown) {
  return { faq: dict[lang === "bg" ? "bg" : "en"].faq.map((item) => ({ question: item.q, answer: item.a })) };
}

/** Sends the shop an email from an agent on behalf of a person. Limited per IP and per day. */
export async function sendInquiry(input: Record<string, unknown>, req: Request) {
  const name = cleanText(input.name, 80);
  const email = cleanText(input.email, 120);
  const phone = cleanText(input.phone, 30);
  const message = cleanText(input.message, 3000);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
    throw new AgentError("name, a valid email and a message (at least 10 characters) are required.");
  }
  if (!(await allow("agent-inquiry", req, 3, 3600))) throw new AgentError("Too many inquiries from this address. Try again in an hour.", 429);
  const day = new Date().toISOString().slice(0, 10);
  if ((await incr(`rl:agent-inquiry:day:${day}`, 90000)) > 40) throw new AgentError(`Too many inquiries today. Please email ${business.email}.`, 429);
  const country = cleanText(req.headers.get("x-vercel-ip-country"), 2).toUpperCase();
  await sendContactMail({
    name,
    email,
    phone,
    message,
    origin: { channel: "ai", referrer: "MCP / API агент", ...(/^[A-Z]{2}$/.test(country) ? { country } : {}) },
    page: "AI агент (MCP / API)",
  });
  return { sent: true, reply: `The shop got the message and usually replies to ${email} within a day.` };
}
