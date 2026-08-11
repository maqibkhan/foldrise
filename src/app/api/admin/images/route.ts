import { NextResponse } from "next/server";
import { devOnlyResponse, isDev } from "@/lib/dev-only";
import { addTickerImage, listTickerImages } from "@/lib/cms";

export async function GET() {
  if (!isDev()) return devOnlyResponse();

  try {
    const images = await listTickerImages();
    return NextResponse.json({ images });
  } catch (err) {
    console.error("List ticker images error:", err);
    return NextResponse.json({ error: "Failed to load images" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isDev()) return devOnlyResponse();

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be under 10MB" }, { status: 400 });
  }

  const filename = file instanceof File ? file.name : "upload.webp";

  try {
    const image = await addTickerImage(file, filename);
    return NextResponse.json({ image }, { status: 201 });
  } catch (err) {
    console.error("Upload ticker image error:", err);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
