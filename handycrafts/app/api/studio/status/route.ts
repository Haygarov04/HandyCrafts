import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    grok: Boolean(process.env.XAI_API_KEY),
    meshy: Boolean(process.env.MESHY_API_KEY),
  });
}
