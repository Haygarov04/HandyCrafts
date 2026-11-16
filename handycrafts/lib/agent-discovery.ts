import { cors } from "@/lib/agent-api";
import { serverInfo, tools } from "@/lib/mcp";
import { absolute, business, siteName } from "@/lib/site";

// Discovery files that let agents find the MCP server and the API on their own (/.well-known/…).

export function serverCard() {
  return Response.json(
    {
      $schema: "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
      version: "1.0",
      protocolVersion: "2025-06-18",
      serverInfo: serverInfo(),
      description: "Custom 3D printed, hand-painted figurines from a photo (people, couples, families, pets) and paint-it-yourself kits, made in Bulgaria. Prices, real photos, order links.",
      documentationUrl: absolute("/en/developers"),
      transport: { type: "streamable-http", endpoint: absolute("/mcp") },
      remotes: [{ type: "streamable-http", url: absolute("/mcp") }],
      authentication: { required: false, schemes: [] },
      capabilities: { tools: { listChanged: false }, resources: { listChanged: false } },
      tools: tools.map(({ name, title, description }) => ({ name, title, description })),
    },
    { headers: { ...cors, "Cache-Control": "public, max-age=3600" } }
  );
}

export function apiCatalog() {
  return new Response(
    JSON.stringify({
      linkset: [
        {
          anchor: absolute("/api/public/v1"),
          "service-desc": [{ href: absolute("/openapi.json"), type: "application/vnd.oai.openapi+json" }],
          "service-doc": [{ href: absolute("/en/developers"), type: "text/html" }],
        },
        {
          anchor: absolute("/mcp"),
          "service-desc": [{ href: absolute("/.well-known/mcp/server-card.json"), type: "application/json" }],
          "service-doc": [{ href: absolute("/en/developers"), type: "text/html" }],
        },
      ],
    }),
    { headers: { ...cors, "Content-Type": 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"', "Cache-Control": "public, max-age=3600" } }
  );
}

export function aiPlugin() {
  return Response.json(
    {
      schema_version: "v1",
      name_for_human: `${siteName} figurines`,
      name_for_model: "handycrafts",
      description_for_human: "Custom 3D printed, hand-painted figurines from your photo.",
      description_for_model:
        "Prices, sizes, shipping, real photos and order links for custom 3D printed, hand-painted figurines from a photo (people, couples, families up to 3, pets) and paint-it-yourself kits from HandyCrafts, Bulgaria. Give the user the order link; they upload the photo and see a free preview there.",
      auth: { type: "none" },
      api: { type: "openapi", url: absolute("/openapi.json") },
      logo_url: absolute("/icon.png"),
      contact_email: business.email,
      legal_info_url: absolute("/en/terms"),
    },
    { headers: { ...cors, "Cache-Control": "public, max-age=3600" } }
  );
}
