export const dynamic = "force-static";

export function GET() {
  const manifest = {
    id: "/manage",
    name: "HandyCrafts Поръчки",
    short_name: "Поръчки",
    description: "Поръчките на HandyCrafts",
    start_url: "/manage",
    scope: "/manage",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f6f1e8",
    theme_color: "#161513",
    lang: "bg",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
  return new Response(JSON.stringify(manifest), {
    headers: { "Content-Type": "application/manifest+json" },
  });
}
