import { apiCatalog } from "@/lib/agent-discovery";

// RFC 9727 API catalog: where the public API and the MCP server are described.
export const dynamic = "force-static";

export function GET() {
  return apiCatalog();
}
