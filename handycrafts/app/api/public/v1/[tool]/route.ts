import { AgentError, cors, faq, listProducts, orderLink, quote, realPhotos, sendInquiry, shipping, shopInfo } from "@/lib/agent-api";

// Public read-only API for AI agents and apps (described in /openapi.json). No key needed.
export const runtime = "nodejs";

type Query = Record<string, unknown>;
const reads: Record<string, (query: Query) => unknown> = {
  shop: () => shopInfo(),
  products: () => listProducts(),
  quote: (query) => quote(query),
  "order-link": (query) => orderLink(query),
  shipping: (query) => shipping(query.country),
  photos: (query) => realPhotos(query.limit),
  faq: (query) => faq(query.lang),
};

const json = (body: unknown, status = 200, cache = false) =>
  Response.json(body, { status, headers: { ...cors, ...(cache && status === 200 ? { "Cache-Control": "public, max-age=600, s-maxage=3600" } : {}) } });

function failure(error: unknown) {
  if (error instanceof AgentError) return json({ error: error.message }, error.status);
  console.error("PUBLIC API", error);
  return json({ error: "Something went wrong." }, 500);
}

export async function GET(req: Request, { params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const read = reads[tool];
  if (!read) return json({ error: `Unknown endpoint. Use: ${Object.keys(reads).join(", ")}, inquiry (POST).` }, 404);
  try {
    return json(read(Object.fromEntries(new URL(req.url).searchParams)), 200, true);
  } catch (error) {
    return failure(error);
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  if (tool !== "inquiry") return json({ error: "Only /inquiry accepts POST." }, 405);
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return json({ error: "Send a JSON body." }, 400);
  try {
    return json(await sendInquiry(body as Query, req));
  } catch (error) {
    return failure(error);
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: cors });
}
