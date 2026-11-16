import { catalog, maxPeople, productIds } from "@/lib/catalog";
import { AgentError, apiVersion, faq, listProducts, orderLink, quote, realPhotos, sendInquiry, shipping, shopInfo } from "@/lib/agent-api";
import { absolute, siteName } from "@/lib/site";
import { GET as llmsFull } from "@/app/llms-full.txt/route";
import { GET as llms } from "@/app/llms.txt/route";

// A small, stateless MCP server (Streamable HTTP, JSON responses) for AI agents: Claude, ChatGPT,
// Cursor and others can connect to https://handy-crafts.digital/mcp and use the shop's tools.

const versions = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];
const allSizes = [...new Set(productIds.flatMap((id) => catalog[id].sizes.map((size) => size.cm as number)))].sort((a, b) => a - b);

const choiceSchema = {
  product: { type: "string", enum: productIds, description: "figurine (hand-painted), kit (paint it yourself) or keychain (pets only)." },
  size_cm: { type: "number", enum: allSizes, description: "Height in cm. figurine: 14/17/20, kit: 17/20, keychain: 6/10." },
  subject: { type: "string", enum: ["person", "pet"], description: "Who the figurine shows. Default person (pet for keychain)." },
  people: { type: "integer", minimum: 1, maximum: maxPeople, description: "People on one base (person only). Default 1." },
};

type Tool = {
  name: string;
  title: string;
  description: string;
  inputSchema: { type: "object"; properties: Record<string, unknown>; required?: string[] };
  annotations: { readOnlyHint: boolean; openWorldHint: boolean; destructiveHint?: boolean; idempotentHint?: boolean };
  run: (args: Record<string, unknown>, req: Request) => unknown;
};

const readOnly = { readOnlyHint: true, openWorldHint: false, idempotentHint: true };

export const tools: Tool[] = [
  {
    name: "list_products",
    title: "Products and prices",
    description: "All HandyCrafts products (custom figurines from a photo, paint-it-yourself kits, pet keychains) with every size and price in EUR.",
    inputSchema: { type: "object", properties: {} },
    annotations: readOnly,
    run: () => listProducts(),
  },
  {
    name: "get_quote",
    title: "Price for a figurine",
    description: "Exact price in EUR for a product, size, subject and number of people, plus a ready order link.",
    inputSchema: { type: "object", properties: choiceSchema, required: ["product", "size_cm"] },
    annotations: readOnly,
    run: (args) => quote(args),
  },
  {
    name: "create_order_link",
    title: "Order link",
    description:
      "A link to the HandyCrafts studio already set to the chosen product and size. Give it to the user: they upload one photo, see a free preview in about a minute and order there. Use this whenever the user wants to order.",
    inputSchema: { type: "object", properties: { ...choiceSchema, lang: { type: "string", enum: ["en", "bg"], description: "Site language. Default en." } }, required: ["product"] },
    annotations: readOnly,
    run: (args) => orderLink(args),
  },
  {
    name: "get_shipping",
    title: "Shipping and payment",
    description: "Delivery times, couriers, costs and payment for Bulgaria (cash on delivery) and other countries (deposit by Revolut).",
    inputSchema: { type: "object", properties: { country: { type: "string", description: "Two-letter country code, e.g. BG, GR, DE. Optional." } } },
    annotations: readOnly,
    run: (args) => shipping(args.country),
  },
  {
    name: "get_real_photos",
    title: "Photos of real figurines",
    description: "Image URLs and captions of real finished figurines made by the shop, to show the user the quality.",
    inputSchema: { type: "object", properties: { limit: { type: "integer", minimum: 1, maximum: 50, description: "How many photos. Default all." } } },
    annotations: readOnly,
    run: (args) => realPhotos(args.limit),
  },
  {
    name: "get_faq",
    title: "Common questions",
    description: "Answers to common questions: photos that work, timing, materials, painting, groups, pets, gifts, returns.",
    inputSchema: { type: "object", properties: { lang: { type: "string", enum: ["en", "bg"], description: "Default en." } } },
    annotations: readOnly,
    run: (args) => faq(args.lang),
  },
  {
    name: "send_inquiry",
    title: "Message the shop",
    description:
      "Send the shop an email on the user's behalf (custom requests, delivery abroad, deadlines, bigger orders). Only with the user's consent and their real name and email; the shop replies to that email.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "The user's name." },
        email: { type: "string", description: "The user's email for the reply." },
        phone: { type: "string", description: "Optional phone number." },
        message: { type: "string", description: "What the user wants, in English or Bulgarian." },
      },
      required: ["name", "email", "message"],
    },
    annotations: { readOnlyHint: false, openWorldHint: true, destructiveHint: false, idempotentHint: false },
    run: (args, req) => sendInquiry(args, req),
  },
];

const resources = [
  { uri: absolute("/llms.txt"), name: "llms.txt", title: "Shop summary", mimeType: "text/plain" },
  { uri: absolute("/llms-full.txt"), name: "llms-full.txt", title: "Full site text", mimeType: "text/plain" },
  { uri: absolute("/catalog.json"), name: "catalog.json", title: "Catalog (JSON)", mimeType: "application/json" },
];

const instructions = `${siteName} makes custom 3D printed, hand-painted figurines from a photo in Bulgaria. Use list_products or get_quote for prices (EUR), get_real_photos to show real work, and create_order_link when the user wants one: they upload the photo and see a free preview on the site. Use send_inquiry only with the user's consent.`;

type RpcRequest = { jsonrpc?: string; id?: string | number | null; method?: string; params?: Record<string, unknown> };

const ok = (id: RpcRequest["id"], result: unknown) => ({ jsonrpc: "2.0", id: id ?? null, result });
const fail = (id: RpcRequest["id"], code: number, message: string) => ({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });

export function serverInfo() {
  return { name: "handycrafts", title: `${siteName} figurines`, version: apiVersion, websiteUrl: absolute("/") };
}

/** Answers one JSON-RPC message; null for notifications (no reply). */
export async function handleRpc(message: RpcRequest, req: Request) {
  if (!message || typeof message !== "object" || message.jsonrpc !== "2.0" || typeof message.method !== "string") {
    return fail(message?.id, -32600, "Invalid request");
  }
  const { id, method, params = {} } = message;
  if (id === undefined) return null;

  switch (method) {
    case "initialize": {
      const asked = String(params.protocolVersion || "");
      return ok(id, {
        protocolVersion: versions.includes(asked) ? asked : versions[1],
        capabilities: { tools: { listChanged: false }, resources: { listChanged: false }, prompts: { listChanged: false } },
        serverInfo: serverInfo(),
        instructions,
      });
    }
    case "ping":
      return ok(id, {});
    case "tools/list":
      return ok(id, { tools: tools.map(({ name, title, description, inputSchema, annotations }) => ({ name, title, description, inputSchema, annotations })) });
    case "tools/call": {
      const tool = tools.find((item) => item.name === params.name);
      if (!tool) return fail(id, -32602, `Unknown tool: ${String(params.name)}`);
      const args = params.arguments && typeof params.arguments === "object" ? (params.arguments as Record<string, unknown>) : {};
      try {
        const result = await tool.run(args, req);
        return ok(id, { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], structuredContent: result, isError: false });
      } catch (error) {
        const text = error instanceof AgentError ? error.message : "Something went wrong. Please try again or email handycraftshelp@gmail.com.";
        if (!(error instanceof AgentError)) console.error("MCP", tool.name, error);
        return ok(id, { content: [{ type: "text", text }], isError: true });
      }
    }
    case "resources/list":
      return ok(id, { resources });
    case "resources/read": {
      const resource = resources.find((item) => item.uri === params.uri);
      if (!resource) return fail(id, -32002, "Resource not found");
      const text = resource.name === "catalog.json" ? JSON.stringify({ ...shopInfo(), ...listProducts() }, null, 2) : await (resource.name === "llms.txt" ? llms() : llmsFull()).text();
      return ok(id, { contents: [{ uri: resource.uri, mimeType: resource.mimeType, text }] });
    }
    case "prompts/list":
      return ok(id, { prompts: [] });
    case "resources/templates/list":
      return ok(id, { resourceTemplates: [] });
    default:
      return fail(id, -32601, `Method not found: ${method}`);
  }
}

