import { cors } from "@/lib/agent-api";
import { handleRpc, serverInfo, tools } from "@/lib/mcp";
import { absolute } from "@/lib/site";

// MCP endpoint (Streamable HTTP, stateless, JSON responses). Connect an agent to https://handy-crafts.digital/mcp
export const runtime = "nodejs";

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: cors });

export async function POST(req: Request) {
  const body = await req.json().catch(() => undefined);
  if (body === undefined) return json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, 400);
  if (Array.isArray(body)) {
    const replies = (await Promise.all(body.map((message) => handleRpc(message, req)))).filter(Boolean);
    return replies.length ? json(replies) : new Response(null, { status: 202, headers: cors });
  }
  const reply = await handleRpc(body, req);
  return reply ? json(reply) : new Response(null, { status: 202, headers: cors });
}

// No server-to-client stream: MCP clients get 405, people and crawlers get a short description.
export function GET(req: Request) {
  if ((req.headers.get("accept") || "").includes("text/event-stream")) return new Response(null, { status: 405, headers: { ...cors, Allow: "POST, OPTIONS" } });
  return json({
    ...serverInfo(),
    description: "MCP server of HandyCrafts: custom 3D printed, hand-painted figurines from a photo. POST JSON-RPC here (Streamable HTTP, no auth).",
    endpoint: absolute("/mcp"),
    tools: tools.map((tool) => ({ name: tool.name, description: tool.description })),
    docs: absolute("/developers"),
    openapi: absolute("/openapi.json"),
  });
}

export function DELETE() {
  return new Response(null, { status: 405, headers: { ...cors, Allow: "POST, OPTIONS" } });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: cors });
}
