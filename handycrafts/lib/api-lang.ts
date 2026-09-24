/** Picks the Bulgarian or English message based on the x-lang header the site sends. */
export function translator(req: Request) {
  const en = req.headers.get("x-lang") === "en";
  return (bg: string, english: string) => (en ? english : bg);
}
