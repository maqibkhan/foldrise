import { NextResponse } from "next/server";
import { devOnlyResponse, isDev } from "@/lib/dev-only";
import { deleteTickerImage } from "@/lib/cms";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isDev()) return devOnlyResponse();

  const { id } = await params;

  try {
    await deleteTickerImage(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete ticker image error:", err);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
