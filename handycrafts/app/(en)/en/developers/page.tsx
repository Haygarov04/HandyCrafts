import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import { tools } from "@/lib/mcp";
import { pageMetadata } from "@/lib/seo";
import { absolute, business, siteName } from "@/lib/site";

export const metadata: Metadata = pageMetadata("en", "/en/developers", {
  title: "MCP server and public API for AI agents — HandyCrafts",
  description: "Connect Claude, ChatGPT, Cursor or any AI agent to HandyCrafts: an open MCP server and a public REST API for custom figurine prices, real photos and order links. No key needed.",
  bgOnly: true,
});

const code = "block overflow-x-auto rounded-2xl bg-ink px-5 py-4 text-[13px] leading-6 text-white/90";

export default function Page() {
  const mcp = absolute("/mcp");
  const api = absolute("/api/public/v1");
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebAPI",
          name: `${siteName} MCP server and public API`,
          description: "Prices, sizes, shipping, real photos and order links for custom 3D printed, hand-painted figurines from a photo.",
          url: absolute("/en/developers"),
          documentation: absolute("/openapi.json"),
          provider: { "@type": "Organization", name: siteName, url: absolute("/"), email: business.email },
        }}
      />
      <section className="px-4 pb-20 pt-24 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-ink/50">
            <Link href="/en" className="hover:text-ink">Home</Link> / <span className="text-ink/70">For AI agents</span>
          </nav>
          <h1 className="mt-6 text-[2rem] leading-[1.1] tracking-[-0.03em] sm:text-5xl">MCP server and API for AI agents</h1>
          <p className="mt-4 text-lg text-ink/65">
            Let an AI assistant find the right figurine for someone: prices, sizes, real photos, shipping, and a link where they upload a photo and see a free preview. Open to everyone, no key.
          </p>

          <h2 className="mt-12 font-display text-2xl">MCP server</h2>
          <p className="mt-3 text-ink/70">Streamable HTTP, no authentication:</p>
          <code className={`${code} mt-3`}>{mcp}</code>
          <p className="mt-5 text-ink/70">Claude Code:</p>
          <code className={`${code} mt-3`}>claude mcp add --transport http handycrafts {mcp}</code>
          <p className="mt-5 text-ink/70">Claude, ChatGPT, Cursor and other apps: add a custom connector (remote MCP server) with the URL above. Or in a config file:</p>
          <pre className={`${code} mt-3`}>{JSON.stringify({ mcpServers: { handycrafts: { type: "http", url: mcp } } }, null, 2)}</pre>

          <h2 className="mt-12 font-display text-2xl">Tools</h2>
          <ul className="mt-4 space-y-3">
            {tools.map((tool) => (
              <li key={tool.name} className="rounded-2xl bg-white p-4">
                <span className="font-mono text-sm">{tool.name}</span>
                <span className="mt-1 block text-sm leading-6 text-ink/65">{tool.description}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 font-display text-2xl">REST API</h2>
          <p className="mt-3 text-ink/70">
            The same tools over plain HTTP, described in <a className="underline" href="/openapi.json">openapi.json</a> (works as a GPT action). Base URL:
          </p>
          <code className={`${code} mt-3`}>{api}</code>
          <pre className={`${code} mt-4`}>{`GET ${api}/products
GET ${api}/quote?product=figurine&size_cm=17&people=2
GET ${api}/order-link?product=kit&size_cm=20&subject=pet
GET ${api}/shipping?country=GR
GET ${api}/photos?limit=6
GET ${api}/faq
POST ${api}/inquiry  {"name","email","message"}`}</pre>

          <h2 className="mt-12 font-display text-2xl">Also for agents</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-ink/70">
            <li><a className="underline" href="/llms.txt">llms.txt</a> and <a className="underline" href="/llms-full.txt">llms-full.txt</a></li>
            <li><a className="underline" href="/catalog.json">catalog.json</a></li>
            <li><a className="underline" href="/.well-known/mcp/server-card.json">MCP server card</a> and <a className="underline" href="/.well-known/api-catalog">API catalog</a></li>
          </ul>
          <p className="mt-10 text-sm text-ink/55">
            Please send inquiries only with the person&apos;s consent. Questions: <a className="underline" href={`mailto:${business.email}`}>{business.email}</a>
          </p>
        </div>
      </section>
    </>
  );
}
