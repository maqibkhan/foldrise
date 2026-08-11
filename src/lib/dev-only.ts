import { NextResponse } from "next/server";

/**
 * Every /admin page and /api/admin/* route calls this first. There is no
 * password — the entire CMS surface simply doesn't exist outside of
 * `next dev`, so shipping this code to Vercel is harmless: production
 * requests get a plain 404 instead of ever reaching the handler.
 */
export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

export function devOnlyResponse(): NextResponse {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
