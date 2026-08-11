import { NextResponse } from "next/server";
import { devOnlyResponse, isDev } from "@/lib/dev-only";
import { reorderTickerImages } from "@/lib/cms";

export async function POST(request: Request) {
  if (!isDev()) return devOnlyResponse();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const ids =
    typeof body === "object" && body !== null && "ids" in body && Array.isArray((body as { ids: unknown }).ids)
      ? ((body as { ids: unknown[] }).ids.filter((id) => typeof id === "string") as string[])
      : null;

  if (!ids || ids.length === 0) {
    return NextResponse.json({ error: "ids must be a non-empty array of strings" }, { status: 400 });
  }

  try {
    await reorderTickerImages(ids);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reorder ticker images error:", err);
    return NextResponse.json({ error: "Failed to reorder images" }, { status: 500 });
  }
}
