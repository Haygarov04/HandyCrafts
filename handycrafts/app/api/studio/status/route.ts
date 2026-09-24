import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ previews: Boolean(process.env.XAI_API_KEY) });
}
