import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { manageAllowed } from "@/lib/manage-auth";
import { sameOrigin } from "@/lib/security";
import { setDiscountOn } from "@/lib/settings";

export const runtime = "nodejs";

/** Switches the −10 € discount on or off for the whole shop. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Невалидна заявка." }, { status: 403 });
  if (!(await manageAllowed())) return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const on = body.on === true;
  await setDiscountOn(on);
  // Every page shows prices: rebuild them all with the new ones.
  revalidatePath("/", "layout");
  revalidatePath("/en", "layout");
  return NextResponse.json({ on });
}
