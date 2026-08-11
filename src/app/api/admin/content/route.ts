import { NextResponse } from "next/server";
import { devOnlyResponse, isDev } from "@/lib/dev-only";
import { getSiteContent, updateSiteContent, type SiteContent } from "@/lib/cms";

export async function GET() {
  if (!isDev()) return devOnlyResponse();

  try {
    const content = await getSiteContent();
    return NextResponse.json({ content });
  } catch (err) {
    console.error("Get site content error:", err);
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!isDev()) return devOnlyResponse();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { headline, body: bodyText, buttonLabel, footerNote } = body as Record<string, unknown>;
  if (
    typeof headline !== "string" ||
    typeof bodyText !== "string" ||
    typeof buttonLabel !== "string" ||
    typeof footerNote !== "string"
  ) {
    return NextResponse.json(
      { error: "headline, body, buttonLabel, and footerNote must all be strings" },
      { status: 400 }
    );
  }

  const content: SiteContent = { headline, body: bodyText, buttonLabel, footerNote };

  try {
    await updateSiteContent(content);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update site content error:", err);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
