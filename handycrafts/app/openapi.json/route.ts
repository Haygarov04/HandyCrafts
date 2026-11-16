import { catalog, maxPeople, productIds } from "@/lib/catalog";
import { apiVersion, cors } from "@/lib/agent-api";
import { absolute, business, siteName } from "@/lib/site";

// OpenAPI description of the public API, for GPT actions, agent frameworks and API directories.
export const dynamic = "force-static";

const sizes = [...new Set(productIds.flatMap((id) => catalog[id].sizes.map((size) => size.cm as number)))].sort((a, b) => a - b);
const q = (name: string, description: string, schema: Record<string, unknown>, required = false) => ({ name, in: "query", required, description, schema });
const choice = [
  q("product", "figurine (hand-painted), kit (paint it yourself) or keychain (pets only)", { type: "string", enum: productIds }, true),
  q("size_cm", "Height in cm. figurine 14/17/20, kit 17/20, keychain 6/10", { type: "integer", enum: sizes }),
  q("subject", "person or pet", { type: "string", enum: ["person", "pet"] }),
  q("people", "People on one base (person only)", { type: "integer", minimum: 1, maximum: maxPeople }),
];
const ok = (description: string) => ({ "200": { description, content: { "application/json": { schema: { type: "object" } } } }, "400": { description: "Invalid input" } });

export function GET() {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: `${siteName} public API`,
      version: apiVersion,
      description:
        "Custom 3D printed, hand-painted figurines from a photo (people, couples, families, pets) and paint-it-yourself kits, made in Bulgaria. Read products and prices, get an order link for the user, or message the shop. No key needed. The same tools are available over MCP at " +
        absolute("/mcp") +
        ".",
      contact: { name: siteName, email: business.email, url: absolute("/en/developers") },
    },
    servers: [{ url: absolute("/api/public/v1") }],
    paths: {
      "/shop": { get: { operationId: "getShop", summary: "About the shop", responses: ok("Shop info") } },
      "/products": { get: { operationId: "listProducts", summary: "All products, sizes and prices in EUR", responses: ok("Products") } },
      "/quote": { get: { operationId: "getQuote", summary: "Price for a product, size and number of people", parameters: choice, responses: ok("Price and order link") } },
      "/order-link": {
        get: {
          operationId: "createOrderLink",
          summary: "Studio link set to the product; the user uploads a photo there and sees a free preview",
          parameters: [...choice, q("lang", "en or bg", { type: "string", enum: ["en", "bg"] })],
          responses: ok("Order link"),
        },
      },
      "/shipping": { get: { operationId: "getShipping", summary: "Delivery and payment, by country", parameters: [q("country", "Two-letter code, e.g. BG, GR", { type: "string" })], responses: ok("Shipping") } },
      "/photos": { get: { operationId: "getRealPhotos", summary: "Photos of real finished figurines", parameters: [q("limit", "How many", { type: "integer", minimum: 1 })], responses: ok("Photos") } },
      "/faq": { get: { operationId: "getFaq", summary: "Common questions", parameters: [q("lang", "en or bg", { type: "string", enum: ["en", "bg"] })], responses: ok("FAQ") } },
      "/inquiry": {
        post: {
          operationId: "sendInquiry",
          summary: "Email the shop on the user's behalf (only with their consent)",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "message"],
                  properties: { name: { type: "string" }, email: { type: "string", format: "email" }, phone: { type: "string" }, message: { type: "string", minLength: 10 } },
                },
              },
            },
          },
          responses: { ...ok("Sent"), "429": { description: "Too many inquiries" } },
        },
      },
    },
  };
  return Response.json(spec, { headers: { ...cors, "Cache-Control": "public, max-age=3600" } });
}
